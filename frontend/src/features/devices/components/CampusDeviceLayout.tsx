import React from 'react';
import type { Device } from '@/types/devices';

interface CampusDeviceLayoutProps {
  devices: Device[];
  onSelect: (device: Device) => void;
}

export const CampusDeviceLayout: React.FC<CampusDeviceLayoutProps> = ({ devices, onSelect }) => {
  // Group devices by building
  const grouped = devices.reduce<Record<string, Device[]>>((acc, d) => {
    const building = d.building || 'Unassigned Block';
    if (!acc[building]) acc[building] = [];
    acc[building].push(d);
    return acc;
  }, {});

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
      <div className="border-b border-outline-variant pb-3">
        <h3 className="font-headline-md text-headline-md text-primary font-bold">Campus Topology Structure</h3>
        <p className="text-body-sm text-on-surface-variant font-medium mt-1">Biometric hardware deployed across campus blocks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([building, items]) => (
          <div key={building} className="bg-surface border border-outline-variant/60 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary font-bold text-label-md border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-[18px]">domain</span>
              <span>{building}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded p-2.5 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between"
                  onClick={() => onSelect(item)}
                >
                  <div className="overflow-hidden pr-2">
                    <p className="font-label-sm text-[12px] text-on-surface font-bold truncate leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-outline truncate leading-none mt-0.5">{item.room}</p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.status === 'ONLINE'
                        ? 'bg-success animate-pulse'
                        : item.status === 'OFFLINE'
                        ? 'bg-danger'
                        : 'bg-warning'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
