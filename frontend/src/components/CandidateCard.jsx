export default function CandidateCard({ candidate, isSelected, onToggle }) {
  return (
    <div className="candidate-card" style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <img src={candidate.profilePic} alt={`${candidate.name} profile`} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <h3>{candidate.name}</h3>
      <p>Party: {candidate.party}</p>
      <p>Votes: {candidate.votes}</p>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(candidate._id)}
      />
      <label> Select to vote</label>
    </div>
  );
}
