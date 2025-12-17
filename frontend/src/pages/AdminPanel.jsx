import { useState } from 'react';
import VoteForm from '../components/VoteForm';

export default function AdminPanel() {
  const [candidates, setCandidates] = useState([
    { _id: 1, name: 'Alice', party: 'Party A', votes: 12 },
    { _id: 2, name: 'Bob', party: 'Party B', votes: 8 },
  ]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');

  const addCandidate = () => {
    if (!name || !party) return;
    const newCandidate = {
      _id: Date.now(),
      name,
      party,
      votes: 0,
    };
    setCandidates([...candidates, newCandidate]);
    setName('');
    setParty('');
  };

  const removeCandidate = (id) => {
    setCandidates(candidates.filter((c) => c._id !== id));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Party"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        />
        <button onClick={addCandidate}>Add Candidate</button>
      </div>

      <div>
        {candidates.map((c) => (
          <div key={c._id} style={{ display: 'flex', alignItems: 'center' }}>
            <VoteForm candidate={c} onVote={() => {}} />
            <button
              onClick={() => removeCandidate(c._id)}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
