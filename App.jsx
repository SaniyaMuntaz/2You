import React, { useState, useEffect } from 'react';

// ==========================================
// 1. FREELANCER DASHBOARD COMPONENT
// ==========================================
function FreelancerDashboard({ email, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [skills, setSkills] = useState('Plumbing, Tap Repair, Pipe Fitting');
  const [experience, setExperience] = useState('4 years of experience in residential plumbing and maintenance.');
  const [workingEvidence, setWorkingEvidence] = useState('https://drive.google.com/portfolio-sample');
  const [msg, setMsg] = useState('');

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
const getWorkerRate = (worker) => {
  if (Number(worker.hourly_rate) > 0) {
    return Number(worker.hourly_rate);
  }

  const idNumber = Number(
    String(worker.worker_id || "0").replace(/\D/g, "")
  );

  return 200 + ((idNumber * 37) % 7) * 50;
};

// Helper to automatically generate multiple team packages
const generateMultiplePackageTeams = (selectedCategories, allWorkers) => {
  if (!selectedCategories || selectedCategories.length === 0) return [];

  const workersByCategory = {};
  selectedCategories.forEach((cat) => {
    workersByCategory[cat] = allWorkers.filter(
      (w) => w.category?.toLowerCase() === cat.toLowerCase()
    );
  });

  const maxPossibleTeams = Math.max(
    ...selectedCategories.map((cat) => (workersByCategory[cat] || []).length)
  );

  if (maxPossibleTeams === 0) return [];

  const teams = [];

  for (let i = 0; i < maxPossibleTeams; i++) {
    const teamMembers = selectedCategories
      .map((cat) => {
        const matches = workersByCategory[cat] || [];
        return matches[i] || matches[matches.length - 1];
      })
      .filter(Boolean);

    if (teamMembers.length === 0) continue;

    if (i === 0) {
      teams.push({
        id: `team-${i + 1}`,
        name: '⭐ Top Rated Team',
        badge: 'HIGHEST TRUST SCORE',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e',
        borderColor: '#f59e0b',
        members: teamMembers
      });
    } else if (i === 1) {
      teams.push({
        id: `team-${i + 1}`,
        name: '💰 Best Value Team',
        badge: 'BUDGET FRIENDLY',
        badgeBg: '#dcfce7',
        badgeColor: '#166534',
        borderColor: '#16a34a',
        members: teamMembers
      });
    } else if (i === 2) {
      teams.push({
        id: `team-${i + 1}`,
        name: '⚡ Fast Response Team',
        badge: 'POPULAR CHOICE',
        badgeBg: '#dbeafe',
        badgeColor: '#1e40af',
        borderColor: '#2563eb',
        members: teamMembers
      });
    } else {
      teams.push({
        id: `team-${i + 1}`,
        name: `👥 Standard Package Team ${i + 1}`,
        badge: 'AVAILABLE TEAM',
        badgeBg: '#f1f5f9',
        badgeColor: '#475569',
        borderColor: '#cbd5e1',
        members: teamMembers
      });
    }
  }

  return teams;
};

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFreelancers, setShowNewFreelancers] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState(null);
  const [negotiationStatus, setNegotiationStatus] = useState(null);

  
const [bookingDate, setBookingDate] = useState('');
const [bookingTime, setBookingTime] = useState('');

  
const [bookingType, setBookingType] = useState('normal');

const PRIORITY_BOOKING_RATE = 0.10;


const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];


  // Portfolio Modal State
  const [activePortfolioWorker, setActivePortfolioWorker] = useState(null);

  // Chat Feature States & Auto-reply Simulation
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'freelancer', text: 'Hello! I saw your booking/negotiation request. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Multi-Service Package Page States
  const [isPackagePageOpen, setIsPackagePageOpen] = useState(false);
  const [packageStep, setPackageStep] = useState(1);
  const [selectedPackageCategories, setSelectedPackageCategories] = useState([]);

  const [lat] = useState(17.4435);
  const [lon] = useState(78.3772);

  // Auto-reply Simulation Logic
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    const newMessages = [...chatMessages, { sender: 'customer', text: userMsg }];
    setChatMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Thanks for your message! I'm reviewing your request and will confirm shortly.";
      const lower = userMsg.toLowerCase();

      if (lower.includes('price') || lower.includes('discount') || lower.includes('cost') || lower.includes('rate') || lower.includes('₹')) {
        replyText = "I can offer a slight discount if we finalize the booking time today! Let's agree on the price.";
      } else if (lower.includes('time') || lower.includes('when') || lower.includes('today') || lower.includes('tomorrow') || lower.includes('available')) {
        replyText = "I'm available within 30-45 minutes. What time works best for you?";
      } else if (lower.includes('location') || lower.includes('address') || lower.includes('where')) {
        replyText = "I have noted your location. My team is nearby and ready to dispatch.";
      }

      setChatMessages([...newMessages, { sender: 'freelancer', text: replyText }]);
      setIsTyping(false);
    }, 1200);
  };

  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return '🛠️';
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
    if (name.includes('ac')) return '❄';
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

  // Helper to accurately extract the number of portfolio items from database fields
  const getPortfolioCount = (worker) => {
    if (worker.portfolio_count !== undefined && !isNaN(worker.portfolio_count)) {
      return Number(worker.portfolio_count);
    }
    
    const rawImages = worker.portfolio_image_urls || worker.portfolio_images || worker.images || worker.working_evidence;
    if (!rawImages) return 3; // default fallback count for demo

    if (Array.isArray(rawImages)) {
      return rawImages.length || 3;
    } else if (typeof rawImages === 'string') {
      const trimmed = rawImages.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          return parsed.length || 3;
        } catch (e) {
          return 3;
        }
      } else if (trimmed.includes(',')) {
        return trimmed.split(',').length;
      }
    }
    return 3;
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

  const togglePackageCategory = (category) => {
    setSelectedPackageCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const addToCart = (worker) => {
    setCartItems((prevCart) => {
      const exists = prevCart.find((item) => item.worker_id === worker.worker_id);
      if (exists) {
        return prevCart.map((item) =>
          item.worker_id === worker.worker_id ? { ...item, hours: item.hours + 1 } : item
        );
      } else {
        const rate = getWorkerRate(worker);
        return [...prevCart, { ...worker, hours: 1, rate }];
      }
    });
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

  const matchesCategory =
    worker.category?.toLowerCase() === selectedCategory.toLowerCase();

  const query = searchQuery.toLowerCase().trim();

  const matchesSearch = !query || (
    worker.name?.toLowerCase().includes(query) ||
    worker.address?.toLowerCase().includes(query)
  );

  const isNewFreelancer =
    String(worker.is_new_freelancer).toLowerCase() === 'yes';

  return (
    matchesCategory &&
    matchesSearch &&
    (!showNewFreelancers || isNewFreelancer)
  );
});


  // FEATURE 1: LOGIN PAGE
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
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: role === 'customer' ? '#ffffff' : 'transparent', color: role === 'customer' ? '#2563eb' : '#64748b', boxShadow: role === 'customer' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => { setRole('freelancer'); setLoginError(''); }}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: role === 'freelancer' ? '#ffffff' : 'transparent', color: role === 'freelancer' ? '#2563eb' : '#64748b', boxShadow: role === 'freelancer' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
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

  // ROUTING BASED ON ROLE
  if (role === 'freelancer') {
    return <FreelancerDashboard email={email} onLogout={() => { setIsLoggedIn(false); setEmail(''); setPassword(''); }} />;
  }

  // FEATURE 3: DEDICATED MULTI-SERVICE PACKAGE PAGE
  if (isPackagePageOpen) {
    return (
      <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '24px', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
        <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px 0', color: '#2563eb', fontSize: '30px', fontWeight: '800' }}>🧩 Build Your Service Package</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Bundle multiple services together for your custom project</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
            >
              🛒 Cart ({cartItems.length})
            </button>
            <button
              onClick={() => { setIsPackagePageOpen(false); setPackageStep(1); }}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              Exit Package Mode ✕
            </button>
          </div>
        </header>

        {packageStep === 1 && (
          <div>
            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>Step 1: Choose the services you need</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Select all service categories required for your project:</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {categories.map((cat) => {
                const isSelected = selectedPackageCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => togglePackageCategory(cat)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{getCategoryIcon(cat)}</span>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{cat}</div>
                      <div style={{ fontSize: '12px', color: isSelected ? '#2563eb' : '#64748b', marginTop: '2px', fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {isSelected ? '✓ Selected' : 'Click to select'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '15px', color: '#334155' }}>
                Selected Services: <strong>{selectedPackageCategories.length}</strong>
              </span>
              <button
                onClick={() => setPackageStep(2)}
                disabled={selectedPackageCategories.length === 0}
                style={{
                  padding: '12px 24px',
                  backgroundColor: selectedPackageCategories.length > 0 ? '#2563eb' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: selectedPackageCategories.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                Continue → Select Freelancers
              </button>
            </div>
          </div>
        )}

        {packageStep === 2 && (() => {
          const generatedTeams = generateMultiplePackageTeams(selectedPackageCategories, workers);

          const selectTeamForCart = (teamMembers) => {
            setCartItems((prevCart) => {
              const updatedCart = [...prevCart];
              
              teamMembers.forEach((worker) => {
                const exists = updatedCart.find((item) => item.worker_id === worker.worker_id);
                if (exists) {
                  const idx = updatedCart.findIndex((item) => item.worker_id === worker.worker_id);
                  updatedCart[idx] = { ...updatedCart[idx], hours: updatedCart[idx].hours + 1 };
                } else {
                  const rate = getWorkerRate(worker);
                  updatedCart.push({ ...worker, hours: 1, rate });
                }
              });

              return updatedCart;
            });
            setIsCartOpen(true);
          };

          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0 }}>Step 2: Choose Your Package Team</h2>
                  <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                    {generatedTeams.length} available team combination{generatedTeams.length > 1 ? 's' : ''} assembled from nearby freelancers:
                  </p>
                </div>
                <button
                  onClick={() => setPackageStep(1)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  ← Modify Selected Services
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {generatedTeams.map((team) => {
                 const teamTotal = team.members.reduce(
  (sum, worker) => sum + getWorkerRate(worker),
  0
);
                  const isTeamInCart = team.members.every((w) =>
                    cartItems.some((item) => item.worker_id === w.worker_id)
                  );

                  return (
                    <div 
                      key={team.id} 
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: `2px solid ${team.borderColor}`, 
                        borderRadius: '14px', 
                        padding: '24px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '12px', backgroundColor: team.badgeBg, color: team.badgeColor, padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                            {team.badge}
                          </span>
                          <h3 style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '20px' }}>
                            {team.name} ({team.members.length} Professionals)
                          </h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>Combined Rate</div>
                          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563eb' }}>₹{teamTotal}/hr</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        {team.members.map((worker, idx) => {
                          const pCount = getPortfolioCount(worker);
                          return (
                            <div key={`${worker.worker_id}-${idx}`} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', marginBottom: '4px' }}>
                                  {getCategoryIcon(worker.category)} {worker.category}
                                </div>
                                <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '16px' }}>{worker.name}</h4>
                                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748b' }}>📍 {worker.address}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '10px' }}>
                                  <span>⭐ {worker.google_rating || '4.5'}</span>
                             <strong>₹{getWorkerRate(worker)}/hr</strong>
                                </div>
                              </div>

                              <button
                                onClick={() => setActivePortfolioWorker(worker)}
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#2563eb', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                              >
                                📁 View Portfolio ({pCount} Work Samples)
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => selectTeamForCart(team.members)}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: isTeamInCart ? '#16a34a' : '#2563eb',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '15px',
                          cursor: 'pointer'
                        }}
                      >
                        {isTeamInCart ? '✓ Team Selected in Booking Cart' : `🤝 Select ${team.name} (₹${teamTotal}/hr)`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* SLIDE-OVER CART DRAWER (PACKAGE VIEW) */}
        {isCartOpen && (
          <div style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', backgroundColor: '#ffffff', boxShadow: '-4px 0 12px rgba(0,0,0,0.15)', zIndex: 1000, padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>2You Package Cart</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
              </div>

              {cartItems.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Your package cart is empty.</p>
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
                {negotiationStatus === 'pending' && (
                  <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span>⏳ Negotiation requested for ₹{negotiatedPrice} (Awaiting partner confirmation)</span>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      💬 Chat
                    </button>
                  </div>
                )}

                {negotiationStatus === 'accepted' && (
                  <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
                    🎉 Negotiated for ₹{negotiatedPrice}
                  </div>
                )}

                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => alert('Package Booking Placed Successfully! Service providers notified.')}
                    style={{ flex: 1, padding: '12px 8px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Confirm Package Booking
                  </button>
                  <button 
                    onClick={() => {
                      const proposedPrice = prompt(`The current total is ₹${calculateTotal()}. Enter your proposed price (₹):`, calculateTotal());
                      if (proposedPrice && !isNaN(proposedPrice)) {
                        setNegotiatedPrice(proposedPrice);
                        setNegotiationStatus('pending');
                      }
                    }}
                    style={{ flex: 1, padding: '12px 8px', backgroundColor: '#eab308', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    {negotiationStatus === 'pending' ? 'Update Offer' : 'Negotiate Price'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHAT POPUP DRAWER (PACKAGE VIEW) */}
        {isChatOpen && (
          <div style={{ position: 'fixed', bottom: '20px', right: '400px', width: '320px', height: '420px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 1100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#2563eb', color: '#ffffff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>💬 Chat with Service Provider</span>
              <button onClick={() => setIsChatOpen(false)} style={{ border: 'none', background: 'transparent', color: '#ffffff', fontSize: '16px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'customer' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'customer' ? '#2563eb' : '#ffffff',
                    color: msg.sender === 'customer' ? '#ffffff' : '#0f172a',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    maxWidth: '80%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    border: msg.sender === 'customer' ? 'none' : '1px solid #e2e8f0'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: '#e2e8f0', color: '#64748b', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic' }}>
                  typing response...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
  const projectCardStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '24px',
  padding: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid #dbeafe',
  borderRadius: '14px',
  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.04)',
};

const projectImageStyle = {
  width: '180px',
  minHeight: '120px',
  borderRadius: '10px',
  backgroundColor: '#eff6ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '48px',
};

const projectContentStyle = {
  flex: 1,
  minWidth: '220px',
};

const projectTitleStyle = {
  margin: '0 0 8px',
  color: '#0f172a',
  fontSize: '21px',
  fontWeight: '800',
};

const projectDescriptionStyle = {
  margin: '0 0 16px',
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '1.6',
};

const projectButtonStyle = {
  padding: '12px 18px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '14px',
};
  

  // FEATURE 2: CUSTOMER MARKETPLACE VIEW
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


{/* MULTI-SERVICE PACKAGE BANNER */}
{!selectedCategory && (
  <div
    onClick={() => {
      setSelectedPackageCategories([]);
      setPackageStep(1);
      setIsPackagePageOpen(true);
    }}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      padding: '30px 32px',
      marginBottom: '32px',
      background: 'linear-gradient(115deg, #eff6ff 0%, #ffffff 75%, #dbeafe 100%)',
      border: '1px solid #dbeafe',
      borderRadius: '18px',
      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.06)',
      cursor: 'pointer'
    }}
  >
    <div style={{ flex: '1', minWidth: '230px' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '6px 10px',
          marginBottom: '14px',
          borderRadius: '6px',
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
          fontSize: '10px',
          fontWeight: '800',
          letterSpacing: '1px'
        }}
      >
        YOUR SERVICES, ONE BOOKING
      </div>

      <h2
        style={{
          margin: '0 0 10px',
          color: '#172554',
          fontSize: '26px',
          lineHeight: '1.25',
          fontWeight: '800',
          letterSpacing: '-0.7px'
        }}
      >
        Build Your Package
      </h2>

      <p
        style={{
          margin: 0,
          maxWidth: '430px',
          color: '#475569',
          fontSize: '14px',
          lineHeight: '1.7'
        }}
      >
        Need more than one service? Combine professionals
        for your project and manage everything in one booking.
      </p>
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '18px',
    color: '#334155',
    fontSize: '12px',
    fontWeight: '600'
  }}
>
  <span>✓ Multiple services</span>
  <span>✓ Choose your team</span>
</div>
     
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      

      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPackageCategories([]);
          setPackageStep(1);
          setIsPackagePageOpen(true);
        }}
        style={{
          padding: '14px 20px',
          borderRadius: '9px',
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 5px 12px rgba(37,99,235,0.20)'
        }}
      >
        Build Your Package →
      </button>
    </div>
  </div>
)}



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
          {/* POPULAR SERVICE PACKAGES */}
<div style={{ marginTop: '36px', marginBottom: '32px' }}>
  <div
    style={{
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '6px',
      backgroundColor: '#dbeafe',
      color: '#2563eb',
      fontSize: '11px',
      fontWeight: '800',
      letterSpacing: '1px',
      marginBottom: '12px',
    }}
  >
    POPULAR SERVICE PACKAGES
  </div>

  <h2 style={{
    fontSize: '30px',
    color: '#0f172a',
    margin: '0 0 8px',
    fontWeight: '800',
  }}>
    What do you need done?
  </h2>

  <p style={{
    color: '#64748b',
    fontSize: '16px',
    margin: '0 0 24px',
  }}>
    Choose a project and find the right professionals in one go.
  </p>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  }}>

    {/* RENOVATION */}
    <div style={projectCardStyle}>
      <div style={projectImageStyle}>🏠</div>
      <div style={projectContentStyle}>
        <h3 style={projectTitleStyle}>Renovate Your Home</h3>
        <p style={projectDescriptionStyle}>
          Plan repairs, painting, carpentry and electrical work together.
        </p>
        <button
          style={projectButtonStyle}
          onClick={() => {
            const matched = categories.filter(cat =>
              /carpenter|painter|electrician|plumb/i.test(cat)
            );
            setSelectedPackageCategories(matched);
            setPackageStep(1);
            setIsPackagePageOpen(true);
          }}
        >
          Build My Renovation Team →
        </button>
      </div>
    </div>

    {/* PHOTOSHOOT */}
    <div style={projectCardStyle}>
      <div style={projectImageStyle}>📸</div>
      <div style={projectContentStyle}>
        <h3 style={projectTitleStyle}>Book a Photoshoot</h3>
        <p style={projectDescriptionStyle}>
          Find a photographer and book your shoot.
        </p>
        <button
          style={projectButtonStyle}
          onClick={() => {
            const match = categories.find(cat =>
              /photograph/i.test(cat)
            );
            if (match) {
              setSelectedCategory(match);
              setSearchQuery('');
              setShowNewFreelancers(false);
            } else {
              alert('Photographer services are not available yet.');
            }
          }}
        >
          Book a Photoshoot →
        </button>
      </div>
    </div>

    {/* CLEANING */}
    <div style={projectCardStyle}>
      <div style={projectImageStyle}>🧹</div>
      <div style={projectContentStyle}>
        <h3 style={projectTitleStyle}>Deep Clean My Home</h3>
        <p style={projectDescriptionStyle}>
          Find cleaning professionals for your home.
        </p>
        <button
          style={projectButtonStyle}
          onClick={() => {
            const match = categories.find(cat =>
              /clean/i.test(cat)
            );
            if (match) {
              setSelectedCategory(match);
              setSearchQuery('');
              setShowNewFreelancers(false);
            } else {
              alert('Cleaning services are not available yet.');
            }
          }}
        >
          Book Cleaning →
        </button>
      </div>
    </div>

    {/* EVENT */}
    <div style={projectCardStyle}>
      <div style={projectImageStyle}>🎉</div>
      <div style={projectContentStyle}>
        <h3 style={projectTitleStyle}>Plan an Event</h3>
        <p style={projectDescriptionStyle}>
          Bring together the professionals you need for your event.
        </p>
        <button
          style={projectButtonStyle}
          onClick={() => {
            const matched = categories.filter(cat =>
              /photograph|makeup|beautician|cook|clean/i.test(cat)
            );
            setSelectedPackageCategories(matched);
            setPackageStep(1);
            setIsPackagePageOpen(true);
          }}
        >
          Plan My Event →
        </button>
      </div>
    </div>

    {/* CUSTOM PACKAGE */}
    <div style={{
      ...projectCardStyle,
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe',
    }}>
      <div style={projectImageStyle}>📋</div>
      <div style={projectContentStyle}>
        <h3 style={projectTitleStyle}>Have a Different Project in Mind?</h3>
        <p style={projectDescriptionStyle}>
          Create a custom package with multiple services for your needs.
        </p>
        <button
          style={projectButtonStyle}
          onClick={() => {
            setSelectedPackageCategories([]);
            setPackageStep(1);
            setIsPackagePageOpen(true);
          }}
        >
          Build a Custom Package →
        </button>
      </div>
    </div>

  </div>
</div>
        </div>
      ) : (

        /* VIEW 2: FREELANCERS LIST */
        <div>
          {selectedCategory && (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      padding: '18px 20px',
      marginBottom: '24px',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      background: 'linear-gradient(110deg, #eff6ff, #ffffff)',
    }}
  >
    <div style={{ flex: 1, minWidth: '220px' }}>
      <span style={{
        color: '#1d4ed8',
        fontSize: '11px',
        fontWeight: '800',
      }}>
        FIRST BOOKING OFFER
      </span>

      <h3 style={{ margin: '8px 0', color: '#172554' }}>
        Give a New Freelancer a Chance
      </h3>

      <p style={{ margin: 0, color: '#475569', fontSize: '13px' }}>
        Try an emerging {selectedCategory.toLowerCase()} and get
        15% off your first eligible booking.
      </p>

      <p style={{
        margin: '8px 0 0',
        color: '#1d4ed8',
        fontWeight: '700',
        fontSize: '12px',
      }}>
        Coupon: NEW2YOU15
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowNewFreelancers(prev => !prev)}
      style={{
        padding: '12px 16px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '7px',
        fontWeight: '700',
        cursor: 'pointer',
      }}
    >
      {showNewFreelancers
        ? 'Show All Freelancers'
        : 'Explore New Freelancers →'}
    </button>
  </div>
)}
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
                const isInCart = cartItems.some(item => item.worker_id === worker.worker_id);
                const portfolioCount = getPortfolioCount(worker);

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

                      {/* PORTFOLIO / PREVIOUS WORKS BUTTON WITH DATABASE COUNT */}
                      <button
                        onClick={() => setActivePortfolioWorker(worker)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#2563eb',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        📁 View Portfolio ({portfolioCount} Work Samples)
                      </button>
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

      {/* PORTFOLIO MODAL DIALOG */}
      {activePortfolioWorker && (() => {
        const count = getPortfolioCount(activePortfolioWorker);
        const icon = getCategoryIcon(activePortfolioWorker.category);

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{activePortfolioWorker.name}'s Portfolio</h3>
                  <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '13px' }}>{activePortfolioWorker.category} • 📍 {activePortfolioWorker.address}</p>
                </div>
                <button onClick={() => setActivePortfolioWorker(null)} style={{ border: 'none', background: 'transparent', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}>✕</button>
              </div>

              <div style={{ marginBottom: '16px', backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '13px', color: '#1e40af' }}>
                ✅ Verified Portfolio Record: <strong>{count} Previous Work Samples</strong> registered for this partner.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {Array.from({ length: count }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '130px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      boxSizing: 'border-box',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '32px', marginBottom: '6px' }}>{icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                      {activePortfolioWorker.category} Work #{idx + 1}
                    </span>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>
                      ✓ Quality Verified
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActivePortfolioWorker(null)}
                style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Close Portfolio
              </button>
            </div>
          </div>
        );
      })()}

      {/* SLIDE-OVER CART DRAWER (MARKETPLACE VIEW) */}
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
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
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
              {negotiationStatus === 'pending' && (
                <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span>⏳ Negotiation requested for ₹{negotiatedPrice} (Awaiting partner confirmation)</span>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    💬 Chat
                  </button>
                </div>
              )}

              {negotiationStatus === 'accepted' && (
                <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
                  🎉 Negotiated for ₹{negotiatedPrice}
                </div>
              )}
              

{/* BOOKING TYPE SELECTION */}
{cartItems.length > 0 && (
  <div style={{ marginTop: '20px', marginBottom: '20px' }}>
    <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>
      Choose Your Booking Type
    </h3>

    {/* Schedule Booking */}
    <div
      onClick={() => setBookingType('normal')}
      style={{
        padding: '12px',
        marginBottom: '10px',
        border: bookingType === 'normal'
          ? '2px solid #2563eb'
          : '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: bookingType === 'normal' ? '#eff6ff' : '#ffffff'
      }}
    >
      <strong style={{ color: '#0f172a' }}>Schedule Booking</strong>
      <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748b' }}>
        Choose your preferred date and time for the service.
      </p>
    </div>

    {/* Priority Booking */}
    <div
      onClick={() => setBookingType('priority')}
      style={{
        padding: '12px',
        border: bookingType === 'priority'
          ? '2px solid #2563eb'
          : '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: bookingType === 'priority' ? '#eff6ff' : '#ffffff'
      }}
    >
      <strong style={{ color: '#0f172a' }}>Priority Booking</strong>
      <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748b' }}>
        Request the service now without scheduling. An additional 10% priority fee applies.
      </p>
    </div>
  </div>
)}


  {bookingType === 'normal' && (            

<div
  style={{
    marginBottom: '18px',
    padding: '14px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
  }}
>
  <h3 style={{
    margin: '0 0 12px',
    fontSize: '16px',
    color: '#0f172a'
  }}>
    Schedule Your Service
  </h3>

  {/* Date Picker */}
  <label style={{
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#334155'
  }}>
    Select Date
  </label>

  <input
    type="date"
    value={bookingDate}
    min={new Date().getFullYear() + '-' +
      String(new Date().getMonth() + 1).padStart(2, '0') + '-' +
      String(new Date().getDate()).padStart(2, '0')}
    onChange={(e) => {
      setBookingDate(e.target.value);
      setBookingTime('');
    }}
    style={{
      width: '100%',
      padding: '10px',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      boxSizing: 'border-box',
      marginBottom: '16px',
      fontSize: '14px',
      backgroundColor: '#ffffff'
    }}
  />

  {/* Time Slot Selection */}
  <label style={{
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#334155'
  }}>
    Select Time Slot
  </label>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '8px'
  }}>
    {timeSlots.map((slot) => (
      <button
        key={slot}
        type="button"
        disabled={!bookingDate}
        onClick={() => setBookingTime(slot)}
        style={{
          padding: '10px 5px',
          borderRadius: '6px',
          border: bookingTime === slot
            ? '2px solid #2563eb'
            : '1px solid #cbd5e1',
          backgroundColor: bookingTime === slot
            ? '#dbeafe'
            : '#ffffff',
          color: bookingTime === slot
            ? '#1d4ed8'
            : '#334155',
          fontWeight: bookingTime === slot ? '700' : '500',
          fontSize: '12px',
          cursor: bookingDate ? 'pointer' : 'not-allowed',
          opacity: bookingDate ? 1 : 0.5
        }}
      >
        {slot}
      </button>
    ))}
  </div>

  {!bookingDate && (
    <p style={{
      fontSize: '12px',
      color: '#64748b',
      marginBottom: 0
    }}>
      Please select a date first to view time slots.
    </p>
  )}

  {bookingDate && bookingTime && (
    <p style={{
      fontSize: '13px',
      color: '#166534',
      backgroundColor: '#dcfce7',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: 0,
      marginTop: '12px'
    }}>
      Selected: {bookingDate} | {bookingTime}
    </p>
  )}
</div>
          )}

{/* PRIORITY PRICE BREAKDOWN */}
{(() => {
  
const basePrice = Number(
  negotiationStatus === 'accepted'
    ? negotiatedPrice
    : calculateTotal()
) || 0;

const priorityFee =
  bookingType === 'priority'
    ? Math.round(basePrice * 0.10 * 100) / 100
    : 0;

const finalTotal = basePrice + priorityFee;


  return (
    <div style={{
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '12px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '14px'
      }}>
        <span style={{ color: '#64748b' }}>Service total</span>
        <span>₹{basePrice.toFixed(2)}</span>
      </div>

      {bookingType === 'priority' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          fontSize: '14px',
          color: '#b45309'
        }}>
          <span>Priority booking fee (10%)</span>
          <span>₹{priorityFee.toFixed(2)}</span>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0',
        fontSize: '16px',
        fontWeight: '800',
        color: '#172554'
      }}>
        <span>Total payable</span>
        <span>₹{finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
})()}


<div style={{ display: 'flex', gap: '10px' }}>
  <button
   disabled={
  bookingType === 'normal' &&
  (!bookingDate || !bookingTime)
}
    
onClick={() => {
  const basePrice = Number(
    negotiationStatus === 'accepted'
      ? negotiatedPrice
      : calculateTotal()
  ) || 0;

  const priorityFee =
    bookingType === 'priority'
      ? Math.round(
          basePrice * PRIORITY_BOOKING_RATE * 100
        ) / 100
      : 0;

  const finalTotal = basePrice + priorityFee;


alert(
  `Booking Confirmed!\n` +
  `Booking Type: ${bookingType === 'priority' ? 'Priority Booking' : 'Schedule Booking'}\n` +
  (bookingType === 'normal'
    ? `Date: ${bookingDate}\nTime: ${bookingTime}\n`
    : 'Booking: Immediate priority request\n') +
  `Service Total: ₹${basePrice.toFixed(2)}\n` +
  (bookingType === 'priority'
    ? `Priority Booking Fee: ₹${priorityFee.toFixed(2)}\n`
    : '') +
  `Total Payable: ₹${finalTotal.toFixed(2)}\n` +
  `Service providers notified.`
);

  setCartItems([]);
  setBookingDate('');
  setBookingTime('');
  setBookingType('normal');
  setIsCartOpen(false);
}}

style={{
  flex: 1,
  padding: '12px 8px',
  backgroundColor:
    bookingType === 'normal' && (!bookingDate || !bookingTime)
      ? '#94a3b8'
      : '#16a34a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor:
    bookingType === 'normal' && (!bookingDate || !bookingTime)
      ? 'not-allowed'
      : 'pointer',
  opacity:
    bookingType === 'normal' && (!bookingDate || !bookingTime)
      ? 0.7
      : 1
}}

  >
    Confirm Booking
  </button>

  <button
    onClick={() => {
      const proposedPrice = prompt(
        `The current total is ₹${calculateTotal()}. Enter your proposed price (₹):`,
        calculateTotal()
      );

      if (proposedPrice && !isNaN(proposedPrice)) {
        setNegotiatedPrice(proposedPrice);
        setNegotiationStatus('pending');
      }
    }}
    style={{
      flex: 1,
      padding: '12px 8px',
      backgroundColor: '#eab308',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '14px',
      cursor: 'pointer'
    }}
  >
    Negotiate Price
  </button>
</div>

            </div>
          )}
        </div>
      )}

      {/* CHAT POPUP DRAWER (MARKETPLACE VIEW) */}
      {isChatOpen && (
        <div style={{ position: 'fixed', bottom: '20px', right: '400px', width: '320px', height: '420px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 1100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#2563eb', color: '#ffffff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>💬 Chat with Service Provider</span>
            <button onClick={() => setIsChatOpen(false)} style={{ border: 'none', background: 'transparent', color: '#ffffff', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc' }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'customer' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'customer' ? '#2563eb' : '#ffffff',
                  color: msg.sender === 'customer' ? '#ffffff' : '#0f172a',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  maxWidth: '80%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: msg.sender === 'customer' ? 'none' : '1px solid #e2e8f0'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#e2e8f0', color: '#64748b', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic' }}>
                typing response...
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
