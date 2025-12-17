const express = require('express');
const router = express.Router();
const { getAllCandidates, addCandidate, removeCandidate } = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllCandidates);
router.post('/', authMiddleware, roleMiddleware('admin'), addCandidate);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), removeCandidate);

module.exports = router;
