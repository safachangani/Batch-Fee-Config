const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  noOfStudents: { type: Number, required: true },
  noOfClassesPerMonth: { type: Number, required: true },
  course: { type: String, required: true },
  medium: { type: String, required: true },
}, { timestamps: true })

const batch = mongoose.model('batch', batchSchema);

const feeStructureSchema = new mongoose.Schema({
  feeStructureName: { type: String, required: true },
  minNoOfStudents: { type: Number, required: true },
  maxNoOfStudents: { type: Number, required: true },
  region: { type: String, required: true },
  medium: { type: String, required: true },
  course: { type: String, required: true },
  monthlyFee: { type: Number, required: true },
  TotalClassesPerMonth: { type: Number, required: true },
  remarks: { type: String, required: true }
}, { timestamps: true })

const feeStructure = mongoose.model('feeStructure', feeStructureSchema);

module.exports = { batch, feeStructure }
