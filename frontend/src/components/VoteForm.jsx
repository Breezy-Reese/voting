export default function VoteForm({ candidate, onVote }) {
  const handleVote = () => {
    if (window.confirm(`Are you sure you want to vote for ${candidate.name}?`)) {
      onVote(candidate._id);
    }
  };

  return (
    <div className="vote-form">
      <h3>{candidate.name}</h3>
      <p style={{ color: '#6b7280', marginTop: 6 }}>Party: <strong style={{ color: '#0b2540' }}>{candidate.party}</strong></p>
      <p style={{ marginTop: 8 }}>{candidate.votes ?? 0} votes</p>
      <div style={{ marginTop: 12 }}>
        <button className="vote-btn" onClick={handleVote}>Vote</button>
      </div>
    </div>
  );
}
