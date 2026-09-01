import React, { useState } from 'react';
import type { CreateDeviceDTO } from '../types/device.api.types';

interface AddDeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateDeviceDTO) => Promise<boolean>;
  departments: { id: string; name: string }[];
}

const VERIFICATION_METHODS = [
  { id: 'FACE_RECOGNITION', label: 'Face Recognition' },
  { id: 'FINGERPRINT', label: 'Fingerprint' },
  { id: 'RFID', label: 'RFID' },
  { id: 'PIN', label: 'PIN' },
  { id: 'QR_CODE', label: 'QR Code' },
  { id: 'MANUAL', label: 'Manual' },
];

const DEVICE_CATEGORIES = [
  { id: 'BIOMETRIC_TERMINAL', label: 'Biometric Terminal' },
  { id: 'RFID_READER', label: 'RFID Reader' },
  { id: 'QR_SCANNER', label: 'QR Scanner' },
  { id: 'MOBILE_DEVICE', label: 'Mobile Device' },
  { id: 'OTHER', label: 'Other' },
];

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  // departments,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extract all checked verification methods
    const selectedMethods = formData.getAll('supportedVerificationMethods') as string[];

    if (selectedMethods.length === 0) {
      setError('Please select at least one verification method.');
      return;
    }

    const data: CreateDeviceDTO = {
      deviceName: formData.get('deviceName') as string,
      deviceCode: formData.get('deviceCode') as string,
      deviceCategory: formData.get('deviceCategory') as string,
      supportedVerificationMethods: selectedMethods,
      manufacturer: formData.get('manufacturer') as string,
      model: formData.get('model') as string,
      serialNumber: formData.get('serialNumber') as string,
      ipAddress: formData.get('ipAddress') as string,
      macAddress: (formData.get('macAddress') as string) || undefined,
      port: Number(formData.get('port')),
      building: formData.get('building') as string,
      floor: formData.get('floor') as string,
      room: formData.get('room') as string,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      const success = await onAdd(data);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Dialog Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-background font-semibold">
                Register New Device
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Provide hardware specifications and network configuration for the new device.
              </p>
            </div>
            <button
              aria-label="Close dialog"
              className="p-1 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content */}
          <form className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Section 1: Basic Details */}
            <div className="flex flex-col gap-4">
              <h4 className="font-label-md text-primary font-bold border-b border-outline-variant pb-1.5">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="deviceName">
                    Device Name *
                  </label>
                  <input
                    id="deviceName"
                    name="deviceName"
                    required
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. Main Entrance Biometric"
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
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all uppercase"
                    placeholder="e.g. DEV-A-01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="deviceCategory">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="deviceCategory"
                      name="deviceCategory"
                      required
                      disabled={isSubmitting}
                      className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {DEVICE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Verification Methods (Checkboxes) */}
            <div className="flex flex-col gap-2">
              <label className="block font-label-md text-primary font-bold border-b border-outline-variant pb-1.5">
                Verification Methods * <span className="font-normal text-xs text-on-surface-variant">(Select all that apply)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {VERIFICATION_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-2.5 p-2.5 bg-white border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 select-none"
                  >
                    <input
                      type="checkbox"
                      name="supportedVerificationMethods"
                      value={method.id}
                      disabled={isSubmitting}
                      className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20 accent-primary"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Hardware & Network */}
            <div className="flex flex-col gap-4">
              <h4 className="font-label-md text-primary font-bold border-b border-outline-variant pb-1.5">
                Hardware & Network Specs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="manufacturer">
                    Manufacturer *
                  </label>
                  <input
                    id="manufacturer"
                    name="manufacturer"
                    required
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. eSSL"
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
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. K90"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="serialNumber">
                    Serial Number *
                  </label>
                  <input
                    id="serialNumber"
                    name="serialNumber"
                    required
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. SN12345678"
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
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. 192.168.1.100"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="macAddress">
                    MAC Address
                  </label>
                  <input
                    id="macAddress"
                    name="macAddress"
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. 00:1B:44:11:3A:B7"
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
                    defaultValue="4370"
                    disabled={isSubmitting}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. 4370"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Location & Department */}
            <div className="flex flex-col gap-4">
              <h4 className="font-label-md text-primary font-bold border-b border-outline-variant pb-1.5">
                Location & Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="building">
                    Building *
                  </label>
                  <input
                    id="building"
                    name="building"
                    required
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. Block A"
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
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. Ground Floor"
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
                    disabled={isSubmitting}
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg font-body-sm text-body-sm text-on-surface outline-none transition-all"
                    placeholder="e.g. Main Lobby"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-2 sticky bottom-0 bg-surface-container-lowest">
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
                disabled={isSubmitting}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-label-md text-label-md rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Device'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};