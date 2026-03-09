
import React, { useState } from 'react';
import { MOCK_ISSUES } from '../constants';
import { IssueStatus, CivicItem } from '../types';

interface ContractorDashboardProps {
  pincode?: string;
}

const ContractorDashboard: React.FC<ContractorDashboardProps> = ({ pincode }) => {
  const [items, setItems] = useState<CivicItem[]>(MOCK_ISSUES);
  const [activeTab, setActiveTab] = useState<'nearby_proposals' | 'my_active' | 'my_profile'>('nearby_proposals');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [profileDocs, setProfileDocs] = useState<{ gst: File | null, license: File | null }>({ gst: null, license: null });
  const [experience, setExperience] = useState<string>('5');
  const [portfolioLink, setPortfolioLink] = useState<string>('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'Pending Verification' | 'Verified' | 'Rejected'>('Pending Verification');

  const handleProposalSubmit = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: IssueStatus.PROPOSAL_UNDER_REVIEW, proposalUrl: '#uploaded-ppt' } : item));
    setUploadingFor(null);
    alert("Project PPT submitted! It is now visible to investors once Admin approves the structure.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Contractor Execution Hub</h2>
          <p className="text-slate-500">Respond to citizen proposals, prepare execution plans (PPT), and secure funding.</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button 
            onClick={() => setActiveTab('nearby_proposals')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'nearby_proposals' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
          >
            Nearby Proposals
          </button>
          <button 
            onClick={() => setActiveTab('my_active')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'my_active' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
          >
            My Active Plans
          </button>
          <button 
            onClick={() => setActiveTab('my_profile')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'my_profile' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
          >
            My Profile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        {activeTab === 'nearby_proposals' ? (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">Citizen Proposals Near {pincode || 'You'}</h3>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Direct Response Mode</span>
            </div>
            {verificationStatus === 'Pending Verification' ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fas fa-clock"></i>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Profile Under Review</h4>
                <p className="text-slate-500 max-w-md mx-auto">Your contractor profile and documents are currently being verified by the administration. You will be able to apply for projects once verified.</p>
              </div>
            ) : verificationStatus === 'Rejected' ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Verification Rejected</h4>
                <p className="text-slate-500 max-w-md mx-auto mb-6">There was an issue verifying your professional documents. Please update your GST and License documents in your profile.</p>
                <button 
                  onClick={() => setActiveTab('my_profile')}
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-900 transition"
                >
                  Update Documents
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {items.filter(i => i.status === IssueStatus.CITIZEN_SUBMITTED || i.status === IssueStatus.OPEN_FOR_PROPOSAL).map(item => (
                  <div key={item.id} className="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-900 px-2 py-1 rounded uppercase">{item.category}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.createdAt}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2 leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-3">{item.description}</p>
                    
                    <div className="mt-auto">
                      {uploadingFor === item.id ? (
                        <div className="space-y-3 pt-2">
                          <div className="border-2 border-dashed border-blue-200 p-4 rounded-xl bg-blue-50 text-center">
                            <p className="text-[10px] font-bold text-blue-900 uppercase">Attach Project PPT</p>
                            <input type="file" className="mt-2 text-[10px] w-full" />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleProposalSubmit(item.id)}
                              className="flex-1 py-2 bg-blue-900 text-white text-[10px] font-black uppercase rounded-lg"
                            >
                              Submit to Portal
                            </button>
                            <button 
                              onClick={() => setUploadingFor(null)}
                              className="px-4 py-2 border border-slate-200 text-[10px] font-black uppercase rounded-lg"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setUploadingFor(item.id)}
                          className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-900 transition tracking-widest"
                        >
                          Prepare Execution Plan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === 'my_active' ? (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">Funding & Execution Status</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {items.filter(i => [IssueStatus.PROPOSAL_UNDER_REVIEW, IssueStatus.FUNDING_PHASE, IssueStatus.IN_PROGRESS].includes(i.status)).map(item => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><i className="fas fa-map-pin text-[10px]"></i> {item.location.address}</p>
                  </div>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Project Stage</span>
                      <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter">{item.status.replace('_', ' ')}</span>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${item.status === IssueStatus.IN_PROGRESS ? 'bg-green-500 w-full' : 'bg-blue-400 w-1/2'}`}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Investor Interest</p>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${item.investorStatus === 'INTERESTED' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
                      {item.investorStatus || 'AWAITING REVIEWS'}
                    </span>
                  </div>
                </div>
              ))}
              {items.filter(i => [IssueStatus.PROPOSAL_UNDER_REVIEW, IssueStatus.FUNDING_PHASE, IssueStatus.IN_PROGRESS].includes(i.status)).length === 0 && (
                <div className="p-24 text-center text-slate-400 text-sm font-bold">You haven't prepared any execution plans yet.</div>
              )}
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">Contractor Profile & Documents</h3>
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' :
                verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {verificationStatus}
              </span>
            </div>
            <div className="p-8 max-w-2xl mx-auto">
              {profileSaved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Profile and documents updated successfully.
                </div>
              )}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Years of Experience</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Portfolio / Case Studies Link</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Professional Documents</h4>
                  <p className="text-xs text-slate-500 mb-4">Upload your GST certificate and professional licenses to get verified by the platform administration.</p>
                  
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">GST Certificate</p>
                          <p className="text-xs text-slate-500">{profileDocs.gst ? profileDocs.gst.name : 'Not uploaded'}</p>
                        </div>
                      </div>
                      <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition">
                        {profileDocs.gst ? 'Change' : 'Upload'}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setProfileDocs({...profileDocs, gst: e.target.files[0]});
                              setProfileSaved(false);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center">
                          <i className="fas fa-id-card"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Contractor License</p>
                          <p className="text-xs text-slate-500">{profileDocs.license ? profileDocs.license.name : 'Not uploaded'}</p>
                        </div>
                      </div>
                      <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition">
                        {profileDocs.license ? 'Change' : 'Upload'}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setProfileDocs({...profileDocs, license: e.target.files[0]});
                              setProfileSaved(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      if (!profileDocs.gst || !profileDocs.license) {
                        alert('Please upload both GST and License documents.');
                        return;
                      }
                      if (!experience) {
                        alert('Please enter your years of experience.');
                        return;
                      }
                      setProfileSaved(true);
                      setVerificationStatus('Pending Verification');
                      alert('Profile and documents submitted for verification.');
                    }}
                    className="w-full py-3 bg-blue-900 text-white font-black rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-800 transition uppercase tracking-widest"
                  >
                    Save Profile & Submit Docs
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
