
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AuthState, UserRole } from '../types';
import { MOCK_ISSUES } from '../constants';

interface TransparencyDashboardProps {
  auth?: AuthState;
  onUpgrade?: () => void;
}

const TransparencyDashboard: React.FC<TransparencyDashboardProps> = ({ auth, onUpgrade }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [downloadConfirm, setDownloadConfirm] = useState<{show: boolean, projectTitle?: string}>({show: false});

  const handleDownload = (e: React.MouseEvent, projectTitle: string) => {
    e.preventDefault();
    if (!auth?.user) {
      alert('Please sign in to download data.');
      return;
    }

    if (auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.SUPER_ADMIN) {
      alert(`Downloading Complete End-to-End Data for: ${projectTitle} (Admin Access)...`);
      return;
    }

    if (auth.user.role === UserRole.INVESTOR || auth.user.role === UserRole.CONTRACTOR) {
      if (auth.user.isPremium) {
        alert(`Downloading High-End Data for: ${projectTitle} (Includes material purchased, employee logs, confidential financials)...`);
      } else {
        setShowPremiumModal(true);
      }
      return;
    }

    // Citizens
    if (auth.user.isPremium) {
      setDownloadConfirm({ show: true, projectTitle });
    } else {
      setShowPremiumModal(true);
    }
  };

  const budgetData = [
    { name: 'Schools', allocated: 450, spent: 320 },
    { name: 'Infrastructure', allocated: 300, spent: 280 },
    { name: 'Bridges', allocated: 200, spent: 150 },
    { name: 'Other', allocated: 150, spent: 140 },
  ];

  const statusData = [
    { name: 'Completed', value: 420 },
    { name: 'In Progress', value: 215 },
    { name: 'Approved', value: 120 },
    { name: 'Pending', value: 340 },
  ];

  const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e2e8f0'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Financial Transparency Hub</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          We believe in complete fiscal accountability. Track every rupee allocated and spent on public projects.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-blue-900"></i>
            Budget Allocation vs Expenditure (in ₹ Crores)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Allocated" />
                <Bar dataKey="spent" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-blue-900"></i>
            Current Project Status Distribution
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {statusData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-xs font-medium text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden mb-12">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                <i className="fas fa-database text-blue-400"></i> Project Data Archives
              </h3>
              <p className="text-slate-400 max-w-2xl">
                Download specific data for individual projects. Normal citizens can view the list and status, while Premium Citizens can download primary financial and contractor data.
              </p>
            </div>
            <button className="border border-slate-700 text-slate-300 px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition whitespace-nowrap">
              Verify Blockchain Logs
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ISSUES.map(project => (
              <div key={project.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 transition group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-700 text-blue-400 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <span className="text-[9px] font-black px-2 py-1 bg-slate-700 text-slate-300 rounded-md uppercase tracking-widest">
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-1 text-white">{project.title}</h4>
                <p className="text-slate-400 text-xs mb-6 flex-grow"><i className="fas fa-map-marker-alt mr-1"></i> {project.location.address}</p>
                
                <button 
                  onClick={(e) => handleDownload(e, project.title)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i> Download Data
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-6">
              <i className="fas fa-crown"></i>
            </div>
            
            {auth?.user?.role === UserRole.INVESTOR || auth?.user?.role === UserRole.CONTRACTOR ? (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-2">High-End Data Access</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Download confidential data including material purchased, employee logs, and deep financials.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Data Download Fee</p>
                  <p className="text-3xl font-black text-slate-900">₹5,000<span className="text-sm text-slate-500 font-bold">/report</span></p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Premium Citizen Data</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Download ongoing projects data including issue raiser, location, contractor name, invested amount, and utilized amount.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Subscription</p>
                  <p className="text-3xl font-black text-slate-900">₹499<span className="text-sm text-slate-500 font-bold">/yr</span></p>
                </div>
              </>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  if (onUpgrade) onUpgrade();
                  setShowPremiumModal(false);
                }}
                className="w-full py-4 bg-orange-500 text-white font-black rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-lock"></i> {auth?.user?.role === UserRole.INVESTOR || auth?.user?.role === UserRole.CONTRACTOR ? 'Pay & Download' : 'Upgrade to Premium'}
              </button>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Confirmation Modal */}
      {downloadConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-6">
              <i className="fas fa-file-download"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Download</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              You are about to export primary data for <strong>{downloadConfirm.projectTitle}</strong>. This includes the issue raiser, location, contractor name, invested amount, and utilized amount.
            </p>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl mb-8 text-left">
              <strong><i className="fas fa-exclamation-triangle mr-1"></i> Data Usage Policy:</strong> By downloading this data, you agree to use it solely for civic transparency purposes and not for commercial redistribution.
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  alert(`Downloading Primary Data for: ${downloadConfirm.projectTitle}...`);
                  setDownloadConfirm({ show: false });
                }}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-check"></i> Confirm & Download
              </button>
              <button 
                onClick={() => setDownloadConfirm({ show: false })}
                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparencyDashboard;
