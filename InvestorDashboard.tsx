
import React, { useState } from 'react';
import { MOCK_ISSUES } from '../constants';
import { IssueStatus, CivicItem, InvestorInterestStatus } from '../types';

const InvestorDashboard: React.FC = () => {
  const [items, setItems] = useState<CivicItem[]>(MOCK_ISSUES);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'my_interests' | 'funded_history'>('opportunities');

  // Mock data for funded history
  const mockFundedHistory = [
    { id: 'FND-1001', title: 'Solar Street Lights - Sector 4', amount: 1500000, date: '2023-08-15', status: 'COMPLETED', impact: '1,200 residents benefited, 40% reduction in night accidents.' },
    { id: 'FND-1002', title: 'Primary School Renovation', amount: 3500000, date: '2023-10-20', status: 'IN_PROGRESS', impact: 'Expected completion in 2 months. Will serve 450 students.' },
    { id: 'FND-1003', title: 'Community Water Purification Plant', amount: 800000, date: '2023-05-10', status: 'COMPLETED', impact: 'Providing clean drinking water to 3 villages.' },
  ];

  const setInterest = (id: string, status: InvestorInterestStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, investorStatus: status } : item));
    alert(`Status updated to ${status}. Contractor notified.`);
  };

  const handleFundProject = async (item: CivicItem) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: item.id,
          projectTitle: item.title,
          amount: item.budget || 100000, // Default to 1L if no budget
        }),
      });

      const data = await response.json();
      
      if (data.orderId) {
        // Razorpay Checkout
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Public Project",
          description: `Funding for ${item.title}`,
          order_id: data.orderId,
          handler: function (response: any) {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            setItems(items.map(i => i.id === item.id ? { ...i, status: IssueStatus.IN_PROGRESS } : i));
            setActiveTab('funded_history');
          },
          prefill: {
            name: "Investor",
            email: "investor@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#1e3a8a" // blue-900
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (data.mockUrl) {
        // Fallback if Razorpay isn't configured
        alert(data.message);
        setItems(items.map(i => i.id === item.id ? { ...i, status: IssueStatus.IN_PROGRESS } : i));
        setActiveTab('funded_history');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Investment Opportunity Board</h2>
          <p className="text-slate-500">Review feasibility reports and contractor PPTs to fund urban development.</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button 
            onClick={() => setActiveTab('opportunities')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'opportunities' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            New Opportunities
          </button>
          <button 
            onClick={() => setActiveTab('my_interests')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'my_interests' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            My Interests
          </button>
          <button 
            onClick={() => setActiveTab('funded_history')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition ${activeTab === 'funded_history' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Funded History
          </button>
        </div>
      </div>

      {activeTab === 'funded_history' ? (
        <div className="space-y-6">
          {mockFundedHistory.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-blue-300 transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{project.id}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-800'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">{project.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-slate-400"></i> Funded on {project.date}
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Invested</p>
                <p className="text-2xl font-black text-slate-900">₹{project.amount.toLocaleString()}</p>
              </div>

              <div className="flex-1 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Civic Impact / Returns</p>
                <p className="text-xs font-bold text-blue-950 leading-relaxed">{project.impact}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(i => activeTab === 'opportunities' ? i.status === IssueStatus.FUNDING_PHASE : i.investorStatus && i.investorStatus !== 'NONE').map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col relative">
              {item.investorStatus && item.investorStatus !== 'NONE' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    item.investorStatus === 'INTERESTED' ? 'bg-green-100 text-green-700' :
                    item.investorStatus === 'WAITING' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.investorStatus}
                  </span>
                </div>
              )}
              <div className="p-6 border-b border-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-2 py-1 rounded uppercase">{item.category}</span>
                  <span className="text-sm font-black text-slate-900 mt-1">₹{item.budget?.toLocaleString() || 'TBD'}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 mb-6">{item.description}</p>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Contractor Document</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-file-powerpoint text-orange-500 text-xl"></i>
                      <span className="text-xs font-bold text-slate-700">Project_Plan_V1.ppt</span>
                    </div>
                    <button className="text-blue-900 text-xs font-bold hover:underline">Download</button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 mt-auto">
                <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase text-center">Your Response</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button 
                    onClick={() => setInterest(item.id, 'INTERESTED')}
                    className={`py-2 rounded-lg text-[10px] font-bold transition ${item.investorStatus === 'INTERESTED' ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-600'}`}
                  >
                    Interested
                  </button>
                  <button 
                    onClick={() => setInterest(item.id, 'WAITING')}
                    className={`py-2 rounded-lg text-[10px] font-bold transition ${item.investorStatus === 'WAITING' ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600'}`}
                  >
                    Waiting
                  </button>
                  <button 
                    onClick={() => setInterest(item.id, 'DECLINED')}
                    className={`py-2 rounded-lg text-[10px] font-bold transition ${item.investorStatus === 'DECLINED' ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                  >
                    Decline
                  </button>
                </div>
                {item.investorStatus === 'INTERESTED' && (
                  <button 
                    onClick={() => handleFundProject(item)}
                    className="w-full py-3 rounded-lg text-xs font-black uppercase tracking-widest bg-blue-900 text-white hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md shadow-blue-200"
                  >
                    <i className="fas fa-credit-card"></i> Fund Project Now
                  </button>
                )}
              </div>
            </div>
          ))}
          {items.filter(i => activeTab === 'opportunities' ? i.status === IssueStatus.FUNDING_PHASE : i.investorStatus && i.investorStatus !== 'NONE').length === 0 && (
            <div className="col-span-full py-24 text-center">
              <i className="fas fa-briefcase text-5xl text-slate-200 mb-4"></i>
              <p className="text-slate-400 font-medium">
                {activeTab === 'opportunities' ? 'No projects currently seeking investment.' : 'You have not marked interest in any projects yet.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;
