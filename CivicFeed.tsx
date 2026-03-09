
import React, { useState } from 'react';
import { MOCK_ISSUES, CATEGORIES } from '../constants';
import { IssueStatus, AuthState, UserRole } from '../types';

interface CivicFeedProps {
  auth?: AuthState;
  onUpgrade?: () => void;
}

const ImageCarousel: React.FC<{ urls: string[], alt: string }> = ({ urls, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!urls || urls.length === 0) return null;
  if (urls.length === 1) {
    return <img src={urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={alt} />;
  }

  return (
    <div className="relative w-full h-full group/carousel">
      <img src={urls[currentIndex]} className="w-full h-full object-cover transition duration-500" alt={`${alt} - ${currentIndex + 1}`} />
      
      <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1)); }}
          className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1)); }}
          className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
        {urls.map((_, idx) => (
          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

const CivicFeed: React.FC<CivicFeedProps> = ({ auth, onUpgrade }) => {
  const pincode = auth?.user?.pincode;
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showNearby, setShowNearby] = useState(!!pincode);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user) {
      alert('Please sign in to download data.');
      return;
    }

    if (auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.SUPER_ADMIN) {
      alert('Downloading complete project data (Admin Access)...');
      return;
    }

    if (auth.user.role === UserRole.INVESTOR || auth.user.role === UserRole.CONTRACTOR) {
      if (auth.user.isPremium) {
        alert('Downloading High-End Data: Material purchased, Employee logs, Confidential financials...');
      } else {
        setShowPremiumModal(true);
      }
      return;
    }

    // Citizens
    if (auth.user.isPremium) {
      alert('Downloading Public Data: Contractor papers, Investor details, Utilized/Balance amount, Submitter name...');
    } else {
      setShowPremiumModal(true);
    }
  };

  const getStatusDisplay = (status: IssueStatus) => {
    switch(status) {
      case IssueStatus.CITIZEN_SUBMITTED: return { label: 'New Proposal', color: 'bg-yellow-100 text-yellow-700' };
      case IssueStatus.OPEN_FOR_PROPOSAL: return { label: 'Awaiting Execution PPT', color: 'bg-blue-100 text-blue-700' };
      case IssueStatus.PROPOSAL_UNDER_REVIEW: return { label: 'Admin PPT Review', color: 'bg-orange-100 text-orange-600' };
      case IssueStatus.FUNDING_PHASE: return { label: 'Investment Phase', color: 'bg-blue-100 text-blue-800' };
      case IssueStatus.IN_PROGRESS: return { label: 'Work In Progress', color: 'bg-orange-100 text-orange-700' };
      case IssueStatus.COMPLETED: return { label: 'Completed', color: 'bg-green-100 text-green-700' };
      default: return { label: 'Logged', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const filteredIssues = MOCK_ISSUES.filter(i => {
    const categoryMatch = filter === 'all' || i.category === filter;
    const statusMatch = statusFilter === 'all' || i.status === statusFilter;
    
    let dateMatch = true;
    if (startDate) {
      dateMatch = dateMatch && new Date(i.createdAt) >= new Date(startDate);
    }
    if (endDate) {
      dateMatch = dateMatch && new Date(i.createdAt) <= new Date(endDate);
    }

    // Mock logic: if showNearby is true, filter by pincode (item 101/102 are marked nearby in this mock)
    const nearbyMatch = !showNearby || i.location.pincode === pincode || i.id.includes('101'); 
    return categoryMatch && statusMatch && dateMatch && nearbyMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Public Proposals Feed</h2>
          <p className="text-slate-500">View and track citizen-raised development proposals.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {pincode && (
            <button 
              onClick={() => setShowNearby(!showNearby)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition ${showNearby ? 'bg-blue-900 text-white border-blue-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200'}`}
            >
              <i className="fas fa-location-arrow mr-2"></i> Nearby {pincode}
            </button>
          )}
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredIssues.map(item => {
          const status = getStatusDisplay(item.status);
          return (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group hover:-translate-y-1 transition duration-300">
              <div className="relative h-56 overflow-hidden">
                <ImageCarousel urls={item.mediaUrls || [item.mediaUrl]} alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${status.color}`}>
                    {status.label}
                  </span>
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg w-fit group/copy cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(item.id);
                    alert(`Tracking ID ${item.id} copied to clipboard!`);
                  }}>
                    <span className="text-[9px] font-mono font-bold text-slate-700">{item.id}</span>
                    <i className="fas fa-copy text-[10px] text-slate-400 group-hover/copy:text-blue-900 transition"></i>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold opacity-80 mb-1 uppercase tracking-widest">{item.category}</p>
                  <h3 className="text-lg font-black leading-tight">{item.title}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-auto pt-4 border-t border-slate-50">
                  <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt text-blue-500"></i> {item.location.address}</span>
                  <span>{item.createdAt}</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="flex-grow bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-900 h-full transition-all duration-1000" 
                      style={{ 
                        width: item.status === IssueStatus.CITIZEN_SUBMITTED ? '15%' : 
                               item.status === IssueStatus.OPEN_FOR_PROPOSAL ? '35%' :
                               item.status === IssueStatus.PROPOSAL_UNDER_REVIEW ? '55%' :
                               item.status === IssueStatus.FUNDING_PHASE ? '75%' :
                               item.status === IssueStatus.IN_PROGRESS ? '90%' : '100%'
                      }}
                    ></div>
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="shrink-0 w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition"
                    title="Download Project Data"
                  >
                    <i className="fas fa-download text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredIssues.length === 0 && (
        <div className="py-32 text-center text-slate-400">
           <i className="fas fa-search text-4xl mb-4"></i>
           <p className="font-bold">No proposals found for your location/filter.</p>
        </div>
      )}

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
    </div>
  );
};

export default CivicFeed;
