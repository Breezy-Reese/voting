import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import CandidateCard from '../components/CandidateCard';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loadingData, setLoadingData] = useState(true);
  const [modalCandidate, setModalCandidate] = useState(null);
  const [voteHistory, setVoteHistory] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (user?.role === 'admin') return navigate('/admin', { replace: true });

    const fetchAll = async () => {
      setLoadingData(true);
      try {
        const [cRes, vRes] = await Promise.allSettled([
          API.get('/candidates'),
          API.get('/votes')
        ]);

        if (cRes.status === 'fulfilled' && Array.isArray(cRes.value.data)) {
          setCandidates(cRes.value.data);
        } else {
          setCandidates([]);
        }

        if (vRes.status === 'fulfilled' && Array.isArray(vRes.value.data)) {
          const allVotes = vRes.value.data;
          const myVotes = allVotes.filter(v => v.voter === user?._id || v.userId === user?._id || v.voterId === user?._id);
          setVoteHistory(myVotes);
        } else {
          setVoteHistory([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAll();
  }, [loading, user, navigate]);

  const filtered = candidates
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.party || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === 'popular') return (b.votes||0) - (a.votes||0);
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      return 0;
    });

  const toggleCandidateSelection = (id) => {
    setSelectedCandidates(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const handleVote = async () => {
    if (!user) return navigate('/login');
    if (!window.confirm(`Submit vote${selectedCandidates.length>1 ? 's' : ''} for ${selectedCandidates.length} candidate(s)?`)) return;
    try {
      for (const id of selectedCandidates) {
        await API.post('/votes', { candidate: id });
      }
      alert('Thanks — your vote was recorded');
      setSelectedCandidates([]);
      const res = await API.get('/candidates');
      if (res.data) setCandidates(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to submit vote. Try again.');
    }
  };

  const handleVoteSingle = async (id) => {
    if (!user) return navigate('/login');
    if (!window.confirm('Confirm vote for this candidate?')) return;
    try {
      await API.post('/votes', { candidate: id });
      alert('Your vote has been recorded — thank you');
      const res = await API.get('/candidates');
      if (res.data) setCandidates(res.data);
      // also refresh vote history
      const vres = await API.get('/votes');
      if (Array.isArray(vres.data)) {
        const myVotes = vres.data.filter(v => v.voter === user?._id || v.userId === user?._id || v.voterId === user?._id);
        setVoteHistory(myVotes);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit vote. Try again later.');
    }
  };

  if (loading || loadingData) return <div style={{padding:20}}>Loading...</div>;

  return (
    <main className="container-main">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div>
          <h2 style={{ margin:0 }}>Cast Your Vote</h2>
          <div style={{ color:'#6b7280', fontSize:13 }}>Choose a candidate and submit your vote securely.</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input placeholder="Search candidates or party" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:'0.5rem 0.75rem', borderRadius:8, border:'1px solid rgba(12,24,64,0.08)' }} />
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'0.45rem', borderRadius:8 }}>
            <option value="popular">Most votes</option>
            <option value="az">A → Z</option>
          </select>
        </div>
      </div>

      <div className="grid-two">
        <section>
          <div className="candidate-grid">
            {filtered.length === 0 && <div style={{ padding:20, color:'#6b7280' }}>No candidates found.</div>}
            {filtered.map(c => (
              <div key={c._id} onClick={()=>setModalCandidate(c)} style={{ cursor:'pointer' }}>
                <CandidateCard candidate={c} isSelected={selectedCandidates.includes(c._id)} onToggle={toggleCandidateSelection} onVote={handleVoteSingle} />
              </div>
            ))}
          </div>

          <div className="action-bar">
            <button className="btn secondary" onClick={()=>{ setSelectedCandidates([]); }}>Clear</button>
            <button className="btn primary" onClick={handleVote} disabled={selectedCandidates.length===0}>Submit {selectedCandidates.length>0 ? `(${selectedCandidates.length})` : ''}</button>
          </div>
        </section>

        <aside>
          <div className="vote-form">
            <h3 style={{ margin:0 }}>Voter Summary</h3>
            <p style={{ color:'#6b7280', marginTop:8 }}>{user?.username} — <strong style={{ color:'#0b2540' }}>{user?.role}</strong></p>
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:'#6b7280' }}>Votes cast</div>
              <div style={{ fontSize:20, fontWeight:700 }}>{voteHistory.length}</div>
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, color:'#6b7280' }}>Selected</div>
              <div style={{ fontSize:16, fontWeight:700 }}>{selectedCandidates.length} candidate(s)</div>
            </div>
          </div>

          <div style={{ marginTop:12, background:'white', padding:12, borderRadius:12, boxShadow:'0 6px 18px rgba(12,24,64,0.06)' }}>
            <h4 style={{ marginTop:0 }}>Recent Votes</h4>
            {voteHistory.length === 0 ? (
              <div style={{ color:'#6b7280' }}>No votes yet</div>
            ) : (
              <ul style={{ paddingLeft:16, margin:0 }}>
                {voteHistory.slice(-5).reverse().map(v => (
                  <li key={v._id || Math.random()} style={{ marginBottom:8 }}>{v.candidateName || v.candidate || '—' } <span style={{ color:'#6b7280', fontSize:12 }}>• {new Date(v.createdAt || v.date || Date.now()).toLocaleString()}</span></li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {modalCandidate && (
        <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60 }} onClick={()=>setModalCandidate(null)}>
          <div style={{ width:520, maxWidth:'95%', background:'white', borderRadius:12, padding:20 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <img src={modalCandidate.profilePic} alt="" style={{ width:84, height:84, borderRadius:12, objectFit:'cover' }} />
              <div>
                <h3 style={{ margin:0 }}>{modalCandidate.name}</h3>
                <div style={{ color:'#6b7280' }}>{modalCandidate.party}</div>
              </div>
            </div>
            <p style={{ marginTop:12, color:'#374151' }}>{modalCandidate.bio || 'No biography available.'}</p>
            <div style={{ display:'flex', gap:8, marginTop:12, justifyContent:'flex-end' }}>
              <button className="btn secondary" onClick={()=>setModalCandidate(null)}>Close</button>
              <button className="btn primary" onClick={async ()=>{ setSelectedCandidates([modalCandidate._id]); await handleVote(); setModalCandidate(null); }}>Vote for {modalCandidate.name}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
