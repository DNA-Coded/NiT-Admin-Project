import syncLogger from './sync.logger.js';

/**
 * Sync Queue Service
 * 
 * A lightweight, in-memory queue responsible for holding raw provider payloads 
 * before they are normalized and processed by the Event Processor.
 * 
 * Future Extension: 
 * If the system scales, replace this in-memory Map with Redis (BullMQ) or RabbitMQ
 * by implementing the exact same interface.
 */
class SyncQueueService {
  constructor() {
    // Map used to maintain insertion order and O(1) lookups for deduplication
    this.queue = new Map();
  }

  /**
   * Generates a unique deduplication key for a payload
   * @param {Object} payload 
   * @returns {string}
   */
  _generateDedupKey(payload) {
    // Assuming payloads have a reliable identifier. Adjust based on real provider data.
    const userId = payload.userId || payload.empId || 'unknown_user';
    const timestamp = payload.timestamp || payload.time || Date.now();
    return `${userId}_${timestamp}`;
  }

  /**
   * Add a raw payload to the queue
   * @param {Object} payload 
   * @param {string} syncId - Context for which sync job this belongs to
   * @returns {boolean} True if added, false if duplicate
   */
  queuePayload(payload, syncId) {
    const dedupKey = this._generateDedupKey(payload);

    if (this.queue.has(dedupKey)) {
      syncLogger.debug('Queue duplicate prevented', { syncId, dedupKey });
      return false;
    }

    this.queue.set(dedupKey, { payload, syncId, queuedAt: Date.now() });
    syncLogger.debug('Queue item added', { syncId, dedupKey, queueSize: this.queue.size });
    return true;
  }

  /**
   * Get the next item from the queue and remove it
   * @returns {Object|null}
   */
  popPayload() {
    if (this.queue.size === 0) return null;

    // Get the first item (Map maintains insertion order)
    const firstKey = this.queue.keys().next().value;
    const item = this.queue.get(firstKey);
    
    this.queue.delete(firstKey);
    syncLogger.debug('Queue item removed', { syncId: item.syncId, dedupKey: firstKey, queueSize: this.queue.size });
    
    return item;
  }

  /**
   * Get the current queue size
   * @returns {number}
   */
  getQueueSize() {
    return this.queue.size;
  }

  /**
   * Clear all items for a specific sync job (useful for cleanup on failure)
   * @param {string} syncId 
   * @returns {number} Number of items cleared
   */
  clearCompleted(syncId) {
    let cleared = 0;
    for (const [key, item] of this.queue.entries()) {
      if (item.syncId === syncId) {
        this.queue.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      syncLogger.debug('Queue cleared for sync job', { syncId, cleared });
    }
    
    return cleared;
  }
}

export default new SyncQueueService();
