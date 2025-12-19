const Vote = require('../models/vote');
const Candidate = require('../models/candidate');

exports.castVote = async (req, res) => {
  const { candidate: candidateId } = req.body;
  const userId = req.user._id;

  try {
    // Prevent admin from voting
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to vote' });
    }

    const existingVote = await Vote.findOne({ user: userId });
    if (existingVote) return res.status(400).json({ message: 'You have already voted' });

    const vote = await Vote.create({ user: userId, candidate: candidateId });
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.json({ message: 'Vote cast successfully', vote });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already voted' });
    }
    res.status(500).json({ message: 'Voting failed', error: err.message });
  }
};

exports.getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find().populate('user', 'username fullName').populate('candidate', 'name party');
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching votes', error: err.message });
  }
};

exports.getVoteCount = async (req, res) => {
  try {
    const count = await Vote.countDocuments();
    res.json({ totalVotes: count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vote count', error: err.message });
  }
};

exports.getVoterStats = async (req, res) => {
  try {
    const totalUsers = await require('../models/User').countDocuments();
    const totalVotes = await Vote.countDocuments();
    const voted = totalVotes;
    const notVoted = totalUsers - totalVotes;
    res.json({ voted, notVoted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching voter stats', error: err.message });
  }
};
