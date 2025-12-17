const Vote = require('../models/vote');
const Candidate = require('../models/candidate');

exports.castVote = async (req, res) => {
  const { candidate: candidateId } = req.body;
  const userId = req.user._id;

  try {
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
