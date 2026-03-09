
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { UserRole, AuthState } from './types';
import { LogoSVG } from './components/Logo';
import NotificationBell from './components/NotificationBell';

// Lazy load route components for code splitting
const AIChatbot = lazy(() => import('./components/AIChatbot'));
const PublicHome = lazy(() => import('./views/PublicHome'));
const CivicFeed = lazy(() => import('./views/CivicFeed'));
const ProjectStatus = lazy(() => import('./views/ProjectStatus'));
const TransparencyDashboard = lazy(() => import('./views/TransparencyDashboard'));
const SubmissionForm = lazy(() => import('./views/SubmissionForm'));
const ContractorDashboard = lazy(() => import('./views/ContractorDashboard'));
const InvestorDashboard = lazy(() => import('./views/InvestorDashboard'));
const AdminPanel = lazy(() => import('./views/AdminPanel'));
const SuperAdminPanel = lazy(() => import('./views/SuperAdminPanel'));
const LoginView = lazy(() => import('./views/LoginView'));
const LegalView = lazy(() => import('./views/LegalView'));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
  </div>
);

const Navbar: React.FC<{ auth: AuthState; logout: () => void }> = ({ auth, logout }) => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/feed', label: 'Projects Feed' },
    { path: '/projects', label: 'Nearby Status' },
    { path: '/transparency', label: 'Transparency' },
  ];

  const roleLinks: Record<UserRole, { path: string; label: string }[]> = {
    [UserRole.GUEST]: [],
    [UserRole.CITIZEN]: [{ path: '/submit', label: 'Submit Project' }],
    [UserRole.CONTRACTOR]: [{ path: '/contractor-portal', label: 'Contractor Panel' }],
    [UserRole.INVESTOR]: [{ path: '/investor-portal', label: 'Investor Panel' }],
    [UserRole.ADMIN]: [{ path: '/admin', label: 'Admin Dashboard' }],
    [UserRole.SUPER_ADMIN]: [{ path: '/ceo', label: 'CEO Suite' }],
  };

  return (
    <>
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest text-center py-1">
          <i className="fas fa-wifi-slash mr-2"></i> Offline Mode - Changes will sync when online
        </div>
      )}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <LogoSVG className="w-10 h-10" />
              <span className="text-xl font-black tracking-tighter text-blue-900 hidden sm:block font-serif">Public Project</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-xs font-black uppercase tracking-widest ${
                    pathname === link.path ? 'text-blue-900' : 'text-slate-400 hover:text-blue-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {auth.user ? (
              <>
                <div className="hidden md:flex space-x-2 border-r pr-4 border-slate-200">
                  {roleLinks[auth.user.role].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-blue-900 bg-blue-50 hover:bg-blue-100 transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3 pl-2">
                  <NotificationBell role={auth.user.role} />
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-orange-500 leading-none">{auth.user.role}</span>
                    <span className="text-xs font-bold text-slate-800 leading-none mt-1">{auth.user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 transition"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-800 px-2 sm:px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-black uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 px-3 sm:px-5 py-2.5 rounded-xl shadow-xl shadow-orange-200 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center ml-2">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-blue-900 focus:outline-none p-2"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-3 rounded-xl text-sm font-black uppercase tracking-widest ${
                pathname === link.path ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {auth.user && roleLinks[auth.user.role].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-orange-600 bg-orange-50"
            >
              {link.label}
            </Link>
          ))}
          {!auth.user && (
            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-sm font-black uppercase tracking-widest text-slate-600 hover:text-slate-800 py-3 bg-slate-50 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-sm font-black uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 py-3 rounded-xl shadow-md shadow-orange-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
    </>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('civic_auth');
    return saved ? JSON.parse(saved) : { user: null };
  });

  const login = (role: UserRole, name: string) => {
    const isApproved = role === UserRole.CITIZEN || role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
    const newAuth = { 
      user: { 
        id: `USR-${Math.floor(Math.random() * 1000)}`, 
        role, 
        name,
        isApproved,
        pincode: role === UserRole.CITIZEN ? '560001' : undefined // Mock pincode for citizen
      } 
    };
    setAuth(newAuth);
    localStorage.setItem('civic_auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ user: null });
    localStorage.removeItem('civic_auth');
  };

  const upgradeToPremium = () => {
    if (auth.user) {
      const newAuth = { ...auth, user: { ...auth.user, isPremium: true } };
      setAuth(newAuth);
      localStorage.setItem('civic_auth', JSON.stringify(newAuth));
      alert('Successfully upgraded to Premium Member!');
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800">
        <Navbar auth={auth} logout={logout} />
        
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<PublicHome />} />
              <Route path="/feed" element={<CivicFeed auth={auth} onUpgrade={upgradeToPremium} />} />
              <Route path="/projects" element={<ProjectStatus auth={auth} onUpgrade={upgradeToPremium} />} />
              <Route path="/transparency" element={<TransparencyDashboard auth={auth} onUpgrade={upgradeToPremium} />} />
              <Route path="/login" element={<LoginView onLogin={login} />} />
              <Route path="/signup" element={<LoginView onLogin={login} isSignup />} />

              <Route 
                path="/submit" 
                element={auth.user?.role === UserRole.CITIZEN ? <SubmissionForm /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/contractor-portal" 
                element={auth.user?.role === UserRole.CONTRACTOR ? <ContractorDashboard pincode={auth.user?.pincode} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/investor-portal" 
                element={auth.user?.role === UserRole.INVESTOR ? <InvestorDashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin" 
                element={auth.user?.role === UserRole.ADMIN ? <AdminPanel /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/ceo" 
                element={auth.user?.role === UserRole.SUPER_ADMIN ? <SuperAdminPanel /> : <Navigate to="/login" />} 
              />
              <Route path="/terms" element={<LegalView type="terms" />} />
              <Route path="/privacy" element={<LegalView type="privacy" />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="bg-white border-t border-slate-200 py-10 px-4 mt-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 items-center gap-8">
            <div className="flex items-center gap-3">
              <LogoSVG className="w-10 h-10" />
              <div>
                 <span className="font-black text-blue-900 block leading-none font-serif text-lg">Public Project</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Infrastructure</span>
              </div>
            </div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center flex flex-col gap-2">
              <span>Securing Civic Infrastructure via Encrypted Data</span>
              <div className="flex justify-center gap-4 mt-2">
                <Link to="/terms" className="hover:text-blue-900 transition underline decoration-slate-200 underline-offset-4">Terms & Conditions</Link>
                <Link to="/privacy" className="hover:text-blue-900 transition underline decoration-slate-200 underline-offset-4">Privacy Policy</Link>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-900 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-900 transition"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </footer>

        <Suspense fallback={null}>
          <AIChatbot />
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
