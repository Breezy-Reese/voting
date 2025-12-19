const express = require('express');
const router = express.Router();
const { castVote, getAllVotes, getVoteCount, getVoterStats } = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, castVote);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllVotes);
router.get('/count', authMiddleware, roleMiddleware('admin'), getVoteCount);
router.get('/voter-stats', authMiddleware, roleMiddleware('admin'), getVoterStats);

module.exports = router;
