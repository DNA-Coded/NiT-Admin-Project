import SecureEyeProvider from './secureeye.provider.js';

/**
 * Provider Factory
 * 
 * Instantiates the correct device provider based on the device's manufacturer.
 * Ensures the Attendance Engine remains decoupled from specific vendors.
 */
class ProviderFactory {
  /**
   * Get the appropriate provider instance for a device
   * @param {Object} device The device document
   * @returns {import('./base.provider.js').default}
   */
  static getProvider(device) {
    if (!device || !device.manufacturer) {
      throw new Error('Device manufacturer is required to determine provider.');
    }

    const manufacturer = device.manufacturer.trim().toLowerCase();

    switch (manufacturer) {
      case 'secureeye':
        return new SecureEyeProvider(device);
      
      // NOTE: Add cases for future providers like:
      // case 'zkteco': return new ZKTecoProvider(device);
      // case 'hikvision': return new HikvisionProvider(device);
      // case 'essl': return new eSSLProvider(device);

      default:
        throw new Error(`No provider implementation found for manufacturer: ${device.manufacturer}`);
    }
  }
}

export default ProviderFactory;
