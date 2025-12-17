import { useEffect, useState, useContext } from 'react';
import API from '../api';
import VoteForm from '../components/VoteForm';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get('/candidates')
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleVote = (id) => {
    API.post('/votes', { candidate: id })
      .then(res => {
        alert('Vote cast successfully!');
        // Optionally refetch candidates to update vote counts
        API.get('/candidates')
          .then(res => setCandidates(res.data))
          .catch(err => console.error(err));
      })
      .catch(err => alert(err.response?.data?.message || 'Error casting vote'));
  };

  if (!user) {
    return <div>Please log in to vote.</div>;
  }

  return (
    <div>
      <h2>Vote for your Candidate</h2>
      <div>
        {candidates.map((c) => (
          <VoteForm key={c._id} candidate={c} onVote={handleVote} />
        ))}
      </div>
    </div>
  );
}
