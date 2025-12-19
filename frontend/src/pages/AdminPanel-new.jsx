import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid #ddd',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};

const statCardStyle = {
  ...cardStyle,
  flex: 1,
  minWidth: '200px'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminPanel() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);
  const [userRoleCounts, setUserRoleCounts] = useState([]);
  const [voterStats, setVoterStats] = useState({ voted: 0, notVoted: 0 });
  const [candidateStats, setCandidateStats] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [candidatesRes, usersRes, votesRes, voteCountRes, userCountRes, healthRes, roleCountsRes, voterStatsRes, candidateStatsRes] = await Promise.all([
        API.get('/candidates'),
        API.get('/auth/users'),
        API.get('/votes'),
        API.get('/votes/count'),
        API.get('/auth/users/count'),
        API.get('/health'),
        API.get('/auth/users/role-counts'),
        API.get('/votes/voter-stats'),
        API.get('/candidates/vote-stats'),
      ]);
      setCandidates(candidatesRes.data);
      setUsers(usersRes.data);
      setVotes(votesRes.data);
      setTotalVotes(voteCountRes.data.totalVotes);
      setTotalUsers(userCountRes.data.totalUsers);
      setHealth(healthRes.data);
      setUserRoleCounts(roleCountsRes.data);
      setVoterStats(voterStatsRes.data);
      setCandidateStats(candidateStatsRes.data);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async () => {
    if (!name || !party) return;
    try {
      const res = await API.post('/candidates', { name, party });
      setCandidates([...candidates, res.data]);
      setName('');
      setParty('');
    } catch (err) {
      setError('Error adding candidate: ' + err.message);
    }
  };

  const removeCandidate = async (id) => {
    try {
      await API.delete(`/candidates/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
    } catch (err) {
      setError('Error removing candidate: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (user?.role !== 'admin') return <div style={{ padding: '2rem' }}>Access denied.</div>;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Admin Dashboard</h1>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#007bff' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#333' }}>{totalUsers}</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#28a745' }}>Total Votes Cast</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#333' }}>{totalVotes}</p>
        </div>
      </div>

      {/* System Health */}
      {health && (
        <div style={cardStyle}>
          <h2 style={{ marginTop: '0', color: '#333' }}>System Health</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><strong>Status:</strong> <span style={{ color: '#28a745' }}>{health.status}</span></div>
            <div><strong>Uptime:</strong> {health.uptime}s</div>
            <div><strong>Database:</strong> <span style={{ color: '#28a745' }}>{health.database.status}</span></div>
            <div><strong>Node Version:</strong> {health.system.nodeVersion}</div>
            <div><strong>Platform:</strong> {health.system.platform}</div>
            <div><strong>Memory:</strong> {Math.round(health.system.memoryUsage.rss / 1024 / 1024)}MB</div>
          </div>
        </div>
      )}

      {/* Pie Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Users by Role */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: '0' }}>Users by Role</h3>
          {userRoleCounts && userRoleCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userRoleCounts} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {userRoleCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No data</p>
          )}
        </div>

        {/* Voters vs Non-Voters */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: '0' }}>Voters vs Non-Voters</h3>
          {voterStats && (voterStats.voted + voterStats.notVoted) > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[{ name: 'Voted', value: voterStats.voted }, { name: 'Not Voted', value: voterStats.notVoted }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No voting data yet</p>
          )}
        </div>

        {/* Candidate Vote Distribution */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: '0' }}>Candidate Votes</h3>
          {candidateStats && candidateStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={candidateStats.map(c => ({ name: c.name, value: c.voteCount || 0 }))} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {candidateStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No candidates yet</p>
          )}
        </div>
      </div>

      {/* Add Candidate */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: '0' }}>Add Candidate</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="text" placeholder="Party" value={party} onChange={(e) => setParty(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          <button onClick={addCandidate} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
        </div>
      </div>

      {/* Candidates List */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: '0' }}>Candidates ({candidates.length})</h3>
        {candidates.length > 0 ? candidates.map((c) => (
          <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9f9f9', marginBottom: '0.5rem', borderRadius: '4px' }}>
            <div><strong>{c.name}</strong> ({c.party}) - Votes: {c.votes || 0}</div>
            <button onClick={() => removeCandidate(c._id)} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
          </div>
        )) : <p>No candidates</p>}
      </div>

      {/* Users List */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: '0' }}>Users ({users.length})</h3>
        {users.length > 0 ? users.map((u) => (
          <div key={u._id} style={{ padding: '0.75rem', backgroundColor: '#f9f9f9', marginBottom: '0.5rem', borderRadius: '4px', fontSize: '0.95rem' }}>
            <strong>{u.username}</strong> - {u.fullName} <span style={{ color: 'white', backgroundColor: u.role === 'admin' ? '#dc3545' : '#007bff', padding: '0.2rem 0.4rem', borderRadius: '3px', fontSize: '0.8rem' }}>{u.role}</span>
          </div>
        )) : <p>No users</p>}
      </div>

      {/* Votes List */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: '0' }}>Votes ({votes.length})</h3>
        {votes.length > 0 ? votes.map((v) => (
          <div key={v._id} style={{ padding: '0.75rem', backgroundColor: '#f9f9f9', marginBottom: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
            <strong>{v.user.username}</strong> → <strong>{v.candidate.name}</strong> ({v.candidate.party})
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(v.votedAt).toLocaleString()}</div>
          </div>
        )) : <p>No votes</p>}
      </div>
    </div>
  );
}
