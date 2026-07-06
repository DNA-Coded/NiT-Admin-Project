import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  EXPORT_REPORT_TYPES_VALUES,
  EXPORT_FORMATS_VALUES,
  EXPORT_STATUS,
  EXPORT_STATUS_VALUES
} from '../exports.constants.js';

const exportHistorySchema = new mongoose.Schema({
  exportId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  reportType: {
    type: String,
    required: true,
    enum: EXPORT_REPORT_TYPES_VALUES,
  },
  format: {
    type: String,
    required: true,
    enum: EXPORT_FORMATS_VALUES,
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  generatedBy: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: EXPORT_STATUS_VALUES,
    default: EXPORT_STATUS.PENDING,
  },
  fileSize: {
    type: Number, // In bytes
  },
  duration: {
    type: Number, // In milliseconds
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexing for faster history lookup by admin or status
exportHistorySchema.index({ generatedBy: 1, generatedAt: -1 });
exportHistorySchema.index({ status: 1 });

const ExportHistory = mongoose.model('ExportHistory', exportHistorySchema);

export default ExportHistory;
