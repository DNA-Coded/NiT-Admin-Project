import mongoose from 'mongoose';
import SyncJob from './sync.model.js';
import { SYNC_STATUS } from './sync.constants.js';

const makeError = (message, status) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

/**
 * Sync History Service
 * 
 * Manages the lifecycle of synchronization jobs.
 * strictly handles orchestration metadata.
 */
class SyncHistoryService {
  /**
   * Create a new pending sync job
   */
  async createSyncJob({ deviceId, provider, source, createdBy = 'system' }) {
    // Prevent multiple running syncs for the same device
    const activeSync = await SyncJob.findOne({
      device: deviceId,
      status: { $in: [SYNC_STATUS.PENDING, SYNC_STATUS.RUNNING] },
      isActive: true,
    });

    if (activeSync) {
      throw makeError('A sync job is already running for this device.', 409);
    }

    const job = new SyncJob({
      device: deviceId,
      provider,
      source,
      status: SYNC_STATUS.PENDING,
      createdBy,
    });

    await job.save();
    return job.toPublicJSON();
  }

  /**
   * Mark a sync job as running
   */
  async startSync(syncId) {
    const job = await SyncJob.findOne({ syncId, isActive: true });
    if (!job) throw makeError('Sync job not found.', 404);

    if (job.status !== SYNC_STATUS.PENDING && job.status !== SYNC_STATUS.FAILED) {
      throw makeError(`Cannot start sync from status: ${job.status}`, 400);
    }

    job.status = SYNC_STATUS.RUNNING;
    job.startedAt = new Date();
    await job.save();

    return job.toPublicJSON();
  }

  /**
   * Complete a sync job successfully
   */
  async completeSync(syncId, { recordsFetched = 0, recordsProcessed = 0, recordsFailed = 0, lastSyncedTimestamp = null }) {
    const job = await SyncJob.findOne({ syncId, isActive: true });
    if (!job) throw makeError('Sync job not found.', 404);

    job.status = recordsFailed > 0 ? SYNC_STATUS.PARTIAL : SYNC_STATUS.SUCCESS;
    job.completedAt = new Date();
    job.recordsFetched = recordsFetched;
    job.recordsProcessed = recordsProcessed;
    job.recordsFailed = recordsFailed;
    
    if (lastSyncedTimestamp) {
      job.lastSyncedTimestamp = lastSyncedTimestamp;
    }

    if (job.startedAt && job.completedAt) {
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();
    }

    await job.save();
    return job.toPublicJSON();
  }

  /**
   * Fail a sync job
   */
  async failSync(syncId, errorObj) {
    const job = await SyncJob.findOne({ syncId, isActive: true });
    if (!job) return null; // Silently return if job is lost during fail cascade

    job.status = SYNC_STATUS.FAILED;
    job.completedAt = new Date();
    job.error = errorObj;

    if (job.startedAt && job.completedAt) {
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();
    }

    await job.save();
    return job.toPublicJSON();
  }

  /**
   * Retry a failed sync job
   */
  async retrySync(syncId, updatedBy = 'system') {
    const job = await SyncJob.findOne({ syncId, isActive: true });
    if (!job) throw makeError('Sync job not found.', 404);

    if (job.status !== SYNC_STATUS.FAILED && job.status !== SYNC_STATUS.PARTIAL) {
      throw makeError('Only failed or partial syncs can be retried.', 400);
    }

    job.status = SYNC_STATUS.PENDING;
    job.retryCount += 1;
    job.error = null;
    job.startedAt = null;
    job.completedAt = null;
    job.duration = null;
    job.updatedBy = updatedBy;

    await job.save();
    return job.toPublicJSON();
  }

  /**
   * List sync history with filters
   */
  async getSyncHistory(query = {}) {
    const {
      page = 1, limit = 10,
      deviceId, status, source, provider,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = query;

    const filter = { isActive: true };

    if (deviceId && mongoose.Types.ObjectId.isValid(deviceId)) filter.device = deviceId;
    if (status) filter.status = status.toUpperCase();
    if (source) filter.source = source.toUpperCase();
    if (provider) filter.provider = provider;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, docs] = await Promise.all([
      SyncJob.countDocuments(filter),
      SyncJob.find(filter)
        .populate('device', 'deviceCode deviceName')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      history: docs.map(doc => doc.toPublicJSON()),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  /**
   * Get sync job details
   */
  async getSyncJob(syncId) {
    const job = await SyncJob.findOne({ syncId, isActive: true }).populate('device', 'deviceCode deviceName');
    if (!job) throw makeError('Sync job not found.', 404);
    return job.toPublicJSON();
  }

  /**
   * Get the most recent successful sync for a device
   */
  async getLatestSync(deviceId) {
    const job = await SyncJob.findOne({
      device: deviceId,
      status: { $in: [SYNC_STATUS.SUCCESS, SYNC_STATUS.PARTIAL] },
      isActive: true,
    }).sort({ completedAt: -1 });

    return job ? job.toPublicJSON() : null;
  }
}

export default new SyncHistoryService();
