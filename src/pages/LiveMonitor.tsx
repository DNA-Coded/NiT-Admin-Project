import { useState, useEffect } from 'react';
import {
  initialLiveEvents,
  initialCampusPresence,
  mockAlerts,
  namesPool,
  deptsPool,
  devicesPool,
  idsPool,
  statusesPool,
} from '@/mocks/liveMonitor';
import { mockDevices } from '@/mocks/devices';
import type { LiveEvent, CampusPresence } from '@/types/liveMonitor';
import type { Device } from '@/types/devices';
import { SummaryStrip } from '@/features/live-monitor/components/SummaryStrip';
import { LiveAttendanceFeed } from '@/features/live-monitor/components/LiveAttendanceFeed';
import { CampusPresenceList } from '@/features/live-monitor/components/CampusPresenceList';
import { DeviceStatusGrid } from '@/features/live-monitor/components/DeviceStatusGrid';
import { AlertsPanel } from '@/features/live-monitor/components/AlertsPanel';

export default function LiveMonitor() {
  const [events, setEvents] = useState<LiveEvent[]>(initialLiveEvents);
  const [presenceList, setPresenceList] = useState<CampusPresence[]>(initialCampusPresence);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [lastEventTime, setLastEventTime] = useState<string>('12:01:15 PM');
  const [counters, setCounters] = useState({
    currentlyInside: 1098,
    totalCheckIns: 1102,
    totalCheckOuts: 4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Generate random details for new biometric log
      const timeString = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const name = namesPool[Math.floor(Math.random() * namesPool.length)];
      const id = idsPool[Math.floor(Math.random() * idsPool.length)];
      const dept = deptsPool[Math.floor(Math.random() * deptsPool.length)];
      const device = devicesPool[Math.floor(Math.random() * devicesPool.length)];
      const actionType: 'Check In' | 'Check Out' =
        Math.random() > 0.35 ? 'Check In' : 'Check Out';
      const statusVal = statusesPool[Math.floor(Math.random() * statusesPool.length)];

      const newEvent: LiveEvent = {
        id: `ev-${Date.now()}`,
        timestamp: timeString,
        employeeName: name,
        employeeId: id,
        department: dept,
        deviceName: device.name,
        deviceLocation: device.location,
        eventType: actionType,
        status: statusVal,
        isNew: true,
      };

      // Update events stream list (max 15 items)
      setEvents((prev) => [newEvent, ...prev.slice(0, 14)]);
      setLastEventTime(timeString);

      // 2. Adjust counters & Campus Presence list
      if (actionType === 'Check In') {
        setCounters((prev) => ({
          ...prev,
          currentlyInside: prev.currentlyInside + 1,
          totalCheckIns: prev.totalCheckIns + 1,
        }));
        
        // Add to campus presence list if not present
        setPresenceList((prev) => {
          if (prev.some((p) => p.employeeId === id)) return prev;
          const newPresence: CampusPresence = {
            employeeId: id,
            name,
            department: dept,
            checkInTime: timeString.slice(0, 8),
            durationOnCampus: '1 min',
            status: statusVal,
          };
          return [newPresence, ...prev];
        });
      } else {
        setCounters((prev) => ({
          ...prev,
          currentlyInside: Math.max(0, prev.currentlyInside - 1),
          totalCheckOuts: prev.totalCheckOuts + 1,
        }));

        // Remove from campus presence
        setPresenceList((prev) => prev.filter((p) => p.employeeId !== id));
      }

      // 3. Update device events count
      setDevices((prevDevices) =>
        prevDevices.map((d) => {
          if (d.name === device.name) {
            return {
              ...d,
              lastPing: 'Just now',
              totalEventsToday: (d.totalEventsToday || 0) + 1,
            };
          }
          return d;
        })
      );

      // Remove highlighting flash after 1 second
      setTimeout(() => {
        setEvents((prev) =>
          prev.map((e) => (e.id === newEvent.id ? { ...e, isNew: false } : e))
        );
      }, 1000);

    }, 3500);

    return () => clearInterval(interval);
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
        <div className="flex items-center gap-2 bg-[#ecfdf5] text-[#065f46] px-3.5 py-1.5 rounded-full border border-[#a7f3d0] shadow-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-label-sm text-label-sm font-bold">SYSTEM ACTIVE</span>
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
        <AlertsPanel alerts={mockAlerts} />
      </div>
    </div>
  );
}
