# TODO: Comprehensive Admin Dashboard

## Backend Changes
- [ ] Create backend/routes/healthRoutes.js to expose health endpoint
- [ ] Edit backend/controllers/voteController.js to prevent admin voting
- [ ] Add getUserRoleCounts to backend/controllers/authControllers.js
- [ ] Add getVoterStats to backend/controllers/voteController.js
- [ ] Add getCandidateVoteStats to backend/controllers/candidateController.js
- [ ] Update backend/routes/authRoutes.js to include getUserRoleCounts
- [ ] Update backend/routes/voteRoutes.js to include getVoterStats
- [ ] Update backend/routes/candidateRoutes.js to include getCandidateVoteStats

## Frontend Changes
- [ ] Add recharts dependency to frontend/package.json
- [ ] Enhance frontend/src/pages/AdminPanel.jsx to display system health and pie charts

## Followup
- [ ] Install frontend dependencies (recharts)
- [ ] Test the admin dashboard functionality
