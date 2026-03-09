
import React, { useState } from 'react';
import { MOCK_ISSUES, CATEGORIES } from '../constants';
import { IssueStatus, AuthState, UserRole } from '../types';

interface ProjectStatusProps {
  auth?: AuthState;
  onUpgrade?: () => void;
}

const ImageCarousel: React.FC<{ urls: string[], alt: string }> = ({ urls, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!urls || urls.length === 0) return null;
  if (urls.length === 1) {
    return <img src={urls[0]} className="w-full h-32 object-cover rounded-lg mb-3" alt={alt} />;
  }

  return (
    <div className="relative w-full h-32 mb-3 group/carousel rounded-lg overflow-hidden">
      <img src={urls[currentIndex]} className="w-full h-full object-cover transition duration-500" alt={`${alt} - ${currentIndex + 1}`} />
      
      <div className="absolute inset-0 flex items-center justify-between p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1)); }}
          className="w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-left text-[10px]"></i>
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1)); }}
          className="w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
      
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 z-20">
        {urls.map((_, idx) => (
          <div key={idx} className={`w-1 h-1 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

const ProjectStatus: React.FC<ProjectStatusProps> = ({ auth, onUpgrade }) => {
  const pincode = auth?.user?.pincode;
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [downloadConfirm, setDownloadConfirm] = useState<{show: boolean, projectTitle?: string}>({show: false});

  const handleDownload = (e: React.MouseEvent, projectTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user) {
      alert('Please sign in to download data.');
      return;
    }

    if (auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.SUPER_ADMIN) {
      alert(`Downloading complete project data for ${projectTitle} (Admin Access)...`);
      return;
    }

    if (auth.user.role === UserRole.INVESTOR || auth.user.role === UserRole.CONTRACTOR) {
      if (auth.user.isPremium) {
        alert(`Downloading High-End Data for ${projectTitle}: Material purchased, Employee logs, Confidential financials...`);
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

  const filteredIssues = MOCK_ISSUES.filter(i => {
    const categoryMatch = categoryFilter === 'all' || i.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || i.status === statusFilter;
    
    let dateMatch = true;
    if (startDate) {
      dateMatch = dateMatch && new Date(i.createdAt) >= new Date(startDate);
    }
    if (endDate) {
      dateMatch = dateMatch && new Date(i.createdAt) <= new Date(endDate);
    }

    return categoryMatch && statusMatch && dateMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Nearby Development Status</h2>
          <p className="text-slate-600">
            {pincode ? `Real-time status of projects in and around Pincode: ${pincode}` : 'Real-time status of all public development projects.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.values(IssueStatus).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">From</span>
            <input 
              type="date" 
              className="text-sm font-bold text-slate-700 outline-none bg-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-xs font-bold text-slate-400 uppercase">To</span>
            <input 
              type="date" 
              className="text-sm font-bold text-slate-700 outline-none bg-transparent"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative h-[500px] bg-slate-200 rounded-3xl overflow-hidden border border-slate-300 group shadow-inner">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40"></div>
          {/* Mock Map Pins */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 -mt-4 -ml-4 cursor-pointer group/pin">
             <div className="w-8 h-8 bg-blue-900 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border border-slate-100 w-48 hidden group-hover/pin:block z-10">
               <p className="text-xs font-bold text-slate-900">Nearby Proposal Work</p>
               <p className="text-[10px] text-slate-500">Status: Approved</p>
             </div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 -mt-4 -ml-4 cursor-pointer group/pin">
             <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border border-slate-100 w-48 hidden group-hover/pin:block z-10">
               <p className="text-xs font-bold text-slate-900">Lighting Hub Beta</p>
               <p className="text-[10px] text-slate-500">Status: In Progress</p>
             </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-list-ul text-blue-900"></i> My Locality Milestones
          </h3>
          {filteredIssues.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group/copy cursor-pointer transition hover:bg-blue-50 hover:border-blue-100" onClick={() => {
                  navigator.clipboard.writeText(item.id);
                  alert(`Tracking ID ${item.id} copied to clipboard!`);
                }}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 group-hover/copy:text-blue-800">{item.id}</span>
                  <i className="fas fa-copy text-[10px] text-slate-400 group-hover/copy:text-blue-900 transition"></i>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">{item.status.replace(/_/g, ' ')}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
              <ImageCarousel urls={item.mediaUrls || [item.mediaUrl]} alt={item.title} />
              <p className="text-xs text-slate-500 mb-3">{item.location.address}</p>
              <div className="flex items-center justify-between gap-4">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.status === 'IN_PROGRESS' ? 'bg-blue-500 w-1/2' : 'bg-slate-300 w-1/4'}`}></div>
                </div>
                <button 
                  onClick={(e) => handleDownload(e, item.title)}
                  className="shrink-0 w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition"
                  title="Download Project Data"
                >
                  <i className="fas fa-download text-xs"></i>
                </button>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <i className="fas fa-search text-2xl mb-2"></i>
              <p className="text-sm font-bold">No projects match your filters.</p>
            </div>
          )}
        </div>
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
                  Download contractor papers, investor details, utilized/balance amounts, and submitter names.
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

export default ProjectStatus;
