import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes below require authentication
router.use(auth);

// GET all jobs (scoped to user)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistics (scoped to user)
router.get('/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ user: req.userId });

    const statusCounts = await Job.aggregate([
      { $match: { user: req.userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = { total: totalJobs, pending: 0, interview: 0, declined: 0, offer: 0 };
    statusCounts.forEach(item => {
      if (item._id) stats[item._id.toLowerCase()] = item.count;
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single job (scoped to user)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new job (attach user)
router.post('/', async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, user: req.userId });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) a job (scoped to user)
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a job (scoped to user)
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
