import React, { useState, useEffect } from 'react';

// ==========================================
// 1. FREELANCER DASHBOARD COMPONENT
// ==========================================
function FreelancerDashboard({ freelancer, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'requests'
  
  // Profile state from flowchart (Skills, Experience, Working Evidence)
  const [skills, setSkills] = useState(freelancer.skills ? freelancer.skills.join(', ') : '');
  const [experience, setExperience] = useState(freelancer.experience || '');
  const [workingEvidence, setWorkingEvidence] = useState(freelancer.working_evidence || '');
  const [msg, setMsg] = useState('');

  // Service Requests state (Individual & Group Services from flowchart)
  const [requests, setRequests] = useState([
    { id: 1, type: 'Individual', client: 'Alice', service: 'Tap Repair', proposedPrice: '$40', status: 'Pending' },
    { id: 2, type: 'Group', client: 'Community Hall', service: 'Full Wiring', proposedPrice: '$300', status: 'Pending' }
  ]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`https://twoyou-backend.onrender.com/api/freelancer/profile/${freelancer.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: freelancer.name,
          phone: freelancer.phone || '',
          skills: skills.split(',').map(s => s.trim()),
          experience,
          working_evidence: workingEvidence
        })
      });
      if (res.ok) setMsg('Profile updated successfully!');
      else setMsg('Failed to update profile.');
    } catch (err) {
      setMsg('Error connecting to backend.');
    }
  };

  const handleAcceptBooking = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {freelancer.name} (Freelancer)</h2>
        <button onClick={onLogout} style={{ padding: '6px 16px', cursor: 'pointer' }}>Logout</button>
      </header>

      {/* Navigation Tabs based on Flowchart */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button 
          onClick={() => setActiveTab('profile')} 
          style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === 'profile' ? 'bold' : 'normal' }}
        >
          Create / Update Profile
        </button>
        <button 
          onClick={() => setActiveTab('requests')} 
          style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === 'requests' ? 'bold' : 'normal' }}
        >
          Requested Services
        </button>
      </div>

      <hr style={{ marginBottom: '20px' }} />

      {/* TAB 1: Profile (Skills, Experience, Evidence) */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Update Profile</h3>
          {msg && <p style={{ color: msg.includes('successfully') ? 'green' : 'red' }}>{msg}</p>}
          
          <div>
            <label><strong>Skills</strong> (comma-separated):</label>
            <input 
              type="text" 
              value={skills} 
              onChange={e => setSkills(e.target.value)} 
              placeholder="e.g. Plumbing, Wiring, Cleaning"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div>
            <label><strong>Experience</strong>:</label>
            <textarea 
              value={experience} 
              onChange={e => setExperience(e.target.value)} 
              placeholder="Describe your work experience..."
              style={{ width: '100%', padding: '8px', marginTop: '5px', height: '80px' }}
            />
          </div>

          <div>
            <label><strong>Working Evidence</strong> (Portfolio/Photos Link):</label>
            <input 
              type="text" 
              value={workingEvidence} 
              onChange={e => setWorkingEvidence(e.target.value)} 
              placeholder="https://drive.google.com/..."
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save Profile
          </button>
        </form>
      )}

      {/* TAB 2: Requested Services (Individual & Group) */}
      {activeTab === 'requests' && (
        <div>
          <h3>Incoming Service Requests</h3>
          {requests.map(req => (
            <div key={req.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
              <p><strong>Type:</strong> {req.type} Service</p>
              <p><strong>Client:</strong> {req.client}</p>
              <p><strong>Service:</strong> {req.service}</p>
              <p><strong>Offered Price:</strong> {req.proposedPrice}</p>
              <p><strong>Status:</strong> <span style={{ color: req.status === 'Accepted' ? 'green' : 'orange', fontWeight: 'bold' }}>{req.status}</span></p>

              {req.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleAcceptBooking(req.id)} style={{ backgroundColor: '#007bff', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Accept Booking
                  </button>
                  <button onClick={() => alert('Negotiation offer sent to client!')} style={{ backgroundColor: '#ffc107', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Negotiate Price
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. CLIENT SERVICES VIEW COMPONENT
// ==========================================
function ClientServicesView({ client, onLogout }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const lat = 17.4435;
      const lon = 78.3772;
      const res = await fetch(`https://twoyou-backend.onrender.com/api/workers?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setWorkers(data.workers || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {client ? client.name : 'Client'} (Services View)</h2>
        <button onClick={onLogout} style={{ padding: '6px 16px', cursor: 'pointer' }}>Logout</button>
      </header>

      <h3>Nearby Service Providers</h3>
      {loading ? (
        <p>Loading available service providers...</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {workers.map((w, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px' }}>
              <h4>{w.name || 'Service Provider'}</h4>
              <p><strong>Category:</strong> {w.category || 'General'}</p>
              <p><strong>Phone:</strong> {w.phone || 'N/A'}</p>
              <button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Book Service
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MAIN APP ROUTER & AUTH HANDLER
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // 'freelancer' or 'client'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load active session from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = selectedRole === 'freelancer' 
      ? 'https://twoyou-backend.onrender.com/api/freelancer/login'
      : 'https://twoyou-backend.onrender.com/api/freelancer/login'; // Replace with client endpoint when created

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');

      const userData = { ...(data.freelancer || data.user || { email, name: email.split('@')[0] }), role: selectedRole };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    localStorage.removeItem('user');
  };

  // ----------------------------------------
  // SCREEN 1: Choose Freelancer or Client (Flowchart Root)
  // ----------------------------------------
  if (!user && !selectedRole) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'sans-serif' }}>
        <h1>Welcome to 2You Marketplace</h1>
        <p style={{ fontSize: '18px', color: '#555' }}>Choose how you want to log in:</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={() => setSelectedRole('freelancer')}
            style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            I am a Freelancer
          </button>
          <button 
            onClick={() => setSelectedRole('client')}
            style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            I am a Client
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // SCREEN 2: Role-Specific Login Form
  // ----------------------------------------
  if (!user && selectedRole) {
    return (
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
        <h2>{selectedRole === 'freelancer' ? 'Freelancer Login' : 'Client Login'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button onClick={() => setSelectedRole(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
          ← Back to role selection
        </button>
      </div>
    );
  }

  // ----------------------------------------
  // SCREEN 3: Logged-In View Routing by Role
  // ----------------------------------------
  if (user.role === 'freelancer') {
    return <FreelancerDashboard freelancer={user} onLogout={handleLogout} />;
  }

  return <ClientServicesView client={user} onLogout={handleLogout} />;
}
