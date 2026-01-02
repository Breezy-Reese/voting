import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import HeartIcon from '../components/HeartIcon';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B'];

const renderCustomLabel = ({ name, percent }) => {
  return `${(percent * 100).toFixed(1)}%`;
};

const formatNumber = (n) => (typeof n === 'number' ? n.toLocaleString() : n);


export default function AdminPanel() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    candidates: [],
    users: [],
    votes: [],
    totalVotes: 0,
    totalUsers: 0,
    userRoles: [],
    candidateVotes: [],
  });
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    candidates: false,
    users: false,
    votes: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [candidateSearch, setCandidateSearch] = useState('');

  const filteredCandidates = data.candidates.filter((c) =>
    c.name?.toLowerCase().includes(candidateSearch.toLowerCase()) || c.party?.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== 'admin') return;
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [candRes, usersRes, votesRes, countRes, userCountRes, healthRes, roleRes, candVotesRes] = await Promise.all([
        API.get('/candidates'),
        API.get('/auth/users'),
        API.get('/votes'),
        API.get('/votes/count'),
        API.get('/auth/users/count'),
        API.get('/health'),
        API.get('/auth/users/role-counts'),
        API.get('/candidates/vote-stats'),
      ]);
      
      setHealth(healthRes.data);
      setData({
        candidates: candRes.data,
        users: usersRes.data,
        votes: votesRes.data,
        totalVotes: countRes.data.totalVotes,
        totalUsers: userCountRes.data.totalUsers,
        userRoles: roleRes.data || [],
        candidateVotes: candVotesRes.data || [],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addCandidate = async () => {
    if (!name || !party) return;
    try {
      const res = await API.post('/candidates', { name, party });
      setData({ ...data, candidates: [...data.candidates, res.data] });
      setName('');
      setParty('');
    } catch (err) {
      setError(err.message);
    }
  };

  const removeCandidate = async (id) => {
    try {
      await API.delete(`/candidates/${id}`);
      setData({ ...data, candidates: data.candidates.filter(c => c._id !== id) });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (user?.role !== 'admin') return <div style={{ padding: '2rem' }}>Access denied</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? '250px' : '70px',
        backgroundColor: '#1a2332',
        color: 'white',
        padding: '1rem',
        transition: 'width 0.3s',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: sidebarOpen ? '1.5rem' : '1rem' }}>🗳️</h2>
          {sidebarOpen && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>VotingApp</p>}
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {sidebarOpen && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Menu</p>}
            
            {/* Dashboard */}
            <div
              onClick={() => setActiveSection('dashboard')}
              style={{
                padding: '0.75rem',
                backgroundColor: activeSection === 'dashboard' ? '#0088FE' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: activeSection === 'dashboard' ? 'white' : '#aaa',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== 'dashboard') {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== 'dashboard') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#aaa';
                }
              }}
            >
              <span>📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </div>

            {/* System Health */}
            <div
              onClick={() => setActiveSection('health')}
              style={{
                padding: '0.75rem',
                backgroundColor: activeSection === 'health' ? '#28a745' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: activeSection === 'health' ? 'white' : '#aaa',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== 'health') {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== 'health') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#aaa';
                }
              }}
            >
              <span>🏥</span>
              {sidebarOpen && <span>System Health</span>}
            </div>

            {/* Candidates */}
            <div
              onClick={() => setActiveSection('candidates')}
              style={{
                padding: '0.75rem',
                backgroundColor: activeSection === 'candidates' ? '#FFBB28' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: activeSection === 'candidates' ? '#333' : '#aaa',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== 'candidates') {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== 'candidates') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#aaa';
                }
              }}
            >
              <span>🎯</span>
              {sidebarOpen && <span>Candidates</span>}
            </div>

            {/* Users */}
            <div
              onClick={() => setActiveSection('users')}
              style={{
                padding: '0.75rem',
                backgroundColor: activeSection === 'users' ? '#0088FE' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: activeSection === 'users' ? 'white' : '#aaa',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== 'users') {
                  e.currentTarget.style.backgroundColor = '#333';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== 'users') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#aaa';
                }
              }}
            >
              <span>👥</span>
              {sidebarOpen && <span>Users</span>}
            </div>
          </div>
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: '0.5rem',
            backgroundColor: '#333',
            border: 'none',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem',
            fontSize: '1rem',
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem',
            backgroundColor: '#dc3545',
            border: 'none',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <span>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* TOP HEADER */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(90deg,#0f1724 0%, #0b3d91 60%)',
            color: 'white',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 6px 20px rgba(2,6,23,0.2)',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#00C49F,#0088FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🗳️</div>
              <div>
                <h1 style={{ margin: 0, color: 'white', fontSize: '1.4rem' }}>Admin Dashboard</h1>
                <p style={{ margin: '0.25rem 0 0 0', color: '#cfe7ff', fontSize: '0.9rem' }}>Welcome back, <strong style={{ color: 'white' }}>{user?.username}</strong></p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right', color: '#cfe7ff' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0b3d91', fontWeight: '700' }}>{(user?.username || 'A').charAt(0).toUpperCase()}</div>
            </div>
          </div>

          <div style={{ position: 'absolute', right: '2rem', top: '100%', transform: 'translateY(-25%)' }}>
            {/* floating quick KPI small card */}
            <div style={{ background: 'white', padding: '0.75rem 1rem', borderRadius: 8, boxShadow: '0 6px 20px rgba(2,6,23,0.12)' }}>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Vote Rate</div>
              <div style={{ fontWeight: '700', color: '#0b3d91' }}>{data.totalUsers > 0 ? ((data.totalVotes / data.totalUsers) * 100).toFixed(1) : 0}%</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>❌ {error}</div>}

          {/* DASHBOARD VIEW */}
          {activeSection === 'dashboard' && (
            <>
          {/* HEALTH STATUS */}
          {health && (
            <div style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '2px solid #28a745',
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#28a745' }}><HeartIcon color="#FF6B6B" /> System Health</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Server Status</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#28a745' }}>🟢 Online</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#fff8f0', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Uptime</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#FF8042' }}>{health.uptime ? (health.uptime / 3600).toFixed(1) : 'N/A'} hrs</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f0fff4', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Database</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#00C49F' }}>✅ Connected</p>
                </div>
              </div>
            </div>
          )}

          {/* KPI CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderTop: '4px solid #0088FE',
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>Total Users</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#0088FE' }}>{data.totalUsers}</h2>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderTop: '4px solid #28a745',
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>Total Votes</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{data.totalVotes}</h2>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderTop: '4px solid #FFBB28',
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>Candidates</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#FFBB28' }}>{data.candidates.length}</h2>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderTop: '4px solid #FF8042',
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>Vote Rate</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#FF8042' }}>{data.totalUsers > 0 ? ((data.totalVotes / data.totalUsers) * 100).toFixed(1) : 0}%</h2>
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Users by Role */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>Users Distribution</h3>
              {data.userRoles && data.userRoles.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={data.userRoles} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={renderCustomLabel} labelLine={false}>
                      {data.userRoles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} users`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No data</p>
              )}
            </div>

            {/* Votes by Candidate */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>Votes by Candidate</h3>
              {data.candidateVotes && data.candidateVotes.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={data.candidateVotes} dataKey="voteCount" nameKey="candidateName" cx="50%" cy="50%" outerRadius={80} label={renderCustomLabel} labelLine={false}>
                      {data.candidateVotes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} votes`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No votes yet</p>
              )}
            </div>
          </div>

          {/* ADD CANDIDATE FORM */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            borderLeft: '4px solid #007bff',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>➕ Add New Candidate</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
              <label style={{ fontSize: '0.9rem', color: '#666' }}>Name:</label>
              <input
                type="text"
                placeholder="Candidate Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              />
              <label style={{ fontSize: '0.9rem', color: '#666', marginLeft: '-1rem' }}>Party:</label>
              <input
                type="text"
                placeholder="Party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
              />
              <button
                onClick={addCandidate}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                ➕ Add
              </button>
            </div>
          </div>

          {/* COLLAPSIBLE SECTIONS */}
          {/* CANDIDATES */}
          <div style={{ marginBottom: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <button
              onClick={() => toggleSection('candidates')}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: '#FFBB28',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FFA500'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFBB28'}
            >
              <span>🎯 Candidates ({data.candidates.length})</span>
              <span>{expandedSections.candidates ? '▼' : '▶'}</span>
            </button>
            {expandedSections.candidates && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #ddd' }}>
                {filteredCandidates.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Party</th>
                        <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid #ddd' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((c) => (
                        <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>{c.name}</td>
                          <td style={{ padding: '1rem' }}>{c.party}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                              onClick={() => removeCandidate(c._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              ❌ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>No candidates</p>
                )}
              </div>
            )}
          </div>

          {/* USERS */}
          <div style={{ marginBottom: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <button
              onClick={() => toggleSection('users')}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: '#0088FE',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0088FE'}
            >
              <span>👥 Users ({data.users.length})</span>
              <span>{expandedSections.users ? '▼' : '▶'}</span>
            </button>
            {expandedSections.users && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #ddd' }}>
                {data.users.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Username</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Full Name</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>{u.username}</td>
                          <td style={{ padding: '1rem' }}>{u.fullName}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: u.role === 'admin' ? '#dc3545' : '#00C49F',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                            }}>
                              {u.role === 'admin' ? '👑 Admin' : '🗳️ Voter'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>No users</p>
                )}
              </div>
            )}
          </div>

          {/* VOTES */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <button
              onClick={() => toggleSection('votes')}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: '#28a745',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1e7e34'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              <span>📋 Recent Votes ({data.votes.length})</span>
              <span>{expandedSections.votes ? '▼' : '▶'}</span>
            </button>
            {expandedSections.votes && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #ddd' }}>
                {data.votes.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Voter</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Candidate</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.votes.slice(0, 50).map((v) => (
                        <tr key={v._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>✓ {v.voterId?.username || 'Unknown'}</td>
                          <td style={{ padding: '1rem' }}>🎤 {v.candidateId?.name || 'Unknown'}</td>
                          <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>{new Date(v.votedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>No votes yet</p>
                )}
              </div>
            )}
          </div>
            </>
          )}

          {/* HEALTH VIEW */}
          {activeSection === 'health' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#1a2332' }}><HeartIcon color="#FF6B6B" /> System Health Status</h2>
              {health && (
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '2px solid #28a745',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '4px', border: '1px solid #0088FE' }}>
                      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>🟢 Server Status</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>Healthy</p>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>All systems operational</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fff8f0', borderRadius: '4px', border: '1px solid #FFBB28' }}>
                      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>⏱️ Uptime</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#FF8042' }}>{health.uptime ? (health.uptime / 3600).toFixed(2) : 'N/A'} hours</p>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>Continuous operation</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f0fff4', borderRadius: '4px', border: '1px solid #00C49F' }}>
                      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>💾 Database</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#00C49F' }}>✅ Connected</p>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>MongoDB Active</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fff5f5', borderRadius: '4px', border: '1px solid #FF6B6B' }}>
                      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', fontWeight: 'bold' }}>🧠 Memory Usage</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#FF6B6B' }}>{health.memory ? Math.round(health.memory) : 'N/A'} MB</p>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.85rem' }}>Normal levels</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CANDIDATES VIEW */}
          {activeSection === 'candidates' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#1a2332' }}>🎯 Manage Candidates</h2>
              
              {/* Add Candidate Form */}
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                borderLeft: '4px solid #FFBB28',
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>➕ Add New Candidate</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr', gap: '1rem', alignItems: 'end' }}>
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Name:</label>
                  <input
                    type="text"
                    placeholder="Candidate Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                  />
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Party:</label>
                  <input
                    type="text"
                    placeholder="Party"
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                  />
                  <button
                    onClick={addCandidate}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#FFBB28',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FFA500'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FFBB28'}
                  >
                    ➕ Add
                  </button>
                </div>
              </div>

              {/* Candidates List */}
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>All Candidates ({data.candidates.length})</h3>
                  <input
                    placeholder="Search candidates..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ddd', width: 240 }}
                  />
                </div>
                {filteredCandidates.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Party</th>
                        <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid #ddd' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((c) => (
                        <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>{c.name}</td>
                          <td style={{ padding: '1rem' }}>{c.party}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                              onClick={() => removeCandidate(c._id)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              ❌ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>No candidates yet</p>
                )}
              </div>
            </div>
          )}

          {/* USERS VIEW */}
          {activeSection === 'users' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#1a2332' }}>👥 Manage Users</h2>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                {data.users.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Username</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Full Name</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #ddd' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>{u.username}</td>
                          <td style={{ padding: '1rem' }}>{u.fullName}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: u.role === 'admin' ? '#dc3545' : '#00C49F',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                            }}>
                              {u.role === 'admin' ? '👑 Admin' : '🗳️ Voter'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>No users</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
