import React, { useState, useEffect } from 'react';
import { UserRole, IssueStatus } from '../types';
import { MOCK_ISSUES } from '../constants';

const SuperAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'analytics' | 'users' | 'projects' | 'revenue' | 'security'>('kyc');
  const [userTab, setUserTab] = useState<UserRole>(UserRole.CITIZEN);
  const [docModal, setDocModal] = useState<{ url: string, type: string, userName: string } | null>(null);

  const [allProjects, setAllProjects] = useState<any[]>(MOCK_ISSUES);
  const [allUsers, setAllUsers] = useState<any[]>([
    { id: 'c1', name: 'Ramesh Kumar', role: UserRole.CITIZEN, email: 'ramesh@example.com', date: '2023-10-15', status: 'ACTIVE' },
    { id: 'c2', name: 'Priya Singh', role: UserRole.CITIZEN, email: 'priya@example.com', date: '2023-11-02', status: 'ACTIVE' },
    { id: 'co1', name: 'BuildWell Corp', role: UserRole.CONTRACTOR, email: 'contact@buildwell.in', date: '2023-09-20', status: 'ACTIVE' },
    { id: 'i1', name: 'Green Earth Foundation', role: UserRole.INVESTOR, email: 'csr@greenearth.org', date: '2023-08-10', status: 'ACTIVE' },
  ]);

  const [pendingKYC, setPendingKYC] = useState<any[]>([
    { id: 'u1', name: 'Apex Infrastructure', role: UserRole.CONTRACTOR, email: 'bidding@apex.in', docs: ['GST_Cert.pdf', 'License_v2.pdf'], date: '2023-12-01', status: 'PENDING' },
    { id: 'u2', name: 'Global Urban Fund', role: UserRole.INVESTOR, email: 'finance@guf.com', docs: ['Investment_Portfolio.pdf', 'Corporate_ID.pdf'], date: '2023-12-02', status: 'PENDING' },
    { id: 'u3', name: 'Modern Roadways Ltd', role: UserRole.CONTRACTOR, email: 'ops@modern.in', docs: ['GST_Cert.pdf', 'Contractor_License.pdf'], date: '2023-12-03', status: 'PENDING' },
  ]);

  useEffect(() => {
    // Load dynamically submitted proposals
    try {
      const savedProposals = localStorage.getItem('civic_proposals');
      if (savedProposals) {
        const parsed = JSON.parse(savedProposals);
        setAllProjects([...parsed, ...MOCK_ISSUES]);
      }
    } catch (e) {
      console.error("Failed to load proposals", e);
    }

    // Load dynamically registered users
    try {
      const savedUsers = localStorage.getItem('civic_registered_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        const usersWithStatus = parsed.map((u: any) => ({ ...u, status: u.status || 'ACTIVE' }));
        setAllUsers(prev => [...usersWithStatus, ...prev]);
        
        // Add to pending KYC if they have docs (Contractors/Investors)
        const newPending = parsed.filter((u: any) => u.docs && u.status !== 'ACTIVE').map((u: any) => ({
          ...u,
          docs: Array.isArray(u.docs) ? u.docs : [u.docs],
          status: 'PENDING'
        }));
        setPendingKYC(prev => {
          const filtered = newPending.filter((nu: any) => !prev.some(pu => pu.id === nu.id));
          return [...filtered, ...prev];
        });
      }
    } catch (e) {
      console.error("Failed to load users", e);
    }
  }, []);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setPendingKYC(pendingKYC.filter(u => u.id !== id));
    
    if (action === 'APPROVE') {
      // Update status in localStorage
      const storedUsers = localStorage.getItem('civic_registered_users');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          const updatedUsers = parsedUsers.map((u: any) => u.id === id ? { ...u, status: 'ACTIVE' } : u);
          localStorage.setItem('civic_registered_users', JSON.stringify(updatedUsers));
          
          // Update allUsers state
          setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'ACTIVE' } : u));
        } catch (e) {
          console.error("Failed to update user status", e);
        }
      }
    }
    
    alert(`Entity ${action === 'APPROVE' ? 'Approved' : 'Rejected'} successfully.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">CEO / Super Admin Suite</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Platform Compliance & Global Metrics</p>
        </div>
        <div className="bg-slate-900 p-1 rounded-xl flex flex-wrap gap-1">
          <button 
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'kyc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            KYC & Compliance
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            User Data
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'projects' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Project Data
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'revenue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Revenue
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'security' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-red-400'}`}
          >
            <i className="fas fa-shield-alt mr-1"></i> Security
          </button>
        </div>
      </div>

      {activeTab === 'kyc' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl italic">Entity Verification Queue</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review Professional Documents</p>
            </div>
            <i className="fas fa-file-signature text-slate-300 text-3xl"></i>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5">Entity Information</th>
                  <th className="px-8 py-5">Platform Role</th>
                  <th className="px-8 py-5">Submitted Documents</th>
                  <th className="px-8 py-5 text-right">CEO Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingKYC.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-sm">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                      <p className="text-[9px] text-slate-400 uppercase mt-1">Applied: {user.date}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${user.role === UserRole.CONTRACTOR ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        {user.docs.map((doc, i) => (
                          <button 
                            key={i}
                            onClick={() => setDocModal({ url: '#', type: doc, userName: user.name })}
                            className="text-blue-900 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2 w-fit"
                          >
                            <i className="fas fa-file-pdf"></i> View {doc}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                        <button onClick={() => handleAction(user.id, 'APPROVE')} className="px-4 py-2 rounded-xl bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-green-100">Approve</button>
                        <button onClick={() => handleAction(user.id, 'REJECT')} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingKYC.length === 0 && (
                  <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest">No Entities Awaiting KYC Approval</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl italic">Platform Users Database</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Citizens, Contractors, and Investors</p>
            </div>
            <div className="bg-white p-1 rounded-xl flex border border-slate-200 shadow-sm">
              <button 
                onClick={() => setUserTab(UserRole.CITIZEN)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${userTab === UserRole.CITIZEN ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Citizens
              </button>
              <button 
                onClick={() => setUserTab(UserRole.CONTRACTOR)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${userTab === UserRole.CONTRACTOR ? 'bg-orange-50 text-orange-500' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Contractors
              </button>
              <button 
                onClick={() => setUserTab(UserRole.INVESTOR)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${userTab === UserRole.INVESTOR ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Investors
              </button>
            </div>
            <button 
              onClick={() => alert('Exporting user data to Google Sheets...')}
              className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-green-200"
            >
              <i className="fas fa-file-excel"></i> Export to Sheets
            </button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5">User ID / Name</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Contact Info</th>
                  <th className="px-8 py-5">Joined Date</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allUsers.filter(u => u.role === userTab).map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-sm">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{user.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                        user.role === UserRole.CONTRACTOR ? 'bg-orange-100 text-orange-600' : 
                        user.role === UserRole.INVESTOR ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600">{user.email}</td>
                    <td className="px-8 py-6 text-xs text-slate-500">{user.date}</td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {allUsers.filter(u => u.role === userTab).length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No users found in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'projects' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl italic">Master Project Database</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All Proposals, PPTs, and Live Projects</p>
            </div>
            <div className="flex items-center gap-4">
              <i className="fas fa-database text-slate-300 text-3xl hidden md:block"></i>
              <button 
                onClick={() => alert('Exporting project data to Google Sheets...')}
                className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-green-200"
              >
                <i className="fas fa-file-excel"></i> Export to Sheets
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5">Project ID / Title</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5 text-right">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allProjects.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-sm">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600 uppercase">{item.category}</td>
                    <td className="px-8 py-6 text-xs text-slate-500">{item.location.address}</td>
                    <td className="px-8 py-6">
                      <span className="text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm bg-blue-50 text-blue-800">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-sm font-black text-slate-800">
                      {item.budget ? `₹${(item.budget / 100000).toFixed(1)}L` : 'TBD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'revenue' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl italic">Platform Revenue Model</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Signup Fees, Premium Memberships & Data Downloads</p>
              </div>
              <button 
                onClick={() => alert('Exporting revenue data to Google Sheets...')}
                className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-green-200"
              >
                <i className="fas fa-file-excel"></i> Export to Sheets
              </button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-hard-hat"></i>
                </div>
                <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1">Contractor Signups</p>
                <p className="text-3xl font-black text-slate-900">₹2.5L</p>
                <p className="text-xs text-orange-600 mt-2 font-bold">250 @ ₹1,000</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-coins"></i>
                </div>
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Investor Signups</p>
                <p className="text-3xl font-black text-slate-900">₹4.25L</p>
                <p className="text-xs text-blue-700 mt-2 font-bold">85 @ ₹5,000</p>
              </div>

              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 shadow-sm">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-crown"></i>
                </div>
                <p className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-1">Premium Citizens</p>
                <p className="text-3xl font-black text-slate-900">₹6.2L</p>
                <p className="text-xs text-green-700 mt-2 font-bold">1,240 @ ₹499/yr</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-download"></i>
                </div>
                <p className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-1">Data Downloads</p>
                <p className="text-3xl font-black text-slate-900">₹1.8L</p>
                <p className="text-xs text-purple-700 mt-2 font-bold">Admin Approved</p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <h3 className="font-black text-slate-800 mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">User/Entity</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-500">Today, 10:45 AM</td>
                      <td className="px-4 py-3 text-xs font-bold text-orange-600">Contractor Signup</td>
                      <td className="px-4 py-3 text-sm font-black text-slate-800">Apex Infrastructure</td>
                      <td className="px-4 py-3 text-right text-sm font-black text-slate-900">+₹1,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-500">Today, 09:15 AM</td>
                      <td className="px-4 py-3 text-xs font-bold text-green-600">Premium Upgrade</td>
                      <td className="px-4 py-3 text-sm font-black text-slate-800">Ramesh Kumar</td>
                      <td className="px-4 py-3 text-right text-sm font-black text-slate-900">+₹499</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-500">Yesterday</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-600">Investor Signup</td>
                      <td className="px-4 py-3 text-sm font-black text-slate-800">Global Urban Fund</td>
                      <td className="px-4 py-3 text-right text-sm font-black text-slate-900">+₹5,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'security' ? (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col text-white">
            <div className="p-8 border-b border-slate-800 bg-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-black text-white uppercase tracking-tighter text-xl italic flex items-center gap-3">
                  <i className="fas fa-shield-check text-green-400"></i> System Security & Data Integrity
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time threat monitoring and encryption status</p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-widest text-green-400">System Secure</span>
              </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-lock"></i>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Encryption</p>
                <p className="text-2xl font-black text-white">AES-256</p>
                <p className="text-xs text-blue-400 mt-2 font-bold">End-to-End Active</p>
              </div>
              
              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-server"></i>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Daily Backups</p>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-green-400 mt-2 font-bold">Last backup: 2 hrs ago</p>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-bug"></i>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Threats</p>
                <p className="text-2xl font-black text-white">0</p>
                <p className="text-xs text-red-400 mt-2 font-bold">Blocked today: 142</p>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-sm">
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center text-lg mb-3">
                  <i className="fas fa-user-shield"></i>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Control</p>
                <p className="text-2xl font-black text-white">Strict</p>
                <p className="text-xs text-purple-400 mt-2 font-bold">RBAC Enforced</p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <h3 className="font-black text-white mb-4">Recent Security Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-slate-500 uppercase font-black bg-slate-800/50 border-b border-slate-700">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">2026-02-23 11:35:12</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-400">Admin Login Success</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-300">192.168.1.45</td>
                      <td className="px-4 py-3 text-right text-xs font-black text-green-400">VERIFIED</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">2026-02-23 10:12:05</td>
                      <td className="px-4 py-3 text-xs font-bold text-orange-400">High-End Data Export</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-300">10.0.0.22</td>
                      <td className="px-4 py-3 text-right text-xs font-black text-green-400">AUTHORIZED</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">2026-02-23 08:45:33</td>
                      <td className="px-4 py-3 text-xs font-bold text-red-400">Failed Login Attempt (x5)</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-300">45.22.11.9</td>
                      <td className="px-4 py-3 text-right text-xs font-black text-red-500">IP BLOCKED</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">2026-02-23 02:00:00</td>
                      <td className="px-4 py-3 text-xs font-bold text-green-400">Automated DB Backup</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-300">localhost</td>
                      <td className="px-4 py-3 text-right text-xs font-black text-green-400">COMPLETED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => alert('Opening Google Analytics dashboard...')}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-blue-200"
            >
              <i className="fas fa-chart-line"></i> View in Google Analytics
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center text-xl mb-4">
                <i className="fas fa-users"></i>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Verified Users</p>
              <p className="text-4xl font-black text-slate-900">12,450</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full"></div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl mb-4 relative z-10">
                <i className="fas fa-signal"></i>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Active Users Online</p>
              <div className="flex items-center gap-3 relative z-10">
                <p className="text-4xl font-black text-slate-900">1,284</p>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Funds Escrowed</p>
              <p className="text-4xl font-black text-slate-900">₹45.2 Cr</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center text-xl mb-4">
                <i className="fas fa-hard-hat"></i>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Projects</p>
              <p className="text-4xl font-black text-slate-900">342</p>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {docModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tighter">{docModal.type}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entity: {docModal.userName}</p>
              </div>
              <button onClick={() => setDocModal(null)} className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-300 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-grow flex overflow-hidden">
              {/* Left: PDF Viewer */}
              <div className="w-1/2 bg-slate-200 flex items-center justify-center p-8 border-r border-slate-200">
                <div className="w-full h-full bg-white shadow-lg border border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                  <i className="fas fa-file-contract text-6xl text-slate-300 mb-6"></i>
                  <h4 className="text-2xl font-black text-slate-800 mb-2">Document Preview</h4>
                  <p className="text-slate-500 max-w-md">Secure preview of {docModal.type}.</p>
                </div>
              </div>
              {/* Right: AI Extraction & Editing */}
              <div className="w-1/2 bg-white p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg flex items-center gap-2">
                    <i className="fas fa-robot text-blue-600"></i> AI Data Extraction
                  </h4>
                  <button className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-100 transition">
                    Re-Scan Document
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Extracted Entity Name</label>
                    <input type="text" defaultValue={docModal.userName} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Registration / License No.</label>
                    <input type="text" defaultValue="REG-2023-88492" className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Primary Contact (Hidden from Public)</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Public Summary (Visible to Citizens)</label>
                    <textarea rows={3} defaultValue={`Verified Grade-A Entity. Authorized for infrastructure projects up to ₹50 Cr.`} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500"></textarea>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-4">Review the extracted data. You can modify any fields before publishing the primary data to the public registry.</p>
                  <button onClick={() => { alert('Primary data updated and published to public registry.'); setDocModal(null); }} className="w-full py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-lg">
                    Save & Publish Primary Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
