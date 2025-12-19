import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
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
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2>Please Log In to Vote</h2>
          <p>You need to be logged in to participate in the voting process.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link to="/login" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Login</Link>
            <Link to="/register" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Register</Link>
          </div>
        </div>
      </div>
    );
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
