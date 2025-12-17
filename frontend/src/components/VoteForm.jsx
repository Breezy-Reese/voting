export default function VoteForm({ candidate, onVote }) {
  const handleVote = () => {
    if (window.confirm(`Are you sure you want to vote for ${candidate.name}?`)) {
      onVote(candidate._id);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h3>{candidate.name}</h3>
      <p>Party: {candidate.party}</p>
      <p>Votes: {candidate.votes}</p>
      <button onClick={handleVote} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
        Vote
      </button>
    </div>
  );
}
