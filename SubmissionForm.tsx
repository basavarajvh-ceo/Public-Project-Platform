
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';

const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'school',
    type: 'proposal',
    location: '',
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncPendingProposals();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingProposals = () => {
    try {
      const pending = localStorage.getItem('civic_proposals_pending');
      if (pending) {
        const pendingProposals = JSON.parse(pending);
        const existing = localStorage.getItem('civic_proposals');
        const proposals = existing ? JSON.parse(existing) : [];
        
        const updatedProposals = [...pendingProposals, ...proposals];
        localStorage.setItem('civic_proposals', JSON.stringify(updatedProposals));
        localStorage.removeItem('civic_proposals_pending');
        
        alert(`Successfully synced ${pendingProposals.length} offline proposals!`);
      }
    } catch (e) {
      console.error("Failed to sync pending proposals", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaFiles.length === 0) {
      alert("Media upload is mandatory for proposal verification.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay for a realistic demo experience
    setTimeout(() => {
      const id = `PROP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newProposal = {
        id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: { address: formData.location },
        status: 'PENDING_REVIEW',
        budget: null,
        date: new Date().toISOString().split('T')[0]
      };

      try {
        if (isOffline) {
          const pending = localStorage.getItem('civic_proposals_pending');
          const pendingProposals = pending ? JSON.parse(pending) : [];
          pendingProposals.unshift(newProposal);
          localStorage.setItem('civic_proposals_pending', JSON.stringify(pendingProposals));
        } else {
          const existing = localStorage.getItem('civic_proposals');
          const proposals = existing ? JSON.parse(existing) : [];
          proposals.unshift(newProposal);
          localStorage.setItem('civic_proposals', JSON.stringify(proposals));
        }
      } catch (e) {
        console.error("Failed to save proposal locally", e);
      }

      setTrackingId(id);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Project Submitted!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your project proposal has been submitted to the platform validation engine. 
          Expect contractors to review this and prepare professional execution plans once validated.
        </p>
        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mb-8">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-2">Tracking ID</p>
          <p className="text-4xl font-mono font-bold text-slate-800 tracking-tighter">{trackingId}</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition"
        >
          Submit Another Project
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {isOffline && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded-r-lg flex items-center gap-3">
          <i className="fas fa-wifi-slash"></i>
          <div>
            <p className="font-bold">You are currently offline</p>
            <p className="text-sm">You can still submit proposals. They will be saved locally and synced automatically when your connection is restored.</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-blue-900 px-8 py-6 text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Submit New Project Proposal</h2>
          <p className="text-blue-100 opacity-80 text-sm">Submit your vision for rural infrastructure. Contractors will review these to build execution plans.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Proposal Category</label>
              <select 
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              >
                {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Pincode / Area</label>
              <input 
                type="text" 
                required
                maxLength={6}
                placeholder="6-digit Pincode"
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Project Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Solar Smart Lighting for Village Road"
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">What needs to be done?</label>
            <textarea 
              required
              rows={4}
              placeholder="Describe the proposal in detail. Why is this needed? Who will benefit?"
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Visual Evidence / Reference</label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${mediaFiles.length > 0 ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}>
              <input 
                type="file" 
                id="media-upload" 
                className="hidden" 
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="media-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <i className="fas fa-camera-retro text-slate-400 text-4xl mb-4"></i>
                  <p className="text-slate-600 font-bold uppercase tracking-tight">Upload Current Site Photos/Videos</p>
                  <p className="text-slate-400 text-xs">Mandatory for verifying proposal context</p>
                </div>
              </label>
            </div>
            
            {mediaFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Files ({mediaFiles.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="relative bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-center justify-between group">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <i className={`fas ${file.type.startsWith('video/') ? 'fa-video' : 'fa-image'} text-blue-500 text-xs shrink-0`}></i>
                        <span className="text-[10px] font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-red-500 transition shrink-0 ml-2"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 text-white font-black rounded-xl shadow-xl transition uppercase tracking-widest flex justify-center items-center ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-900 shadow-blue-100 hover:bg-blue-800'
            }`}
          >
            {isSubmitting ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</>
            ) : (
              "Submit Proposal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;
