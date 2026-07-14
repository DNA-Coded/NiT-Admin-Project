import React, { useState } from 'react';
import type { UpdateDeviceDTO } from '../types/device.api.types';
import type { Device } from '@/types/devices';

interface EditDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: UpdateDeviceDTO) => Promise<boolean>;
  device: Device | null;
  departments: { id: string; name: string }[];
}

export const EditDeviceDialog: React.FC<EditDeviceDialogProps> = ({ isOpen, onClose, onEdit, device, departments }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We need to keep track of the selected assignedDepartment by ID if available. 
  // However, `device.assignedDepartment` from our mapper is the string name.
  // We'll map the name back to an ID for the default value.
  const getDepartmentId = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    return dept ? dept.id : '';
  };

  if (!isOpen || !device) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: UpdateDeviceDTO = {
      deviceCode: formData.get('deviceCode') as string,
      deviceName: formData.get('deviceName') as string,
      deviceCategory: formData.get('deviceCategory') as string,
      supportedVerificationMethods: (formData.get('supportedVerificationMethods') as string).split(',').map(s => s.trim()),
      manufacturer: formData.get('manufacturer') as string,
      model: formData.get('model') as string,
      serialNumber: formData.get('serialNumber') as string,
      ipAddress: formData.get('ipAddress') as string,
      macAddress: formData.get('macAddress') as string || undefined,
      port: Number(formData.get('port')),
      building: formData.get('building') as string,
      floor: formData.get('floor') as string,
      room: formData.get('room') as string,
      assignedDepartment: formData.get('assignedDepartment') as string || undefined,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      const success = await onEdit(device.id, data);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-background">Edit Device</h3>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4" onSubmit={handleSubmit}>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Update hardware specifications and network configuration for the device.
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-2">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="deviceName">
                  Device Name *
                </label>
                <input
                  id="deviceName"
                  name="deviceName"
                  required
                  defaultValue={device.deviceName}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. Main Entrance Biometric"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="deviceCode">
                  Device Code *
                </label>
                <input
                  id="deviceCode"
                  name="deviceCode"
                  required
                  defaultValue={device.deviceCode}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all uppercase"
                  placeholder="e.g. DEV-A-01"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="deviceCategory">
                  Category *
                </label>
                <div className="relative">
                  <select
                    id="deviceCategory"
                    name="deviceCategory"
                    required
                    defaultValue={device.deviceCategory}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    <option value="FINGERPRINT">FINGERPRINT</option>
                    <option value="FACE">FACE</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="RFID">RFID</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="supportedVerificationMethods">
                  Verification Methods *
                </label>
                <input
                  id="supportedVerificationMethods"
                  name="supportedVerificationMethods"
                  required
                  defaultValue={device.supportedVerificationMethods.join(', ')}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. FINGERPRINT, FACE"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="manufacturer">
                  Manufacturer *
                </label>
                <input
                  id="manufacturer"
                  name="manufacturer"
                  required
                  defaultValue={device.manufacturer}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. eSSL"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="model">
                  Model *
                </label>
                <input
                  id="model"
                  name="model"
                  required
                  defaultValue={device.model}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. K90"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="serialNumber">
                  Serial Number *
                </label>
                <input
                  id="serialNumber"
                  name="serialNumber"
                  required
                  defaultValue={device.serialNumber}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. SN12345678"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="ipAddress">
                  IP Address *
                </label>
                <input
                  id="ipAddress"
                  name="ipAddress"
                  required
                  defaultValue={device.ipAddress}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. 192.168.1.100"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="macAddress">
                  MAC Address
                </label>
                <input
                  id="macAddress"
                  name="macAddress"
                  defaultValue={device.macAddress}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. 00:1B:44:11:3A:B7"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="port">
                  Port *
                </label>
                <input
                  id="port"
                  name="port"
                  required
                  defaultValue={device.port}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. 4370"
                  type="number"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <h4 className="font-label-md text-primary font-bold border-b border-outline-variant pb-2 mt-2">Location & Assignment</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="building">
                  Building *
                </label>
                <input
                  id="building"
                  name="building"
                  required
                  defaultValue={device.building}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. Block A"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="floor">
                  Floor *
                </label>
                <input
                  id="floor"
                  name="floor"
                  required
                  defaultValue={device.floor}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. Ground Floor"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="room">
                  Room *
                </label>
                <input
                  id="room"
                  name="room"
                  required
                  defaultValue={device.room}
                  className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                  placeholder="e.g. Main Lobby"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="assignedDepartment">
                  Assigned Department
                </label>
                <div className="relative">
                  <select
                    id="assignedDepartment"
                    name="assignedDepartment"
                    defaultValue={getDepartmentId(device.assignedDepartment)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option value="">No specific department (Campus-wide)</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-2 bg-surface-container-lowest">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container-low font-label-md text-label-md rounded-lg text-secondary transition-colors disabled:opacity-50"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
