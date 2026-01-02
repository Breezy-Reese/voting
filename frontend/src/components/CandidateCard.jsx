export default function CandidateCard({ candidate, isSelected, onToggle, onVote }) {
  return (
    <article className="candidate-card" aria-label={`Candidate ${candidate.name}`}>
      <img src={candidate.profilePic || '/public/default-avatar.png'} alt={`${candidate.name} profile`} />
      <div className="candidate-info">
        <h4 className="candidate-name">{candidate.name}</h4>
        <div className="candidate-stats">
          <span className="party-badge">{candidate.party}</span>
          <span>•</span>
          <span>{candidate.votes ?? 0} votes</span>
        </div>
        {candidate.bio && <div className="candidate-bio">{candidate.bio}</div>}
      </div>

      <div className="candidate-actions">
        <div className="vote-badge">{candidate.votes ?? 0}</div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="vote-btn" onClick={(e)=>{ e.stopPropagation(); onVote && onVote(candidate._id); }}>Vote</button>
          <button className="vote-btn secondary" onClick={(e)=>{ e.stopPropagation(); onToggle(candidate._id); }}>{isSelected ? 'Selected' : 'Select'}</button>
        </div>
      </div>
    </article>
  );
}
