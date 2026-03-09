
import React, { useState, useEffect } from 'react';
import { IssueStatus, CivicItem, UserRole } from '../types';
import { MOCK_ISSUES } from '../constants';

const AdminPanel: React.FC = () => {
  const [items, setItems] = useState<CivicItem[]>(MOCK_ISSUES);
  const [activeTab, setActiveTab] = useState<'user_approvals' | 'proposal_approvals' | 'plan_approvals' | 'final_audit'>('user_approvals');
  const [actionModal, setActionModal] = useState<{ id: string, nextStatus: IssueStatus, title: string } | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [timelineInput, setTimelineInput] = useState('');

  // Mock pending users
  const [pendingUsers, setPendingUsers] = useState<any[]>([
    { id: 'u1', name: 'Apex Infrastructure', role: UserRole.CONTRACTOR, email: 'bidding@apex.in', docs: 'license_v2.pdf', date: '2023-12-01' },
    { id: 'u2', name: 'Global Urban Fund', role: UserRole.INVESTOR, email: 'finance@guf.com', docs: 'investment_portfolio.pdf', date: '2023-12-02' },
    { id: 'u3', name: 'Modern Roadways Ltd', role: UserRole.CONTRACTOR, email: 'ops@modern.in', docs: 'gst_cert.pdf', date: '2023-12-03' },
  ]);

  // Load newly registered users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('civic_registered_users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        // Add them to the pending list if they aren't already there and are PENDING
        setPendingUsers(prev => {
          const newUsers = parsedUsers.filter((pu: any) => pu.status !== 'ACTIVE' && !prev.some(u => u.id === pu.id));
          return [...newUsers, ...prev];
        });
      } catch (e) {
        console.error("Failed to parse registered users", e);
      }
    }
    
    // Load dynamically submitted proposals
    try {
      const savedProposals = localStorage.getItem('civic_proposals');
      if (savedProposals) {
        const parsed = JSON.parse(savedProposals);
        // Map PENDING_REVIEW to CITIZEN_SUBMITTED for the admin panel flow
        const mappedProposals = parsed.map((p: any) => ({
          ...p,
          status: p.status === 'PENDING_REVIEW' ? IssueStatus.CITIZEN_SUBMITTED : p.status
        }));
        setItems(prev => {
          const newItems = mappedProposals.filter((mp: any) => !prev.some(i => i.id === mp.id));
          return [...newItems, ...prev];
        });
      }
    } catch (e) {
      console.error("Failed to load proposals", e);
    }
  }, []);

  const updateItemStatus = (id: string, newStatus: IssueStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, status: newStatus } : item));
    
    // Update in localStorage
    try {
      const savedProposals = localStorage.getItem('civic_proposals');
      if (savedProposals) {
        const parsed = JSON.parse(savedProposals);
        const updated = parsed.map((p: any) => p.id === id ? { ...p, status: newStatus } : p);
        localStorage.setItem('civic_proposals', JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to update proposal in local storage", e);
    }
    
    alert(`Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleActionClick = (id: string, nextStatus: IssueStatus, title: string) => {
    setActionModal({ id, nextStatus, title });
    setBudgetInput('');
    setTimelineInput('');
  };

  const confirmAction = () => {
    if (actionModal) {
      setItems(items.map(item => item.id === actionModal.id ? { 
        ...item, 
        status: actionModal.nextStatus,
        budget: budgetInput ? Number(budgetInput) : item.budget,
        timeline: timelineInput || item.timeline
      } : item));
      
      // Update in localStorage
      try {
        const savedProposals = localStorage.getItem('civic_proposals');
        if (savedProposals) {
          const parsed = JSON.parse(savedProposals);
          const updated = parsed.map((p: any) => p.id === actionModal.id ? {
            ...p,
            status: actionModal.nextStatus,
            budget: budgetInput ? Number(budgetInput) : p.budget,
            timeline: timelineInput || p.timeline
          } : p);
          localStorage.setItem('civic_proposals', JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Failed to update proposal in local storage", e);
      }
      
      alert(`Status updated to ${actionModal.nextStatus.replace('_', ' ')}`);
      setActionModal(null);
    }
  };

  const approveUser = (id: string) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
    
    // Update status in localStorage
    const storedUsers = localStorage.getItem('civic_registered_users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        const updatedUsers = parsedUsers.map((u: any) => u.id === id ? { ...u, status: 'ACTIVE' } : u);
        localStorage.setItem('civic_registered_users', JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Failed to update user status", e);
      }
    }
    
    alert("User access granted. They can now log in to their respective portals.");
  };

  const stats = [
    { label: 'Pending Users', value: pendingUsers.length, icon: 'fa-user-clock', color: 'text-amber-500' },
    { label: 'New Proposals', value: items.filter(i => i.status === IssueStatus.CITIZEN_SUBMITTED).length, icon: 'fa-file-signature', color: 'text-blue-500' },
    { label: 'Execution Plans', value: items.filter(i => i.status === IssueStatus.PROPOSAL_UNDER_REVIEW).length, icon: 'fa-file-powerpoint', color: 'text-orange-500' },
    { label: 'Live Projects', value: items.filter(i => i.status === IssueStatus.IN_PROGRESS).length, icon: 'fa-hammer', color: 'text-green-500' },
    { label: 'Data Security', value: 'Active', icon: 'fa-shield-check', color: 'text-emerald-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Platform Validation Engine</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Project Screening & Verification</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-w-[120px]">
              <div className={`flex items-center gap-2 mb-1 ${s.color}`}>
                <i className={`fas ${s.icon} text-xs`}></i>
                <span className="text-[10px] font-black uppercase tracking-tighter">{s.label}</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-5 flex justify-end mt-2">
            <button 
              onClick={() => alert('Exporting data to Google Sheets...')}
              className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-green-200"
            >
              <i className="fas fa-file-excel"></i> Export to Sheets
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm space-y-1">
            <button 
              onClick={() => setActiveTab('user_approvals')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between ${activeTab === 'user_approvals' ? 'bg-blue-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>User Approvals</span>
              <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{pendingUsers.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('proposal_approvals')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between ${activeTab === 'proposal_approvals' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>Project Validation</span>
              <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{items.filter(i => i.status === IssueStatus.CITIZEN_SUBMITTED).length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('plan_approvals')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between ${activeTab === 'plan_approvals' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>Execution PPTs</span>
              <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{items.filter(i => i.status === IssueStatus.PROPOSAL_UNDER_REVIEW).length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('final_audit')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between ${activeTab === 'final_audit' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>Final Project Audit</span>
              <span className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{items.filter(i => i.status === IssueStatus.IN_PROGRESS).length}</span>
            </button>
          </div>
        </aside>

        <main className="flex-grow bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl italic">
                {activeTab === 'user_approvals' ? 'Identity Verification' : 
                 activeTab === 'proposal_approvals' ? 'Project Validation & Listing' : 
                 activeTab === 'plan_approvals' ? 'Contractor Proposal Evaluation' : 
                 'Execution Monitoring'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Management Decisions</p>
            </div>
            <i className="fas fa-shield-check text-slate-300 text-3xl"></i>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'user_approvals' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5">Entity Information</th>
                    <th className="px-8 py-5">Professional Role</th>
                    <th className="px-8 py-5">Verified Docs</th>
                    <th className="px-8 py-5 text-right">Final Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${user.role === UserRole.CONTRACTOR ? 'bg-orange-100 text-orange-600' : user.role === UserRole.INVESTOR ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {user.docs ? (
                          <button className="text-blue-900 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                            <i className="fas fa-file-pdf"></i> View {Array.isArray(user.docs) ? user.docs[0] : user.docs}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">KYC Verified via OTP</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                          <button onClick={() => approveUser(user.id)} className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-green-100"><i className="fas fa-check"></i></button>
                          <button className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-110 transition"><i className="fas fa-times"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingUsers.length === 0 && (
                    <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest">No New Entities Awaiting Approval</td></tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase font-black bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5">Project/Proposal</th>
                    <th className="px-8 py-5">Location Context</th>
                    <th className="px-8 py-5">Current Phase</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.filter(i => {
                    if (activeTab === 'proposal_approvals') return i.status === IssueStatus.CITIZEN_SUBMITTED;
                    if (activeTab === 'plan_approvals') return i.status === IssueStatus.PROPOSAL_UNDER_REVIEW;
                    if (activeTab === 'final_audit') return i.status === IssueStatus.IN_PROGRESS;
                    return false;
                  }).map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 text-sm">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{item.category} • Raised {item.createdAt}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs text-slate-600 font-bold">{item.location.address}</p>
                        <button className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1 hover:underline">View Geo-Coordinates</button>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-tighter border border-slate-200">
                           {item.status.replace('_', ' ')}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          {activeTab === 'proposal_approvals' && (
                            <button 
                              onClick={() => handleActionClick(item.id, IssueStatus.OPEN_FOR_PROPOSAL, item.title)}
                              className="px-5 py-2.5 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-100 transition active:scale-95"
                            >
                              Validate & List
                            </button>
                          )}
                          {activeTab === 'plan_approvals' && (
                             <button 
                              onClick={() => handleActionClick(item.id, IssueStatus.FUNDING_PHASE, item.title)}
                              className="px-5 py-2.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 transition active:scale-95"
                            >
                              Authorize for Funding
                            </button>
                          )}
                          {activeTab === 'final_audit' && (
                             <button 
                              onClick={() => updateItemStatus(item.id, IssueStatus.COMPLETED)}
                              className="px-5 py-2.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition active:scale-95"
                            >
                              Approve Completion
                            </button>
                          )}
                          <button className="px-4 py-2.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.filter(i => {
                    if (activeTab === 'proposal_approvals') return i.status === IssueStatus.CITIZEN_SUBMITTED;
                    if (activeTab === 'plan_approvals') return i.status === IssueStatus.PROPOSAL_UNDER_REVIEW;
                    if (activeTab === 'final_audit') return i.status === IssueStatus.IN_PROGRESS;
                    return false;
                  }).length === 0 && (
                    <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest">No Items Pending Decision in this Queue</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {actionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Project Details</h3>
            <p className="text-slate-500 text-sm mb-6">Set the budget and timeline for <b>{actionModal.title}</b> before proceeding.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Allocated Budget (₹)</label>
                <input 
                  type="number" 
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="e.g. 5000000"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Expected Timeline</label>
                <input 
                  type="text" 
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="e.g. 6 Months"
                  value={timelineInput}
                  onChange={(e) => setTimelineInput(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setActionModal(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className="flex-1 py-3 bg-blue-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-100"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
