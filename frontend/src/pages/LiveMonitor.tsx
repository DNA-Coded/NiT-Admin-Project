import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import type { LiveEvent, CampusPresence } from '@/types/liveMonitor';
import type { Device } from '@/types/devices';
import { SummaryStrip } from '@/features/live-monitor/components/SummaryStrip';
import { LiveAttendanceFeed } from '@/features/live-monitor/components/LiveAttendanceFeed';
import { CampusPresenceList } from '@/features/live-monitor/components/CampusPresenceList';
import { DeviceStatusGrid } from '@/features/live-monitor/components/DeviceStatusGrid';
import { AlertsPanel } from '@/features/live-monitor/components/AlertsPanel';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function LiveMonitor() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [presenceList, setPresenceList] = useState<CampusPresence[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastEventTime, setLastEventTime] = useState<string>('--:--:--');
  const [counters, setCounters] = useState({
    currentlyInside: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // ── 1. Fetch Initial Data & Set Up WebSockets ──────────────────────────────────
  useEffect(() => {
    // A. Fetch initial state from backend
    const fetchInitialState = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [devicesRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/devices`, { headers }).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_URL}/devices/events/today`, { headers }).catch(() => ({ data: { data: [] } })),
        ]);

        const deviceData = devicesRes.data?.data || [];
        setDevices(deviceData);

        // Populate initial counters if returned by API
        if (eventsRes.data?.data) {
          const fetchedLogs = eventsRes.data.data;
          setEvents(fetchedLogs.slice(0, 15));
        }
      } catch (err) {
        console.error('Failed to load initial live monitor data:', err);
      }
    };

    fetchInitialState();

    // B. Initialize Socket.io Connection
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Live Attendance Stream');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from Live Stream');
      setIsConnected(false);
    });

    // C. Handle Incoming Real-Time Scan Event (Biometric / RFID / Face)
    socket.on('device:event', (payload: any) => {
      const timeString = new Date(payload.timestamp || Date.now()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const actionType: 'Check In' | 'Check Out' = payload.eventType === 'CHECK_OUT' ? 'Check Out' : 'Check In';
      const employeeName = payload.employeeName || `User (${payload.userCode?.slice(-6) || 'Unknown'})`;
      const employeeId = payload.userCode || 'N/A';
      const department = payload.department || 'General';
      const deviceName = payload.deviceName || payload.deviceCode || 'Terminal';
      const deviceLocation = payload.building ? `${payload.building} - Fl ${payload.floor}` : 'Main Gate';

      const newEvent: LiveEvent = {
        id: `ev-${Date.now()}-${Math.random()}`,
        timestamp: timeString,
        employeeName,
        employeeId,
        department,
        deviceName,
        deviceLocation,
        eventType: actionType,
        status: payload.verificationMethod || 'AUTHENTICATED',
        isNew: true,
      };

      // 1. Add to live events feed (max 15 items)
      setEvents((prev) => [newEvent, ...prev.slice(0, 14)]);
      setLastEventTime(timeString);

      // 2. Adjust live counters & Campus Presence list
      if (actionType === 'Check In') {
        setCounters((prev) => ({
          ...prev,
          currentlyInside: prev.currentlyInside + 1,
          totalCheckIns: prev.totalCheckIns + 1,
        }));

        setPresenceList((prev) => {
          if (prev.some((p) => p.employeeId === employeeId)) return prev;
          return [
            {
              employeeId,
              name: employeeName,
              department,
              checkInTime: timeString,
              durationOnCampus: 'Just now',
              status: payload.verificationMethod || 'VERIFIED',
            },
            ...prev,
          ];
        });
      } else {
        setCounters((prev) => ({
          ...prev,
          currentlyInside: Math.max(0, prev.currentlyInside - 1),
          totalCheckOuts: prev.totalCheckOuts + 1,
        }));

        setPresenceList((prev) => prev.filter((p) => p.employeeId !== employeeId));
      }

      // 3. Increment total events today for the target device
      setDevices((prevDevices) =>
        prevDevices.map((d) => {
          if (d.deviceCode === payload.deviceCode || d.deviceName === deviceName) {
            return {
              ...d,
              status: 'ONLINE',
              lastSeen: new Date().toISOString(),
              totalEventsToday: (d.totalEventsToday || 0) + 1,
            };
          }
          return d;
        })
      );

      // Remove flash highlight after 1s
      setTimeout(() => {
        setEvents((prev) =>
          prev.map((e) => (e.id === newEvent.id ? { ...e, isNew: false } : e))
        );
      }, 1000);
    });

    // D. Handle Incoming Heartbeat / Device Status Update
    socket.on('device:status', (payload: { deviceId: string; deviceCode: string; status: string; healthStatus: string }) => {
      setDevices((prevDevices) =>
        prevDevices.map((d) => {
          if (d.id === payload.deviceId || d.deviceCode === payload.deviceCode) {
            return {
              ...d,
              status: payload.status as any,
              healthStatus: payload.healthStatus as any,
              lastSeen: new Date().toISOString(),
            };
          }
          return d;
        })
      );
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const onlineDevicesCount = devices.filter((d) => d.status === 'ONLINE').length;
  const offlineDevicesCount = devices.filter((d) => d.status === 'OFFLINE').length;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Live Attendance Monitor</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Real-time operations center tracking biometric authentication hardware syncs.
          </p>
        </div>
        
        {/* Connection Status Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs transition-colors ${
            isConnected
              ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="font-label-sm text-label-sm font-bold uppercase">
            {isConnected ? 'LIVE STREAM ACTIVE' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <SummaryStrip
        activeDevices={onlineDevicesCount}
        currentlyInside={counters.currentlyInside}
        lastEventTime={lastEventTime}
        offlineDevices={offlineDevicesCount}
        totalCheckIns={counters.totalCheckIns}
        totalCheckOuts={counters.totalCheckOuts}
      />

      {/* Primary operational workspace grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column: Live Event Stream Feed */}
        <div className="lg:col-span-2">
          <LiveAttendanceFeed events={events} />
        </div>
        {/* Right Column: Campus Presence panel */}
        <div>
          <CampusPresenceList presenceList={presenceList} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices health status monitor */}
        <DeviceStatusGrid devices={devices} />
        {/* Warnings / Alerts Panel */}
        <AlertsPanel alerts={[]} />
      </div>
    </div>
  );
}