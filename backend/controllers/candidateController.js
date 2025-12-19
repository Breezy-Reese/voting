const Candidate = require('../models/candidate');

exports.getAllCandidates = async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
};

exports.addCandidate = async (req, res) => {
  const { name, party, profilePic } = req.body;
  try {
    const candidate = await Candidate.create({ name, party, profilePic });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: 'Error adding candidate', error: err.message });
  }
};

exports.removeCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate removed' });
  } catch (err) {
    res.status(400).json({ message: 'Error removing candidate', error: err.message });
  }
};

exports.getCandidateVoteStats = async (req, res) => {
  try {
    const Vote = require('../models/vote');
    const stats = await Vote.aggregate([
      {
        $group: {
          _id: '$candidate',
          voteCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      {
        $unwind: '$candidateInfo'
      },
      {
        $project: {
          _id: 0,
          candidateId: '$_id',
          name: '$candidateInfo.name',
          party: '$candidateInfo.party',
          voteCount: 1
        }
      },
      {
        $sort: { voteCount: -1 }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching vote stats', error: err.message });
  }
};
