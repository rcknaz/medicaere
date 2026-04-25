import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  ShieldCheck, 
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  FileText,
  Upload,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { cn } from './lib/utils';
import { useState, useEffect } from 'react';
import { INITIAL_DOCTORS, DEPARTMENTS } from './constants';
import { getCollection, createDocument, subscribeToCollection, updateDocument } from './lib/firestoreService';
import { where } from 'firebase/firestore';
import { format } from 'date-fns';
import { Appointment, Doctor, Report } from './types';

// --- Components ---

function Navbar() {
  const { user, profile, logout, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediCare<span className="text-primary-600">Plus</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/doctors" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Doctors</Link>
            <Link to="/departments" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Departments</Link>
            {user ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                <Link to="/dashboard" className="bg-primary-50 text-primary-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-100 transition-all">Dashboard</Link>
                <button onClick={() => logout()} className="text-slate-400 hover:text-red-500 transition-colors p-2"><LogOut className="w-5 h-5"/></button>
              </div>
            ) : (
              <button 
                onClick={() => login()} 
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm shadow-slate-200"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/doctors" className="block text-gray-600 font-medium py-2">Doctors</Link>
              <Link to="/departments" className="block text-gray-600 font-medium py-2">Departments</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-primary-600 font-bold py-2 font-display">Patient Dashboard</Link>
                  <button onClick={() => logout()} className="w-full text-left text-red-500 font-medium py-2">Sign Out</button>
                </>
              ) : (
                <button onClick={() => login()} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold">Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Pages ---

function Home() {
  const navigate = useNavigate();
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-md text-sm font-bold mb-6">
                <Heart className="w-4 h-4" /> HEALTHCARE EXCELLENCE
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 font-display">
                Advanced Care <br />
                <span className="text-primary-500">For Your Life.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                Connect with world-class specialists and manage your health seamlessly with our modern digital platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/doctors')} 
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center"
                >
                  Book Now <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/departments')} 
                  className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
                >
                  Specialties
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary-100 rounded-[2rem] opacity-30 -rotate-2 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[2rem] shadow-xl object-cover h-[540px] w-full border border-slate-100"
                alt="Hospital"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trusted Care</p>
                  <p className="font-bold text-slate-900">Certified Specialists</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { label: 'Specialists', val: '50+' },
              { label: 'Success Rate', val: '99%' },
              { label: 'Modern Beds', val: '300+' },
              { label: 'Happy Patients', val: '25k+' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-3xl font-bold text-white mb-2">{stat.val}</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display tracking-tight">Specialized Departments</h2>
              <p className="text-slate-500 max-w-md">Our hospital is equipped with state-of-the-art facilities across all major medical fields.</p>
            </div>
            <Link to="/departments" className="hidden md:flex items-center text-primary-600 font-bold hover:translate-x-1 transition-transform">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.slice(0, 3).map((dept, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 group transition-all hover:border-primary-100"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{dept.name}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{dept.description}</p>
                <button className="text-emerald-600 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  LEARN MORE <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getCollection<Doctor>('doctors');
        if (data.length === 0) {
          // Only attempt to seed if we have an admin profile
          if (profile?.role === 'admin') {
            for (const docData of INITIAL_DOCTORS) {
              const { id, ...rest } = docData;
              await createDocument('doctors', rest, id);
            }
            const newData = await getCollection<Doctor>('doctors');
            setDoctors(newData.length > 0 ? newData : INITIAL_DOCTORS as any);
          } else {
            // Static fallback for viewing
            setDoctors(INITIAL_DOCTORS as any);
          }
        } else {
          setDoctors(data);
        }
      } catch (err) {
        console.warn("Seeding or fetching failed, using fallback:", err);
        setDoctors(INITIAL_DOCTORS as any);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [profile]);

  const handleBooking = (doctor: Doctor) => {
    if (!user) {
      login();
    } else {
      navigate('/book', { state: { doctor } });
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">Medical Specialists</h1>
          <p className="text-slate-500">Expert doctors dedicated to your long-term health and wellbeing.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doc, i) => (
            <motion.div 
              key={doc.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <div className="relative h-60 overflow-hidden">
                <img src={doc.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={doc.name} />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <Heart className="w-3 h-3 mr-1 fill-emerald-500" /> TOP RATED
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{doc.name}</h3>
                  <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mb-3">{doc.specialty}</p>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{doc.bio}</p>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Experience</span>
                    <span className="font-bold text-slate-700 text-sm">{doc.experience}</span>
                  </div>
                  <button 
                    onClick={() => handleBooking(doc)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const doctor = location.state?.doctor as Doctor;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!doctor) {
    return <div className="pt-32 text-center">Please select a doctor first.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !doctor || !doctor.id) {
      alert("Error: Missing profile or doctor information.");
      return;
    }
    setSubmitting(true);
    try {
      await createDocument('appointments', {
        patientId: profile.uid,
        patientName: profile.displayName,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        date,
        time,
        reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12"
      >
        <div className="md:w-1/3">
          <img src={doctor.imageUrl} className="w-full aspect-square object-cover rounded-3xl mb-6 shadow-xl" alt={doctor.name} />
          <h2 className="text-2xl mb-1">{doctor.name}</h2>
          <p className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-6">{doctor.specialty}</p>
          <div className="space-y-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-2" /> {doctor.experience} experience
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Heart className="w-4 h-4 mr-2" /> Top Rated Specialist
            </div>
          </div>
        </div>

        <div className="md:w-2/3 border-l border-gray-100 md:pl-12">
          <h1 className="text-3xl mb-8 font-display">Schedule Your Visit</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Preferred Date</label>
                <input 
                  required
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Preferred Time</label>
                <select 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                >
                  <option value="">Select Time Slot</option>
                  {(doctor.schedule && date && doctor.schedule[date]) ? (
                    doctor.schedule[date].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))
                  ) : (
                    doctor.availability?.map(t => (
                      <option key={t} value={t}>{t}</option>
                    )) || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Reason for Appointment</label>
              <textarea 
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your health concern..."
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none font-medium"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function Dashboard() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports'>('appointments');

  useEffect(() => {
    if (!profile) return;
    
    const unsubApps = subscribeToCollection<Appointment>(
      'appointments', 
      [where('patientId', '==', profile.uid)], 
      (data) => setAppointments(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    );

    const unsubReports = subscribeToCollection<Report>(
      'reports', 
      [where('patientId', '==', profile.uid)], 
      setReports
    );

    return () => {
      unsubApps();
      unsubReports();
    };
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-12 bg-white px-8 py-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <img src={profile.photoURL} className="w-16 h-16 rounded-lg object-cover ring-4 ring-slate-50" alt={profile.displayName} />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile.displayName}</h1>
            <p className="text-sm text-slate-500">Stay healthy! Here's your current medical record overview.</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-bold transition-all",
              activeTab === 'appointments' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Appointments
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-bold transition-all",
              activeTab === 'reports' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Medical Reports
          </button>
        </div>
      </header>

      {/* Stats Quick Row */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Appointments</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 mt-4 font-bold">NEXT: {appointments.find(a => a.status === 'confirmed')?.date || 'None scheduled'}</p>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Medical Reports</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{reports.length}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-blue-600 mt-4 font-bold">{reports.length > 0 ? 'All reports are up to date' : 'No reports yet'}</p>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Member Status</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">Active</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold italic">Cloud Sync Enabled</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'appointments' ? (
          <motion.div 
            key="apps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-900">Recent Appointments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialty</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">No appointments found.</td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4">
                          <span className="text-sm font-bold text-slate-900">{app.doctorName}</span>
                        </td>
                        <td className="px-8 py-4 font-bold text-[10px] text-emerald-600 uppercase tracking-widest">
                          {app.doctorSpecialty}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-600">
                          {app.date}, {app.time}
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            app.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : 
                            app.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                          )}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          {app.status === 'pending' && (
                            <button 
                              onClick={() => updateDocument('appointments', app.id!, { status: 'cancelled' })}
                              className="text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm group">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{report.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{format(new Date(report.date), 'PPP')}</p>
                <button className="text-emerald-600 text-xs font-bold flex items-center hover:translate-x-1 transition-transform">
                  DOWNLOAD PDF <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">No medical reports available yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profile]);

  if (!profile || profile.role !== 'admin') return null;

  return (
    <div className="pt-24 min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center space-x-4 mb-20">
          <div className="bg-primary-600 p-4 rounded-3xl">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display">Hospital Command Center</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Administrator Control Panel</p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
           <AdminSidebar />
           <div className="lg:col-span-3">
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/appointments" element={<AdminAppointments />} />
                <Route path="/doctors" element={<AdminDoctors />} />
              </Routes>
           </div>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const location = useLocation();
  const items = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { label: 'Manage Doctors', icon: Users, path: '/admin/doctors' },
  ];

  return (
    <div className="space-y-2">
      {items.map(item => (
        <Link 
          key={item.path} 
          to={item.path}
          className={cn(
            "flex items-center space-x-4 p-5 rounded-3xl transition-all font-bold group",
            location.pathname === item.path ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          )}
        >
          <item.icon className="w-6 h-6" />
          <span>{item.label}</span>
          {location.pathname !== item.path && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
        </Link>
      ))}
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState({ appointments: 0, doctors: 0, patients: 0 });
  
  useEffect(() => {
    async function fetchData() {
      const apps = await getCollection('appointments');
      const docs = await getCollection('doctors');
      const users = await getCollection('users');
      setStats({
        appointments: apps.length,
        doctors: docs.length,
        patients: users.length
      });
    }
    fetchData();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { label: 'Total Patients', val: stats.patients, icon: Users, color: 'bg-blue-500' },
        { label: 'Appointments', val: stats.appointments, icon: Calendar, color: 'bg-primary-600' },
        { label: 'Active Doctors', val: stats.doctors, icon: Heart, color: 'bg-rose-500' }
      ].map((card, i) => (
        <div key={i} className="bg-gray-800 p-8 rounded-[3rem] border border-gray-700/50">
          <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-black/50`}>
            <card.icon className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">{card.label}</p>
          <h3 className="text-5xl font-display">{card.val}</h3>
        </div>
      ))}
    </div>
  );
}

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    return subscribeToCollection<Appointment>('appointments', [], setAppointments);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDocument('appointments', id, { status } as any);
  };

  return (
    <div className="bg-gray-800 rounded-[3rem] border border-gray-700/50 overflow-hidden">
      <div className="p-8 border-b border-gray-700/50 flex justify-between items-center">
        <h2 className="text-2xl font-display">Manage Appointments</h2>
        <div className="flex bg-gray-900 rounded-2xl p-1">
          <button className="px-6 py-2 rounded-xl bg-gray-800 font-bold text-xs">All</button>
          <button className="px-6 py-2 rounded-xl text-gray-500 font-bold text-xs">Pending</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <tr>
              <th className="px-8 py-5">Patient</th>
              <th className="px-8 py-5">Doctor</th>
              <th className="px-8 py-5">Date/Time</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {appointments.map((app) => (
              <tr key={app.id} className="hover:bg-gray-700/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-bold text-gray-200">{app.patientName}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">{app.patientId.slice(0,8)}</div>
                </td>
                <td className="px-8 py-6 text-gray-400">{app.doctorName}</td>
                <td className="px-8 py-6 text-gray-400">{app.date} • {app.time}</td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase",
                    app.status === 'confirmed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {app.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {app.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(app.id!, 'confirmed')}
                      className="bg-primary-600/20 text-primary-400 p-2 rounded-xl hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    async function fetchDocs() {
      const data = await getCollection<Doctor>('doctors');
      setDoctors(data);
      if (data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0].id);
      }
      setLoading(false);
    }
    fetchDocs();
  }, []);

  const selectedDoc = doctors.find(d => d.id === selectedDocId);

  useEffect(() => {
    if (selectedDoc && selectedDate) {
      const schedule = selectedDoc.schedule || {};
      setSelectedSlots(schedule[selectedDate] || []);
    }
  }, [selectedDocId, selectedDate, doctors]);

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    if (!selectedDocId || !selectedDate) return;
    setSaving(true);
    try {
      const newSchedule = { ...(selectedDoc?.schedule || {}) };
      if (selectedSlots.length > 0) {
        newSchedule[selectedDate] = selectedSlots;
      } else {
        delete newSchedule[selectedDate];
      }

      await updateDocument('doctors', selectedDocId, { schedule: newSchedule });
      
      // Update local state
      setDoctors(prev => prev.map(d => 
        d.id === selectedDocId ? { ...d, schedule: newSchedule } : d
      ));
      
      alert('Availability updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update availability.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading doctors...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-8 rounded-[3rem] border border-gray-700/50">
        <h2 className="text-2xl font-display mb-6">Manage Doctor Availability</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Specialist</label>
            <select 
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="">Select a doctor</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {selectedDoc ? (
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Toggle Available Slots for {selectedDate}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    className={cn(
                      "py-4 rounded-2xl font-bold transition-all border-2",
                      selectedSlots.includes(slot)
                        ? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20"
                        : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-12 py-5 bg-white text-gray-900 rounded-2xl font-bold hover:bg-primary-50 transition-all disabled:opacity-50 shadow-xl"
              >
                {saving ? 'Updating...' : 'Save Availability'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 italic">
            Select a doctor to manage their schedule.
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-8 rounded-[3rem] border border-gray-700/50">
        <h3 className="text-xl font-display mb-6">Active Schedule Overview</h3>
        {selectedDoc && selectedDoc.schedule && Object.keys(selectedDoc.schedule).length > 0 ? (
          <div className="space-y-4">
            {Object.keys(selectedDoc.schedule).sort().map(date => (
              <div key={date} className="flex items-center justify-between p-4 bg-gray-900 rounded-2xl border border-gray-700">
                <span className="font-bold text-gray-200">{date}</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedDoc.schedule![date].map(slot => (
                    <span key={slot} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs font-bold">{slot}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No specific dates configured. Using global default slots.</p>
        )}
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/departments" element={<div className="pt-32 text-center text-gray-400">Department detail pages coming soon...</div>} />
            </Routes>
          </main>
          <footer className="bg-gray-50 py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="bg-primary-600 p-1.5 rounded-lg">
                  <Stethoscope className="text-white w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">MediCarePlus</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 font-medium">
                Modern healthcare solutions for everyone. Providing accessible medical care since 2024.
              </p>
              <div className="flex justify-center space-x-8 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}
