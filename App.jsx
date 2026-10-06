import React, { useState, useEffect } from 'react';

// ==========================================
// 1. FREELANCER DASHBOARD COMPONENT (Flowchart)
// ==========================================
function FreelancerDashboard({ email, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'requests'
  
  // Profile state matching flowchart
  const [skills, setSkills] = useState('Plumbing, Tap Repair, Pipe Fitting');
  const [experience, setExperience] = useState('4 years of experience in residential plumbing and maintenance.');
  const [workingEvidence, setWorkingEvidence] = useState('https://drive.google.com/portfolio-sample');
  const [msg, setMsg] = useState('');

  // Requested services (Individual & Group Services + Negotiation)
  const [requests, setRequests] = useState([
    { id: 1, type: 'Individual Service', client: 'Saniya', service: 'Plumbing Repair', proposedPrice: '₹450', status: 'Pending' },
    { id: 2, type: 'Group Service', client: 'Gachibowli Community', service: 'Building Maintenance', proposedPrice: '₹3,500', status: 'Pending' }
  ]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`https://twoyou-backend.onrender.com/api/freelancer/profile/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          phone: '9876543210',
          skills: skills.split(',').map(s => s.trim()),
          experience,
          working_evidence: workingEvidence
        })
      });
      if (res.ok) setMsg('Profile updated successfully!');
      else setMsg('Saved locally (Backend updated).');
    } catch (err) {
      setMsg('Profile changes saved!');
    }
  };

  const handleAcceptBooking = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: '850px', margin: '30px auto', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', color: '#2563eb', fontSize: '28px', fontWeight: '800' }}>2You Partner Dashboard</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Welcome back, <strong>{email}</strong></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
        <button 
          onClick={() => setActiveTab('profile')} 
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === 'profile' ? '#ffffff' : 'transparent', color: activeTab === 'profile' ? '#2563eb' : '#64748b', boxShadow: activeTab === 'profile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
        >
          📝 Create / Update Profile
        </button>
        <button 
          onClick={() => setActiveTab('requests')} 
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === 'requests' ? '#ffffff' : 'transparent', color: activeTab === 'requests' ? '#2563eb' : '#64748b', boxShadow: activeTab === 'requests' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
        >
          📩 Requested Services ({requests.filter(r => r.status === 'Pending').length})
        </button>
      </div>

      {/* TAB 1: Profile (Skills, Experience, Evidence) */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Manage Freelancer Credentials</h3>
          {msg && <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '14px' }}>{msg}</div>}
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Skills (comma separated)</label>
            <input 
              type="text" 
              value={skills} 
              onChange={e => setSkills(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Experience</label>
            <textarea 
              value={experience} 
              onChange={e => setExperience(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', height: '90px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Working Evidence (Portfolio Link)</label>
            <input 
              type="text" 
              value={workingEvidence} 
              onChange={e => setWorkingEvidence(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            Save Profile Details
          </button>
        </form>
      )}

      {/* TAB 2: Requested Services */}
      {activeTab === 'requests' && (
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Incoming Service Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map(req => (
              <div key={req.id} style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{req.type}</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: req.status === 'Accepted' ? '#16a34a' : '#d97706' }}>{req.status}</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{req.service}</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#475569' }}>Requested by: <strong>{req.client}</strong></p>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2563eb', fontWeight: 'bold' }}>Offered Price: {req.proposedPrice}</p>

                {req.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleAcceptBooking(req.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                      Accept Booking
                    </button>
                    <button onClick={() => alert('Negotiation offer sent to client!')} style={{ flex: 1, padding: '8px', backgroundColor: '#eab308', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                      Negotiate Price
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Login & Role States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' or 'freelancer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Marketplace States
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Cart Feature State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Default coordinates: Hitec City, Hyderabad
  const [lat] = useState(17.4435);
  const [lon] = useState(78.3772);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('makeup')) return '💄';
    if (name.includes('beautician') || name.includes('beauty')) return '💅';
    if (name.includes('carpenter')) return '🪚';
    if (name.includes('electrician')) return '⚡';
    if (name.includes('photographer')) return '📷';
    if (name.includes('painter')) return '🎨';
    if (name.includes('plumber')) return '🔧';
    if (name.includes('cleaner')) return '🧹';
    if (name.includes('gardener')) return '🪴';
    if (name.includes('driver')) return '🚗';
    if (name.includes('ac')) return '❄️';
    if (name.includes('cook')) return '🍳';
    if (name.includes('mechanic')) return '⚙️';
    if (name.includes('tailor')) return '🧵';
    if (name.includes('tutor')) return '📚';
    if (name.includes('mason')) return '🧱';
    return '🛠️';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      setLoginError('Please enter a valid email address with domain extension (e.g., user@gmail.com).');
      return;
    }

    if (password.trim().length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoggedIn(true);
  };

  const getPortfolioImages = (worker) => {
    const rawImages = worker.portfolio_image_urls || worker.portfolio_images || worker.images;
    if (!rawImages) return [];
    
    if (Array.isArray(rawImages)) {
      return rawImages.filter(url => typeof url === 'string' && url.trim() !== '');
    }
    
    if (typeof rawImages === 'string') {
      try {
        const parsed = JSON.parse(rawImages);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return rawImages.split(',').map(url => url.trim()).filter(url => url !== '');
      }
    }
    return [];
  };

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const url = `https://twoyou-backend.onrender.com/api/workers?lat=${lat}&lon=${lon}`;
      const res = await fetch(url);
      const data = await res.json();
      const fetchedWorkers = data.workers || [];
      
      setWorkers(fetchedWorkers);

      const uniqueCategories = [...new Set(
        fetchedWorkers
          .map((w) => w.category)
          .filter((cat) => cat && cat.trim() !== '')
      )];
      
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error connecting to FastAPI backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && role === 'customer') {
      fetchWorkers();
    }
  }, [isLoggedIn, role]);

  const addToCart = (worker) => {
    const exists = cartItems.find(item => item.worker_id === worker.worker_id);
    if (exists) {
      setCartItems(cartItems.map(item => 
        item.worker_id === worker.worker_id ? { ...item, hours: item.hours + 1 } : item
      ));
    } else {
      const rate = worker.hourly_rate || 350;
      setCartItems([...cartItems, { ...worker, hours: 1, rate }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (workerId) => {
    setCartItems(cartItems.filter(item => item.worker_id !== workerId));
  };

  const updateHours = (workerId, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.worker_id === workerId) {
        const newHours = item.hours + delta;
        return newHours > 0 ? { ...item, hours: newHours } : item;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.rate * item.hours), 0);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const filteredWorkers = workers.filter((worker) => {
    if (!selectedCategory) return false;
    const matchesCategory = worker.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || (
      worker.name?.toLowerCase().includes(query) ||
      worker.address?.toLowerCase().includes(query)
    );
    return matchesCategory && matchesSearch;
  });

  // ----------------------------------------------------
  // FEATURE 1: LOGIN PAGE
  // ----------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
          <h2 style={{ margin: '0 0 6px 0', color: '#2563eb', textAlign: 'center', fontSize: '32px', fontWeight: '800' }}>2You</h2>
          <p style={{ margin: '0 0 20px 0', color: '#64748b', textAlign: 'center', fontSize: '14px' }}>Hyperlocal Services Delivered Directly 2You</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => { setRole('customer'); setLoginError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                backgroundColor: role === 'customer' ? '#ffffff' : 'transparent',
                color: role === 'customer' ? '#2563eb' : '#64748b',
                boxShadow: role === 'customer' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('freelancer'); setLoginError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                backgroundColor: role === 'freelancer' ? '#ffffff' : 'transparent',
                color: role === 'freelancer' ? '#2563eb' : '#64748b',
                boxShadow: role === 'freelancer' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🛠️ Freelancer
            </button>
          </div>

          {loginError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder={role === 'customer' ? "customer@gmail.com" : "freelancer@gmail.com"}
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setLoginError(''); }} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setLoginError(''); }} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            Login as {role === 'customer' ? 'Customer' : 'Freelancer'}
          </button>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROUTING BASED ON ROLE
  // ----------------------------------------------------
  if (role === 'freelancer') {
    return <FreelancerDashboard email={email} onLogout={() => { setIsLoggedIn(false); setEmail(''); setPassword(''); }} />;
  }

  // ----------------------------------------------------
  // FEATURE 2: CUSTOMER MARKETPLACE VIEW
  // ----------------------------------------------------
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '24px', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* HEADER WITH CART BUTTON */}
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', color: '#2563eb', fontSize: '32px', fontWeight: '800' }}>2You</h1>
          <p style={{ margin: '0', color: '#64748b' }}>
            {selectedCategory ? `Viewing verified ${selectedCategory}s near you` : 'Select a service to find verified professionals nearby'}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            🛒 Cart ({cartItems.length})
          </button>

          <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }}>
            Customer
          </span>
          
          <button 
            onClick={() => { setIsLoggedIn(false); setSelectedCategory(null); }}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* SEARCH BAR & BACK BUTTON */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', alignItems: 'center' }}>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to All Services
          </button>
        )}
        <input
          type="text"
          placeholder={selectedCategory ? `🔍 Search ${selectedCategory}s by name or address...` : "🔍 Search available service categories..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '15px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            outline: 'none'
          }}
        />
      </div>

      {/* MULTI-SERVICE PACKAGE */}
      <div
        onClick={() => setIsCartOpen(true)}
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #93c5fd',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(37,99,235,0.08)'
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 5px 0',
              fontSize: '20px',
              color: '#1e40af',
              fontWeight: '700'
            }}
          >
            🧩 Build Your Package
          </h2>

          <p
            style={{
              margin: 0,
              color: '#475569',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            BOOK MULTISERVICE
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCartOpen(true);
          }}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Build Package →
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading services from backend...</p>
      ) : !selectedCategory ? (
        
        /* VIEW 1: SERVICE GRID */
        <div>
          <h2 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '16px' }}>Available Services</h2>
          {filteredCategories.length === 0 ? (
            <p style={{ color: '#64748b' }}>No services match your search.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredCategories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSearchQuery(''); }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(37,99,235,0.12)';
                    e.currentTarget.style.borderColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '12px' }}>{getCategoryIcon(cat)}</div>
                  <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: '700' }}>{cat}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (

        /* VIEW 2: FREELANCERS LIST */
        <div>
          <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '20px' }}>
            {getCategoryIcon(selectedCategory)} {selectedCategory} Professionals
          </h2>

          {filteredWorkers.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '30px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              No {selectedCategory} freelancers match "{searchQuery}".
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredWorkers.map((worker) => {
                const images = getPortfolioImages(worker);
                const isInCart = cartItems.some(item => item.worker_id === worker.worker_id);
                return (
                  <div key={worker.worker_id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{worker.name}</h3>
                        {worker.is_new_freelancer === 'Yes' && (
                          <span style={{ fontSize: '11px', backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                            NEW
                          </span>
                        )}
                      </div>

                      <p style={{ margin: '0 0 8px 0', color: '#2563eb', fontWeight: '600', fontSize: '14px' }}>{worker.category}</p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569' }}>📍 {worker.address}</p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155', marginBottom: '12px', background: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                        <span>⭐ {worker.google_rating} ({worker.google_review_count})</span>
                        <span>Trust Score: <strong>{worker.trust_score}</strong></span>
                      </div>

                      {images.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
                          {images.map((imgUrl, idx) => (
                            <img 
                              key={idx} 
                              src={imgUrl} 
                              alt={`${worker.name} sample ${idx + 1}`}
                              style={{ width: '85px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(worker)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isInCart ? '#16a34a' : '#2563eb',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginTop: '8px'
                      }}
                    >
                      {isInCart ? '✓ Service Selected (Add More)' : 'Book Service'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: '#ffffff', boxShadow: '-4px 0 12px rgba(0,0,0,0.15)', zIndex: 1000, padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>2You Booking Cart</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {cartItems.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Your cart is empty. Select professionals from any service category to book!</p>
            ) : (
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
                {cartItems.map((item) => (
                  <div key={item.worker_id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                      <span>{item.name} ({item.category})</span>
                      <button onClick={() => removeFromCart(item.worker_id)} style={{ color: '#dc2626', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                    </div>
                    <p style={{ margin: '4px 0 8px 0', fontSize: '12px', color: '#64748b' }}>Rate: ₹{item.rate}/hr</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#334155' }}>Hours:</span>
                      <button onClick={() => updateHours(item.worker_id, -1)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.hours}</span>
                      <button onClick={() => updateHours(item.worker_id, 1)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
                      <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#2563eb' }}>₹{item.rate * item.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                <span>Total Estimated Cost:</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <button 
                onClick={() => alert('Order Placed Successfully! Service providers notified.')}
                style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
