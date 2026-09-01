import mongoose from 'mongoose';

// 1. Define the Schema first
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  hodName: { type: String },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
  // ... rest of your schema fields
}, { timestamps: true });

// 2. Attach the Instance Methods next
departmentSchema.methods.toPublicJSON = function () {
  return {
    id:          this._id,
    name:        this.name,
    code:        this.code,
    description: this.description,
    hodName:     this.hodName ?? null, 
    isActive:    this.isActive,
    deletedAt:   this.deletedAt,
    deletedBy:   this.deletedBy,
    createdBy:   this.createdBy,
    updatedBy:   this.updatedBy,
    createdAt:   this.createdAt,
    updatedAt:   this.updatedAt,
  };
};

// 3. Compile the Model last
const Department = mongoose.model('Department', departmentSchema);

export { Department };
export default Department;