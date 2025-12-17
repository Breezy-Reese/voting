import { useState, useEffect } from 'react';
import API from '../api';
import CandidateCard from '../components/CandidateCard';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get('/candidates');
        if (res.data && res.data.length > 0) {
          setCandidates(res.data);
        } else {
          // Show sample candidates if API returns empty
          setCandidates([
            { _id: '507f1f77bcf86cd799439011', name: 'Alice Johnson', party: 'Democratic Party', profilePic: 'https://via.placeholder.com/100', votes: 12 },
            { _id: '507f1f77bcf86cd799439012', name: 'Bob Smith', party: 'Republican Party', profilePic: 'https://via.placeholder.com/100', votes: 8 },
            { _id: '507f1f77bcf86cd799439013', name: 'Carol Williams', party: 'Independent', profilePic: 'https://via.placeholder.com/100', votes: 5 },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        // Show sample candidates on error
        setCandidates([
          { _id: '507f1f77bcf86cd799439011', name: 'Alice Johnson', party: 'Democratic Party', profilePic: 'https://via.placeholder.com/100', votes: 12 },
          { _id: '507f1f77bcf86cd799439012', name: 'Bob Smith', party: 'Republican Party', profilePic: 'https://via.placeholder.com/100', votes: 8 },
          { _id: '507f1f77bcf86cd799439013', name: 'Carol Williams', party: 'Independent', profilePic: 'https://via.placeholder.com/100', votes: 5 },
        ]);
      }
    };
    fetchCandidates();
  }, []);

  const handleVote = async () => {
    try {
      for (const candidateId of selectedCandidates) {
        await API.post('/votes', { candidate: candidateId });
      }
      alert('Votes submitted successfully!');
      setSelectedCandidates([]);
      // Refresh candidates to update vote counts
      const res = await API.get('/candidates');
      setCandidates(res.data);
    } catch (err) {
      alert('Failed to submit votes!');
    }
  };

  const toggleCandidateSelection = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <div>
        {candidates.map((c) => (
          <CandidateCard
            key={c._id}
            candidate={c}
            isSelected={selectedCandidates.includes(c._id)}
            onToggle={toggleCandidateSelection}
          />
        ))}
      </div>
      <button onClick={handleVote} disabled={selectedCandidates.length === 0}>
        Submit Votes
      </button>
    </div>
  );
}
