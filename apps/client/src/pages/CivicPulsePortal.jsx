import React, { useState, useEffect, useRef } from 'react';

// ==================== GLOBAL CONSTANTS ====================
const COLORS = {
  navy: '#003580',
  saffron: '#FF6B00',
  green: '#138808',
  gold: '#C8941E',
  cream: '#FFF8E7',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#555555',
};

const CATEGORIES = [
  { id: 'roads', label: 'Roads', emoji: '🛣️' },
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'electricity', label: 'Electricity', emoji: '⚡' },
  { id: 'garbage', label: 'Garbage', emoji: '🗑️' },
  { id: 'drainage', label: 'Drainage', emoji: '🌊' },
  { id: 'lighting', label: 'Lighting', emoji: '💡' },
  { id: 'property', label: 'Property', emoji: '🏘️' },
  { id: 'other', label: 'Other', emoji: '📋' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#FF9800', emoji: '⏳' },
  inProgress: { label: 'In Progress', color: '#2196F3', emoji: '🔄' },
  resolved: { label: 'Resolved', color: '#4CAF50', emoji: '✅' },
  rejected: { label: 'Rejected', color: '#F44336', emoji: '❌' },
};

const SEED_COMPLAINTS = [
  {
    id: 'CP-2024-10001',
    name: 'Rajesh Kumar Sharma',
    aadhaar: '3456 7890 1234',
    mobile: '9876543210',
    email: 'rajesh.sharma@gmail.com',
    category: 'roads',
    subject: 'Large pothole on MG Road causing accidents',
    ward: 'Ward 12, Zone 3',
    description: 'There is a very large pothole near the bus stop on MG Road that has caused multiple two-wheeler accidents in the past week. It needs immediate attention as it poses serious risk to commuters.',
    images: [],
    address: 'Near Bus Stop, MG Road',
    city: 'Mumbai',
    gps: { lat: 19.0760, lng: 72.8777, label: 'MG Road, Mumbai' },
    status: 'inProgress',
    date: '2024-02-20',
  },
  {
    id: 'CP-2024-10002',
    name: 'Priya Deshmukh',
    aadhaar: '5678 9012 3456',
    mobile: '9823456789',
    email: 'priya.d@yahoo.com',
    category: 'water',
    subject: 'No water supply for 3 days in our locality',
    ward: 'Ward 8, Zone 1',
    description: 'Our entire locality has been without water supply for the last three days. We have complained multiple times to the ward office but no action has been taken. Please restore water supply urgently.',
    images: [],
    address: 'Shivaji Nagar, Plot 45',
    city: 'Pune',
    gps: { lat: 18.5204, lng: 73.8567, label: 'Shivaji Nagar, Pune' },
    status: 'pending',
    date: '2024-02-22',
  },
  {
    id: 'CP-2024-10003',
    name: 'Mohammed Salim Khan',
    aadhaar: '7890 1234 5678',
    mobile: '9910234567',
    email: '',
    category: 'electricity',
    subject: 'Frequent power cuts during evening hours',
    ward: 'Ward 5, Zone 2',
    description: 'For the past two weeks, there have been daily power cuts between 6 PM to 9 PM lasting 2-3 hours each. This is causing major inconvenience especially for students preparing for exams.',
    images: [],
    address: 'Jawahar Colony, Street 7',
    city: 'Delhi',
    gps: { lat: 28.6139, lng: 77.2090, label: 'Jawahar Colony, Delhi' },
    status: 'resolved',
    date: '2024-02-18',
  },
  {
    id: 'CP-2024-10004',
    name: 'Lakshmi Venkatesh',
    aadhaar: '9012 3456 7890',
    mobile: '9845678901',
    email: 'lakshmi.v@outlook.com',
    category: 'garbage',
    subject: 'Garbage not collected for over a week',
    ward: 'Ward 15, Zone 4',
    description: 'The municipal garbage collection has not happened in our street for more than a week now. The accumulated garbage is creating foul smell and attracting stray animals. Urgent action needed.',
    images: [],
    address: 'HSR Layout, 6th Sector',
    city: 'Bangalore',
    gps: { lat: 12.9716, lng: 77.5946, label: 'HSR Layout, Bangalore' },
    status: 'inProgress',
    date: '2024-02-21',
  },
  {
    id: 'CP-2024-10005',
    name: 'Amit Patel',
    aadhaar: '2345 6789 0123',
    mobile: '9824567890',
    email: 'amit.patel88@gmail.com',
    category: 'lighting',
    subject: 'Street lights not working in our area',
    ward: 'Ward 10, Zone 2',
    description: 'All the street lights in our colony have been non-functional for the past month. This has led to safety concerns especially for women and elderly people walking at night.',
    images: [],
    address: 'Satellite Area, Road 9',
    city: 'Ahmedabad',
    gps: { lat: 23.0225, lng: 72.5714, label: 'Satellite, Ahmedabad' },
    status: 'resolved',
    date: '2024-02-15',
  },
  {
    id: 'CP-2024-10006',
    name: 'Sunita Devi',
    aadhaar: '4567 8901 2345',
    mobile: '9934567890',
    email: '',
    category: 'drainage',
    subject: 'Drainage blockage causing waterlogging',
    ward: 'Ward 3, Zone 1',
    description: 'The main drainage in our area is completely blocked causing severe waterlogging even with little rain. The stagnant water is breeding mosquitoes and causing health issues.',
    images: [],
    address: 'Gandhi Nagar, Main Road',
    city: 'Patna',
    gps: { lat: 25.5941, lng: 85.1376, label: 'Gandhi Nagar, Patna' },
    status: 'pending',
    date: '2024-02-23',
  },
  {
    id: 'CP-2024-10007',
    name: 'Karthik Reddy',
    aadhaar: '6789 0123 4567',
    mobile: '9866789012',
    email: 'karthik.reddy@rediffmail.com',
    category: 'property',
    subject: 'Illegal construction in neighboring plot',
    ward: 'Ward 18, Zone 5',
    description: 'My neighbor has started illegal construction beyond the approved plan and it is blocking sunlight and ventilation to my property. Despite complaints to local authorities, no action has been taken.',
    images: [],
    address: 'Jubilee Hills, Plot 234',
    city: 'Hyderabad',
    gps: { lat: 17.3850, lng: 78.4867, label: 'Jubilee Hills, Hyderabad' },
    status: 'rejected',
    date: '2024-02-19',
  },
];

// ==================== MAIN COMPONENT ====================
export default function CivicPulsePortal() {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'track'
  const [complaints, setComplaints] = useState(SEED_COMPLAINTS);
  const [toasts, setToasts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    avgResponse: 0,
    satisfaction: 0,
  });

  // Inject styles and fonts
  useEffect(() => {
    const styleId = 'civic-pulse-styles';
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@400;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap');
        
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  // Calculate stats
  useEffect(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const avgResponse = total > 0 ? Math.floor(48 + Math.random() * 24) : 0; // hours
    const satisfaction = total > 0 ? (85 + Math.random() * 10).toFixed(1) : 0;
    
    setStats({ total, resolved, avgResponse, satisfaction });
  }, [complaints]);

  const addToast = (message, type = 'success') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  };

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: `CP-2024-${10000 + complaints.length + 1}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setComplaints(prev => [newComplaint, ...prev]);
    addToast(`Complaint registered successfully! ID: ${newComplaint.id}`, 'success');
    return newComplaint.id;
  };

  return (
    <div style={{ 
      fontFamily: "'Noto Sans', sans-serif", 
      minHeight: '100vh', 
      background: COLORS.lightGray 
    }}>
      {/* Government Banner */}
      <div style={{
        background: COLORS.navy,
        color: COLORS.white,
        padding: '8px 20px',
        fontSize: '14px',
        textAlign: 'center',
        borderBottom: `3px solid ${COLORS.saffron}`,
      }}>
        भारत सरकार | Government of India
      </div>

      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: COLORS.white,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        {/* Tricolor Strip */}
        <div style={{ display: 'flex', height: '4px' }}>
          <div style={{ flex: 1, background: COLORS.saffron }} />
          <div style={{ flex: 1, background: COLORS.white }} />
          <div style={{ flex: 1, background: COLORS.green }} />
        </div>

        {/* Header Content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '15px 40px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: '40px',
            animation: 'slowSpin 20s linear infinite',
          }}>
            ☸
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontFamily: "'Noto Serif Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              color: COLORS.navy,
              margin: 0,
              lineHeight: 1.2,
            }}>
              CivicPulse | नागरिक शिकायत पोर्टल
            </h1>
            <p style={{
              fontSize: '13px',
              color: COLORS.darkGray,
              margin: '4px 0 0 0',
            }}>
              Empowering Citizens, Ensuring Accountability
            </p>
          </div>

          {/* Nav Tabs */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                padding: '10px 24px',
                border: 'none',
                background: activeTab === 'register' ? COLORS.navy : 'transparent',
                color: activeTab === 'register' ? COLORS.white : COLORS.navy,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.3s',
              }}
            >
              📝 File Complaint
            </button>
            <button
              onClick={() => setActiveTab('track')}
              style={{
                padding: '10px 24px',
                border: 'none',
                background: activeTab === 'track' ? COLORS.navy : 'transparent',
                color: activeTab === 'track' ? COLORS.white : COLORS.navy,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.3s',
              }}
            >
              🔍 Track Complaint
            </button>
          </div>
        </div>
      </div>

      {/* Hero Band */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #004d9f 100%)`,
        color: COLORS.white,
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          fontSize: '80px',
          opacity: 0.1,
          animation: 'slowSpin 30s linear infinite',
        }}>
          ☸
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: "'Noto Serif Display', serif",
            fontSize: '36px',
            fontWeight: 600,
            margin: '0 0 10px 0',
          }}>
            Your Voice Matters
          </h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: '0 0 30px 0',
          }}>
            Report civic issues and track their resolution in real-time
          </p>

          {/* Live Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            <StatCard icon="📊" label="Complaints Filed" value={stats.total} />
            <StatCard icon="✅" label="Resolved" value={stats.resolved} />
            <StatCard icon="⏱️" label="Avg Response" value={`${stats.avgResponse}h`} />
            <StatCard icon="⭐" label="Satisfaction" value={`${stats.satisfaction}%`} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        animation: 'fadeUp 0.5s ease-out',
      }}>
        {activeTab === 'register' ? (
          <RegisterPanel addComplaint={addComplaint} addToast={addToast} />
        ) : (
          <SearchPanel complaints={complaints} addToast={addToast} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: COLORS.navy,
        color: COLORS.white,
        padding: '30px 20px',
        marginTop: '60px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 10px 0' }}>
            📞 24/7 Helpline: 1800-XXX-XXXX
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            fontSize: '13px',
            opacity: 0.8,
          }}>
            <a href="#" style={{ color: COLORS.white, textDecoration: 'none' }}>Privacy Policy</a>
            <span>|</span>
            <a href="#" style={{ color: COLORS.white, textDecoration: 'none' }}>Terms of Service</a>
            <span>|</span>
            <a href="#" style={{ color: COLORS.white, textDecoration: 'none' }}>Contact Us</a>
          </div>
          <p style={{ fontSize: '12px', marginTop: '15px', opacity: 0.7 }}>
            © 2024 CivicPulse Portal - Government of India. All rights reserved.
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
}

// ==================== STAT CARD ====================
function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'popIn 0.5s ease-out',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', opacity: 0.9 }}>{label}</div>
    </div>
  );
}

// ==================== REGISTER PANEL ====================
function RegisterPanel({ addComplaint, addToast }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    mobile: '',
    email: '',
    category: '',
    subject: '',
    ward: '',
    description: '',
    images: [],
    address: '',
    city: '',
    gps: null,
    consent1: false,
    consent2: false,
    consent3: false,
  });

  const [errors, setErrors] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsPermissionDenied, setGpsPermissionDenied] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < numbers.length; i += 4) {
      parts.push(numbers.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (value) => {
    handleChange('aadhaar', formatAadhaar(value));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        addToast(`${f.name} exceeds 10MB limit`, 'error');
        return false;
      }
      return true;
    });

    if (formData.images.length + validFiles.length > 5) {
      addToast('Maximum 5 images allowed', 'error');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: e.target.result, name: file.name, size: file.size }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const fetchGPS = () => {
    setGpsLoading(true);
    setGpsPermissionDenied(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            gps: {
              lat: latitude.toFixed(4),
              lng: longitude.toFixed(4),
              label: `Location captured`,
            }
          }));
          setGpsLoading(false);
          setGpsPermissionDenied(false);
          addToast('Location captured successfully', 'success');
        },
        (error) => {
          setGpsLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsPermissionDenied(true);
          } else {
            addToast('Unable to fetch location. Please try again.', 'error');
          }
        }
      );
    } else {
      setGpsLoading(false);
      addToast('Geolocation not supported', 'error');
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.aadhaar.replace(/\s/g, '').length !== 12) newErrors.aadhaar = 'Valid 12-digit Aadhaar required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.ward.trim()) newErrors.ward = 'Ward/Area is required';
    if (formData.description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.consent1 || !formData.consent2 || !formData.consent3) {
      newErrors.consent = 'All declarations must be accepted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      addToast('Please fix all errors before submitting', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const id = addComplaint(formData);
      setSubmittedId(id);
      setStep(4);
      setLoading(false);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          name: '',
          aadhaar: '',
          mobile: '',
          email: '',
          category: '',
          subject: '',
          ward: '',
          description: '',
          images: [],
          address: '',
          city: '',
          gps: null,
          consent1: false,
          consent2: false,
          consent3: false,
        });
        setStep(0);
        setSubmittedId(null);
      }, 5000);
    }, 2000);
  };

  if (submittedId) {
    return (
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '60px 40px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        animation: 'popIn 0.5s ease-out',
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          animation: 'bounce 1s ease-in-out infinite',
        }}>
          ✅
        </div>
        <h2 style={{
          fontFamily: "'Noto Serif Display', serif",
          fontSize: '32px',
          color: COLORS.green,
          margin: '0 0 10px 0',
        }}>
          Complaint Registered Successfully!
        </h2>
        <p style={{ fontSize: '16px', color: COLORS.darkGray, marginBottom: '20px' }}>
          Your complaint has been recorded and assigned a unique ID
        </p>
        <div style={{
          background: COLORS.cream,
          border: `2px dashed ${COLORS.gold}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'inline-block',
        }}>
          <p style={{ fontSize: '14px', color: COLORS.darkGray, margin: '0 0 8px 0' }}>
            Complaint ID
          </p>
          <p style={{
            fontFamily: "'Noto Serif Display', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: COLORS.navy,
            margin: 0,
          }}>
            {submittedId}
          </p>
        </div>
        <p style={{ fontSize: '14px', color: COLORS.darkGray, marginBottom: '30px' }}>
          Please save this ID for tracking your complaint
        </p>
        <button
          onClick={() => {
            setFormData({
              name: '',
              aadhaar: '',
              mobile: '',
              email: '',
              category: '',
              subject: '',
              ward: '',
              description: '',
              images: [],
              address: '',
              city: '',
              gps: null,
              consent1: false,
              consent2: false,
              consent3: false,
            });
            setStep(0);
            setSubmittedId(null);
          }}
          style={{
            background: `linear-gradient(135deg, ${COLORS.navy} 0%, #004d9f 100%)`,
            color: COLORS.white,
            border: 'none',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Track This Complaint →
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{
        fontFamily: "'Noto Serif Display', serif",
        fontSize: '28px',
        color: COLORS.navy,
        margin: '0 0 10px 0',
      }}>
        Register New Complaint
      </h2>
      <p style={{ color: COLORS.darkGray, marginBottom: '30px' }}>
        Fill in the details to register your civic grievance
      </p>

      <StepsBar currentStep={step} />

      <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
        {/* Personal Information */}
        <SectionLabel>Personal Information</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <FieldLabel required>Full Name</FieldLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </div>
          <div>
            <FieldLabel required>🪪 Aadhaar Number</FieldLabel>
            <Input
              value={formData.aadhaar}
              onChange={(e) => handleAadhaarChange(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              maxLength={14}
            />
            {errors.aadhaar && <FieldError>{errors.aadhaar}</FieldError>}
          </div>
          <div>
            <FieldLabel required>Mobile Number</FieldLabel>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: COLORS.cream,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '13px',
                color: COLORS.darkGray,
                fontWeight: 600,
              }}>
                +91
              </span>
              <Input
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                style={{ paddingLeft: '60px' }}
              />
            </div>
            {errors.mobile && <FieldError>{errors.mobile}</FieldError>}
          </div>
          <div>
            <FieldLabel>Email (Optional)</FieldLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Complaint Details */}
        <SectionLabel>Complaint Details</SectionLabel>
        <div style={{ marginBottom: '30px' }}>
          <FieldLabel required>Category</FieldLabel>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '10px',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleChange('category', cat.id)}
                style={{
                  padding: '16px 12px',
                  border: `2px solid ${formData.category === cat.id ? COLORS.saffron : COLORS.mediumGray}`,
                  background: formData.category === cat.id ? `${COLORS.saffron}15` : COLORS.white,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  fontSize: '14px',
                  fontWeight: formData.category === cat.id ? 600 : 400,
                }}
                onMouseOver={(e) => {
                  if (formData.category !== cat.id) {
                    e.target.style.borderColor = COLORS.saffron;
                    e.target.style.background = `${COLORS.saffron}08`;
                  }
                }}
                onMouseOut={(e) => {
                  if (formData.category !== cat.id) {
                    e.target.style.borderColor = COLORS.mediumGray;
                    e.target.style.background = COLORS.white;
                  }
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{cat.emoji}</div>
                <div>{cat.label}</div>
              </button>
            ))}
          </div>
          {errors.category && <FieldError>{errors.category}</FieldError>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <FieldLabel required>Complaint Subject</FieldLabel>
            <Input
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Brief subject of your complaint"
            />
            {errors.subject && <FieldError>{errors.subject}</FieldError>}
          </div>
          <div>
            <FieldLabel required>Ward / Area</FieldLabel>
            <Input
              value={formData.ward}
              onChange={(e) => handleChange('ward', e.target.value)}
              placeholder="e.g., Ward 12, Zone 3"
            />
            {errors.ward && <FieldError>{errors.ward}</FieldError>}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <FieldLabel required>Detailed Description</FieldLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Provide detailed description of your complaint (minimum 30 characters)"
            rows={5}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            marginTop: '6px',
          }}>
            <span style={{ color: formData.description.length < 30 ? COLORS.saffron : COLORS.green }}>
              {formData.description.length} / 30 minimum
            </span>
            {errors.description && <FieldError>{errors.description}</FieldError>}
          </div>
        </div>

        {/* Evidence & Media */}
        <SectionLabel>Evidence & Media (Optional)</SectionLabel>
        <div style={{ marginBottom: '30px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${COLORS.mediumGray}`,
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: COLORS.lightGray,
              transition: 'all 0.3s',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = COLORS.saffron;
              e.currentTarget.style.background = `${COLORS.saffron}10`;
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.mediumGray;
              e.currentTarget.style.background = COLORS.lightGray;
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = COLORS.mediumGray;
              e.currentTarget.style.background = COLORS.lightGray;
              const files = Array.from(e.dataTransfer.files);
              handleImageUpload({ target: { files } });
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
            <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0' }}>
              Upload Images
            </p>
            <p style={{ fontSize: '13px', color: COLORS.darkGray, margin: 0 }}>
              Drag & drop or click to select (Max 5 images, 10MB each)
            </p>
          </div>

          {formData.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px',
              marginTop: '20px',
            }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: `2px solid ${COLORS.mediumGray}`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: COLORS.saffron,
                      color: COLORS.white,
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    background: 'rgba(0,0,0,0.7)',
                    color: COLORS.white,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                  }}>
                    {(img.size / 1024).toFixed(0)}KB
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Details */}
        <SectionLabel>Location Details</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <FieldLabel required>Full Address</FieldLabel>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Street, locality"
            />
            {errors.address && <FieldError>{errors.address}</FieldError>}
          </div>
          <div>
            <FieldLabel required>City / District</FieldLabel>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Your city"
            />
            {errors.city && <FieldError>{errors.city}</FieldError>}
          </div>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.white} 100%)`,
          border: `2px solid ${COLORS.gold}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
        }}>
          <h4 style={{
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: 600,
            color: COLORS.navy,
          }}>
            📍 GPS Location Capture
          </h4>
          <button
            type="button"
            onClick={fetchGPS}
            disabled={gpsLoading}
            style={{
              background: COLORS.green,
              color: COLORS.white,
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: gpsLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              opacity: gpsLoading ? 0.6 : 1,
            }}
          >
            {gpsLoading ? '⏳ Fetching...' : '📡 Fetch My Location'}
          </button>

          {gpsPermissionDenied && (
            <div style={{
              marginTop: '15px',
              background: `${COLORS.saffron}15`,
              border: `2px solid ${COLORS.saffron}`,
              borderRadius: '8px',
              padding: '15px',
            }}>
              <p style={{
                fontSize: '14px',
                color: COLORS.saffron,
                fontWeight: 600,
                margin: '0 0 8px 0',
              }}>
                ⚠️ Location Access Blocked
              </p>
              <p style={{
                fontSize: '13px',
                color: COLORS.darkGray,
                margin: '0 0 12px 0',
                lineHeight: 1.5,
              }}>
                Please allow location access in your browser settings and click the button above again to fetch your GPS coordinates.
              </p>
              <p style={{
                fontSize: '12px',
                color: COLORS.darkGray,
                margin: 0,
                opacity: 0.8,
              }}>
                💡 Look for the location icon <span style={{ fontWeight: 600 }}>🔒</span> in your browser's address bar
              </p>
            </div>
          )}

          {formData.gps && (
            <div style={{
              marginTop: '20px',
              background: COLORS.white,
              borderRadius: '10px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '80px',
                opacity: 0.1,
              }}>
                🗺️
              </div>
              <div style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '40px',
                  animation: 'bounce 2s ease-in-out infinite',
                  marginBottom: '10px',
                }}>
                  📍
                </div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: COLORS.green,
                  margin: '0 0 8px 0',
                }}>
                  {formData.gps.label}
                </p>
                <div style={{
                  display: 'inline-block',
                  background: COLORS.navy,
                  color: COLORS.white,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}>
                  {formData.gps.lat}, {formData.gps.lng}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Declaration & Consent */}
        <SectionLabel>Declaration & Consent</SectionLabel>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navy}10 0%, ${COLORS.white} 100%)`,
          border: `2px solid ${COLORS.navy}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={formData.consent1}
              onChange={(e) => handleChange('consent1', e.target.checked)}
              style={{
                marginTop: '2px',
                cursor: 'pointer',
                width: '18px',
                height: '18px',
              }}
            />
            <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
              I declare that all information provided is accurate and true to the best of my knowledge
            </span>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={formData.consent2}
              onChange={(e) => handleChange('consent2', e.target.checked)}
              style={{
                marginTop: '2px',
                cursor: 'pointer',
                width: '18px',
                height: '18px',
              }}
            />
            <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
              I consent to the collection and processing of my data as per the privacy policy
            </span>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={formData.consent3}
              onChange={(e) => handleChange('consent3', e.target.checked)}
              style={{
                marginTop: '2px',
                cursor: 'pointer',
                width: '18px',
                height: '18px',
              }}
            />
            <span style={{ fontSize: '14px', lineHeight: 1.6 }}>
              I confirm that this is not a duplicate complaint and no similar complaint has been filed previously
            </span>
          </label>

          {errors.consent && <FieldError style={{ marginTop: '12px' }}>{errors.consent}</FieldError>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? COLORS.mediumGray : `linear-gradient(135deg, ${COLORS.navy} 0%, #004d9f 100%)`,
            color: COLORS.white,
            border: 'none',
            padding: '18px',
            fontSize: '18px',
            fontWeight: 700,
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
          onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              Processing...
            </>
          ) : (
            <>
              📝 Submit Complaint
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ==================== SEARCH PANEL ====================
function SearchPanel({ complaints, addToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aadhaar.includes(searchQuery) ||
      c.mobile.includes(searchQuery) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{
        fontFamily: "'Noto Serif Display', serif",
        fontSize: '28px',
        color: COLORS.navy,
        margin: '0 0 10px 0',
      }}>
        Track & Search Complaints
      </h2>
      <p style={{ color: COLORS.darkGray, marginBottom: '30px' }}>
        Search by ID, name, Aadhaar, phone, category, city, or ward
      </p>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <span style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '20px',
        }}>
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search complaints..."
          style={{
            width: '100%',
            padding: '16px 16px 16px 52px',
            border: `2px solid ${COLORS.mediumGray}`,
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.navy;
            e.target.style.boxShadow = `0 0 0 3px ${COLORS.navy}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.mediumGray;
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
      }}>
        {[
          { id: 'all', label: 'All', emoji: '📋' },
          { id: 'pending', label: 'Pending', emoji: '⏳' },
          { id: 'inProgress', label: 'In Progress', emoji: '🔄' },
          { id: 'resolved', label: 'Resolved', emoji: '✅' },
          { id: 'rejected', label: 'Rejected', emoji: '❌' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            style={{
              padding: '10px 20px',
              border: `2px solid ${filterStatus === filter.id ? COLORS.navy : COLORS.mediumGray}`,
              background: filterStatus === filter.id ? `${COLORS.navy}15` : COLORS.white,
              color: filterStatus === filter.id ? COLORS.navy : COLORS.darkGray,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filterStatus === filter.id ? 600 : 400,
              transition: 'all 0.3s',
            }}
          >
            {filter.emoji} {filter.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredComplaints.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: COLORS.darkGray,
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.3 }}>🔎</div>
          <p style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>
            No complaints found
          </p>
          <p style={{ fontSize: '14px', margin: 0 }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div style={{
            overflowX: 'auto',
            marginBottom: '20px',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{
                  background: COLORS.lightGray,
                  borderBottom: `2px solid ${COLORS.mediumGray}`,
                }}>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Applicant</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Subject</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '14px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint, idx) => (
                  <tr
                    key={complaint.id}
                    style={{
                      background: idx % 2 === 0 ? COLORS.white : COLORS.lightGray,
                      borderBottom: `1px solid ${COLORS.mediumGray}`,
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = `${COLORS.saffron}10`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = idx % 2 === 0 ? COLORS.white : COLORS.lightGray;
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        fontFamily: "'Noto Serif Display', serif",
                        fontWeight: 700,
                        color: COLORS.navy,
                        fontSize: '14px',
                      }}>
                        {complaint.id}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{complaint.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.darkGray }}>{complaint.mobile}</div>
                    </td>
                    <td style={{ padding: '14px', fontSize: '14px' }}>
                      {CATEGORIES.find(c => c.id === complaint.category)?.emoji}{' '}
                      {CATEGORIES.find(c => c.id === complaint.category)?.label}
                    </td>
                    <td style={{ padding: '14px', fontSize: '13px', maxWidth: '200px' }}>
                      {complaint.subject.substring(0, 40)}{complaint.subject.length > 40 ? '...' : ''}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td style={{ padding: '14px', fontSize: '13px', color: COLORS.darkGray }}>
                      {complaint.date}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        style={{
                          background: COLORS.navy,
                          color: COLORS.white,
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            background: COLORS.lightGray,
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: COLORS.darkGray,
          }}>
            Showing {filteredComplaints.length} result{filteredComplaints.length !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <DetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

// ==================== DETAIL MODAL ====================
function DetailModal({ complaint, onClose }) {
  const category = CATEGORIES.find(c => c.id === complaint.category);

  const timeline = [
    { label: 'Complaint Submitted', status: 'done', date: complaint.date },
    { label: 'AI Validation Complete', status: 'done', date: complaint.date },
  ];

  if (complaint.status !== 'pending') {
    timeline.push({ label: 'Field Worker Assigned', status: 'done', date: complaint.date });
  }

  if (complaint.status === 'resolved') {
    timeline.push({ label: 'Issue Resolved', status: 'done', date: complaint.date });
  } else if (complaint.status === 'rejected') {
    timeline.push({ label: 'Complaint Rejected', status: 'done', date: complaint.date });
  } else if (complaint.status === 'inProgress') {
    timeline.push({ label: 'Work In Progress', status: 'active', date: 'Ongoing' });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px',
        animation: 'fadeUp 0.3s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.white,
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'popIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          background: COLORS.navy,
          color: COLORS.white,
          padding: '24px 30px',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Noto Serif Display', serif",
              fontSize: '24px',
              margin: '0 0 6px 0',
            }}>
              {complaint.id}
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
              Filed on {complaint.date}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: COLORS.white,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.darkGray,
              marginBottom: '8px',
            }}>
              Complaint Description
            </div>
            <div style={{
              background: COLORS.cream,
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: 1.7,
              border: `1px solid ${COLORS.mediumGray}`,
            }}>
              {complaint.description}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: `2px solid ${COLORS.mediumGray}` }}>
            <h4 style={{
              fontFamily: "'Noto Serif Display', serif",
              fontSize: '20px',
              color: COLORS.navy,
              marginBottom: '24px',
            }}>
              Activity Timeline
            </h4>
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              {timeline.map((item, idx) => (
                <div key={idx} style={{ position: 'relative', paddingBottom: '30px' }}>
                  {idx < timeline.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '-22px',
                      top: '12px',
                      width: '2px',
                      height: '100%',
                      background: item.status === 'done' ? COLORS.green : COLORS.mediumGray,
                    }} />
                  )}
                  <div style={{
                    position: 'absolute',
                    left: '-30px',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: item.status === 'done' ? COLORS.green : item.status === 'active' ? COLORS.saffron : COLORS.mediumGray,
                    border: `3px solid ${COLORS.white}`,
                    boxShadow: '0 0 0 2px currentColor',
                    color: item.status === 'done' ? COLORS.green : item.status === 'active' ? COLORS.saffron : COLORS.mediumGray,
                  }} />
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: item.status === 'done' ? COLORS.navy : COLORS.darkGray,
                      marginBottom: '4px',
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.darkGray }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      padding: '14px 0',
      borderBottom: `1px dashed ${COLORS.mediumGray}`,
    }}>
      <div style={{
        fontSize: '13px',
        fontWeight: 600,
        color: COLORS.darkGray,
        width: '200px',
        flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: COLORS.navy, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

// ==================== REUSABLE COMPONENTS ====================
function FieldLabel({ children, required }) {
  return (
    <label style={{
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: COLORS.darkGray,
      marginBottom: '8px',
    }}>
      {children}
      {required && <span style={{ color: COLORS.saffron, marginLeft: '4px' }}>*</span>}
    </label>
  );
}

function FieldError({ children, style }) {
  return (
    <div style={{
      fontSize: '12px',
      color: COLORS.saffron,
      marginTop: '6px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Input({ style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${focused ? COLORS.navy : COLORS.mediumGray}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s',
        boxShadow: focused ? `0 0 0 3px ${COLORS.navy}20` : 'none',
        ...style,
      }}
    />
  );
}

function Select({ children, style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <select
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${focused ? COLORS.navy : COLORS.mediumGray}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s',
        boxShadow: focused ? `0 0 0 3px ${COLORS.navy}20` : 'none',
        cursor: 'pointer',
        background: COLORS.white,
        ...style,
      }}
    >
      {children}
    </select>
  );
}

function Textarea({ style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <textarea
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${focused ? COLORS.navy : COLORS.mediumGray}`,
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s',
        boxShadow: focused ? `0 0 0 3px ${COLORS.navy}20` : 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        ...style,
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: `2px solid ${COLORS.mediumGray}`,
    }}>
      <div style={{
        width: '4px',
        height: '24px',
        background: COLORS.saffron,
        borderRadius: '2px',
      }} />
      <h3 style={{
        fontFamily: "'Noto Serif Display', serif",
        fontSize: '20px',
        fontWeight: 600,
        color: COLORS.navy,
        margin: 0,
      }}>
        {children}
      </h3>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '6px 12px',
      background: `${config.color}20`,
      color: config.color,
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
    }}>
      {config.emoji} {config.label}
    </span>
  );
}

function StepsBar({ currentStep }) {
  const steps = ['Personal', 'Complaint', 'Evidence', 'Location'];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      background: COLORS.lightGray,
      borderRadius: '12px',
    }}>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: idx <= currentStep ? COLORS.green : COLORS.mediumGray,
              color: COLORS.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '16px',
            }}>
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: idx <= currentStep ? COLORS.navy : COLORS.darkGray,
            }}>
              {step}
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: '2px',
              background: idx < currentStep ? COLORS.green : COLORS.mediumGray,
              margin: '0 10px',
              marginBottom: '30px',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Toast({ message, type }) {
  const colors = {
    success: COLORS.green,
    error: COLORS.saffron,
    info: COLORS.navy,
  };

  const emojis = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div style={{
      background: COLORS.white,
      border: `2px solid ${colors[type]}`,
      borderRadius: '10px',
      padding: '16px 20px',
      minWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <div style={{ fontSize: '24px' }}>{emojis[type]}</div>
      <div style={{
        flex: 1,
        fontSize: '14px',
        color: COLORS.navy,
        fontWeight: 500,
      }}>
        {message}
      </div>
    </div>
  );
}
