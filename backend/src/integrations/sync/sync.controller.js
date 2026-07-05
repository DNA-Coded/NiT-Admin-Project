import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../../helpers/index.js';
import { MESSAGES } from '../../constants/index.js';
import { extractRequestMeta } from '../../modules/auth/auth.logger.js';
import SyncHistoryService from './sync.history.service.js';
import syncService from './sync.service.js';
import { SYNC_SOURCE } from './sync.constants.js';

export const listSyncHistory = asyncHandler(async (req, res) => {
  const { page, limit, deviceId, status, source, provider, sortBy, sortOrder } = req.query;

  try {
    const result = await SyncHistoryService.getSyncHistory({
      page, limit, deviceId, status, source, provider, sortBy, sortOrder
    });
    return sendSuccess(res, result, MESSAGES.SYNC_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getSyncJob = asyncHandler(async (req, res) => {
  try {
    const job = await SyncHistoryService.getSyncJob(req.params.id);
    return sendSuccess(res, job, MESSAGES.SYNC_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getLatestSync = asyncHandler(async (req, res) => {
  const { deviceId } = req.query;
  
  try {
    if (!deviceId) {
      throw { statusCode: 400, message: 'deviceId query parameter is required' };
    }
    const job = await SyncHistoryService.getLatestSync(deviceId);
    if (!job) {
      return sendSuccess(res, null, 'No successful sync found for this device.', 200);
    }
    return sendSuccess(res, job, MESSAGES.SYNC_FETCH_DETAIL, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const startSync = asyncHandler(async (req, res) => {
  const { deviceId, provider, source = SYNC_SOURCE.MANUAL } = req.body;
  const adminEmail = req.admin?.email ?? 'system';

  try {
    // 1. Create Job Metadata
    const job = await SyncHistoryService.createSyncJob({
      deviceId,
      provider,
      source,
      createdBy: adminEmail,
    });

    // Note: Actual device connection, pulling, queueing, mapping, and core attendance 
    // insertion logic is decoupled and will occur asynchronously/separately. 
    // Here we just mark it as running in the orchestrator layer as a scaffold.
    const startedJob = await SyncHistoryService.startSync(job.syncId);

    // Mock completion since Phase 6.2 explicitly excludes actual integration
    setTimeout(() => {
      SyncHistoryService.completeSync(startedJob.syncId, {
        recordsFetched: 0,
        recordsProcessed: 0,
        recordsFailed: 0,
        lastSyncedTimestamp: new Date(),
      }).catch(console.error);
    }, 1000);

    return sendSuccess(res, startedJob, MESSAGES.SYNC_STARTED, 201);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const retrySync = asyncHandler(async (req, res) => {
  const adminEmail = req.admin?.email ?? 'system';

  try {
    const job = await SyncHistoryService.retrySync(req.params.id, adminEmail);
    
    // Scaffold: Mark it as running
    await SyncHistoryService.startSync(job.syncId);

    return sendSuccess(res, job, MESSAGES.SYNC_RETRY_STARTED, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});

export const getDeviceSyncHistory = asyncHandler(async (req, res) => {
  const { page, limit, status, source, sortBy, sortOrder } = req.query;
  const deviceId = req.params.deviceId;

  try {
    const result = await SyncHistoryService.getSyncHistory({
      page, limit, deviceId, status, source, sortBy, sortOrder
    });
    return sendSuccess(res, result, MESSAGES.SYNC_FETCH_LIST, 200);
  } catch (err) {
    if (!err.statusCode) throw err;
    return sendError(res, err.message, err.statusCode);
  }
});
