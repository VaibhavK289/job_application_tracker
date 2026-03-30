import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
  },
  position: {
    type: String,
    required: [true, 'Please provide a job position'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Interview', 'Declined', 'Offer'],
    default: 'Pending',
  },
  location: {
    type: String,
    default: 'Remote',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  jobUrl: {
    type: String,
    default: '',
  },
  salary: {
    type: String,
    default: '',
  },
  contact: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
