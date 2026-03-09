
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { LogoSVG } from '../components/Logo';

interface LoginViewProps {
  onLogin: (role: UserRole, name: string) => void;
  isSignup?: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, isSignup: initialIsSignup }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(initialIsSignup || false);
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [step, setStep] = useState<'form' | 'otp' | 'payment' | 'pending'>('form');

  // Common Fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Citizen Specific
  const [pincode, setPincode] = useState('');
  
  // Investor Specific
  const [company, setCompany] = useState('');
  const [pastInvestments, setPastInvestments] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [sector, setSector] = useState('');

  // Contractor Specific
  const [experience, setExperience] = useState('');

  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showSmsToast, setShowSmsToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const resetForm = () => {
    setStep('form');
    setName('');
    setMobile('');
    setEmail('');
    setPincode('');
    setPassword('');
    setOtpInputs(['', '', '', '']);
    setCompany('');
    setPastInvestments('');
    setTargetAmount('');
    setSector('');
    setExperience('');
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock Backend Delay
    setTimeout(() => {
      setLoading(false);
      
      if (!isSignup) {
        // Sign In Logic
        // Backdoor for Admin & CEO
        if (email.toLowerCase() === 'ceo' || email.toLowerCase() === 'ceo@publicproject.in') {
          onLogin(UserRole.SUPER_ADMIN, 'Chief Executive Officer');
          navigate('/ceo');
          return;
        }
        if (email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@civic.gov') {
          onLogin(UserRole.ADMIN, 'System Admin');
          navigate('/admin');
          return;
        }

        if (step === 'form') {
          // Trigger SMS 2FA for all users logging in
          const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(newOtp);
          setShowSmsToast(true);
          setStep('otp');
          
          // Hide SMS toast after 8 seconds
          setTimeout(() => setShowSmsToast(false), 8000);
          return;
        } else if (step === 'otp') {
          const enteredOtp = otpInputs.join('');
          if (enteredOtp !== generatedOtp) {
            alert("Invalid OTP. Please check the code and try again.");
            return;
          }
          // Mock verification for existing users
          onLogin(role, email || 'User');
          navigate('/feed');
          return;
        }
      }

      // Helper to save user to local storage for Admin Panel
      const saveUserToAdminPanel = async (userData: any) => {
        try {
          const existing = localStorage.getItem('civic_registered_users');
          const users = existing ? JSON.parse(existing) : [];
          users.push({
            id: `u-${Date.now()}`,
            name: userData.name || userData.email,
            role: userData.role,
            email: userData.email || userData.mobile,
            docs: userData.role === UserRole.CITIZEN ? null : 'uploaded_docs.pdf',
            date: new Date().toISOString().split('T')[0],
            status: userData.role === UserRole.CITIZEN ? 'ACTIVE' : 'PENDING'
          });
          localStorage.setItem('civic_registered_users', JSON.stringify(users));
        } catch (e) {
          console.error("Could not save to local storage", e);
        }
      };

      // Sign Up Logic
      if (role === UserRole.CITIZEN) {
        if (step === 'form') {
          if (!agreedToTerms) {
            alert("You must agree to the Terms & Conditions and Privacy Policy.");
            setLoading(false);
            return;
          }
          if (!email) {
            alert("Email Address is required.");
            return;
          }
          if (!mobile || mobile.length !== 10) {
            alert("Valid 10-digit mobile number required.");
            return;
          }
          if (!pincode || pincode.length !== 6) {
            alert("Mandatory: Valid 6-digit Pincode required for location awareness.");
            return;
          }
          if (!password) {
            alert("Password is required.");
            return;
          }
          
          // Generate Mock Secure OTP
          const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(newOtp);
          setShowSmsToast(true);
          setStep('otp');
          
          // Hide SMS toast after 8 seconds
          setTimeout(() => setShowSmsToast(false), 8000);
          
        } else if (step === 'otp') {
          const enteredOtp = otpInputs.join('');
          if (enteredOtp !== generatedOtp) {
            alert("Invalid OTP. Please check the code and try again.");
            return;
          }
          saveUserToAdminPanel({ role: UserRole.CITIZEN, name, email, mobile });
          onLogin(UserRole.CITIZEN, name || email || 'Citizen');
          navigate('/feed');
        }
      } else {
        // Contractor and Investor require Payment then Admin Approval
        if (step === 'form') {
          if (!agreedToTerms) {
            alert("You must agree to the Terms & Conditions and Privacy Policy.");
            setLoading(false);
            return;
          }
          setStep('payment');
        } else if (step === 'payment') {
          saveUserToAdminPanel({ role, name: company || name, email, mobile });
          setStep('pending');
        }
      }
    }, 1000);
  };

  const renderRoleSelector = () => (
    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
      {[
        { id: UserRole.CITIZEN, label: 'Citizen', icon: 'fa-user' },
        { id: UserRole.CONTRACTOR, label: 'Contractor', icon: 'fa-hard-hat' },
        { id: UserRole.INVESTOR, label: 'Investor', icon: 'fa-coins' },
      ].map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => { setRole(r.id); setStep('form'); }}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
            role === r.id ? 'bg-white text-blue-900 shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className={`fas ${r.icon} text-lg`}></i>
          {r.label}
        </button>
      ))}
    </div>
  );

  if (step === 'pending') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <i className="fas fa-clock"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Registration Pending</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Payment successful! As a <b>{role}</b>, your profile requires document verification by the Civic Authority. 
            You will be able to sign in once the admin approves your professional credentials.
          </p>
          <button 
            onClick={() => { setIsSignup(false); setStep('form'); }}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    const fee = role === UserRole.CONTRACTOR ? '₹1,000' : '₹5,000';
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fas fa-credit-card"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Platform Registration Fee</h2>
            <p className="text-slate-500 text-sm mt-2">One-time verification fee for {role}s</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-bold">Registration Fee</span>
              <span className="text-xl font-black text-slate-900">{fee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">GST (18%)</span>
              <span className="text-slate-700 font-bold">Included</span>
            </div>
            <div className="border-t border-slate-200 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-800 font-black">Total Amount</span>
              <span className="text-2xl font-black text-blue-900">{fee}</span>
            </div>
          </div>

          <form onSubmit={handleAction} className="space-y-4">
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              placeholder="Card Number"
              defaultValue="4111 1111 1111 1111"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="MM/YY"
                defaultValue="12/25"
              />
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="CVV"
                defaultValue="123"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-900 text-white font-black rounded-[1.5rem] shadow-xl hover:bg-blue-800 transition flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : `Pay ${fee} & Submit`}
            </button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-xs font-bold text-slate-400 hover:text-blue-900 transition mt-4"
            >
              Back to Details
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50 relative overflow-hidden">
      
      {/* Mock SMS Notification Toast */}
      {showSmsToast && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 z-50 animate-bounce w-[90%] max-w-sm flex gap-4 items-start">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <i className="fas fa-comment-sms text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Messages • Just now</p>
            <p className="text-sm text-slate-800 font-medium leading-snug">
              Your Public Project verification code is <span className="font-black text-blue-900 text-lg mx-1">{generatedOtp}</span>. Do not share this with anyone.
            </p>
          </div>
          <button onClick={() => setShowSmsToast(false)} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <LogoSVG className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {isSignup ? 'Portal Registration' : 'Account Access'}
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button 
              type="button"
              onClick={() => { setIsSignup(false); resetForm(); }}
              className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition ${!isSignup ? 'text-blue-900 border-blue-900' : 'text-slate-400 border-transparent'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setIsSignup(true); resetForm(); }}
              className={`text-xs font-black uppercase tracking-widest pb-1 border-b-2 transition ${isSignup ? 'text-blue-900 border-blue-900' : 'text-slate-400 border-transparent'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {isSignup && renderRoleSelector()}

        <form onSubmit={handleAction} className="space-y-4">
          {step === 'form' ? (
            <>
              <div className="space-y-4">
                {!isSignup ? (
                  // SIGN IN FIELDS
                  <>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Email or Mobile Number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </>
                ) : (
                  // SIGN UP FIELDS
                  <>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder={role === UserRole.CITIZEN ? "Full Name" : role === UserRole.INVESTOR ? "Investor / Firm Name" : "Contractor / Agency Name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="email"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    
                    {role === UserRole.CITIZEN && (
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full px-5 py-4 bg-slate-50 border border-blue-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black tracking-widest placeholder:font-medium placeholder:tracking-normal"
                        placeholder="Mandatory: Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      />
                    )}

                    {/* Investor Detailed Fields */}
                    {role === UserRole.INVESTOR && (
                      <div className="space-y-4 pt-2">
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          placeholder="Company / Organization"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                           <input
                            type="text"
                            required
                            className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                            placeholder="Target Invest (₹)"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                          />
                           <input
                            type="text"
                            required
                            className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                            placeholder="Sector (e.g. Roads)"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                          />
                        </div>
                        <textarea
                          required
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          placeholder="Details of Past Investments"
                          rows={2}
                          value={pastInvestments}
                          onChange={(e) => setPastInvestments(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border-2 border-dashed border-blue-100 bg-blue-50 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-2">PAN (Personal/Company)</p>
                            <input type="file" accept=".pdf,.jpg,.png" required className="text-[10px] w-full" />
                          </div>
                          <div className="p-4 border-2 border-dashed border-blue-100 bg-blue-50 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-2">Aadhar / Inc. Cert.</p>
                            <input type="file" accept=".pdf,.jpg,.png" required className="text-[10px] w-full" />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Admin review of KYC documents is mandatory.</p>
                      </div>
                    )}

                    {/* Contractor Detailed Documents */}
                    {role === UserRole.CONTRACTOR && (
                      <div className="space-y-4 pt-2">
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                          placeholder="Years of Experience"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border-2 border-dashed border-blue-100 bg-blue-50 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-2">Upload GST Certificate</p>
                            <input type="file" accept=".pdf,.jpg,.png" required className="text-[10px] w-full" />
                          </div>
                          <div className="p-4 border-2 border-dashed border-blue-100 bg-blue-50 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-2">Upload License Doc</p>
                            <input type="file" accept=".pdf,.jpg,.png" required className="text-[10px] w-full" />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Admin review of professional documents is mandatory.</p>
                      </div>
                    )}

                    <input
                      type="password"
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-start gap-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                        I agree to the <a href="#/terms" target="_blank" className="text-blue-900 font-bold hover:underline">Terms & Conditions</a> and <a href="#/privacy" target="_blank" className="text-blue-900 font-bold hover:underline">Privacy Policy</a>, and confirm that the information provided is accurate under the Information Technology Act, 2000.
                      </label>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-orange-500 text-white font-black rounded-[1.5rem] shadow-xl shadow-orange-200 hover:bg-orange-600 transition flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <>
                    {isSignup ? (role === UserRole.CITIZEN ? 'Generate OTP' : 'Continue to Payment') : 'Sign In to Portal'}
                    <i className="fas fa-arrow-right text-xs"></i>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Enter 4-digit code sent to</p>
                <p className="font-black text-blue-900">{isSignup ? `+91 ${mobile}` : email}</p>
              </div>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otpInputs[index]}
                    className="w-14 h-16 text-center text-3xl font-black border-2 border-slate-200 bg-slate-50 rounded-2xl focus:border-blue-900 focus:bg-white outline-none transition"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newInputs = [...otpInputs];
                      newInputs[index] = val;
                      setOtpInputs(newInputs);
                      
                      // Auto-focus next input
                      if (val && index < 3) {
                        const next = document.getElementById(`otp-${index + 1}`);
                        if (next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Auto-focus previous input on backspace
                      if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
                        const prev = document.getElementById(`otp-${index - 1}`);
                        if (prev) prev.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-orange-500 text-white font-black rounded-2xl shadow-xl hover:bg-orange-600 transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Complete Verification'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setOtpInputs(['', '', '', '']);
                  setShowSmsToast(false);
                }}
                className="w-full text-xs font-bold text-slate-400 hover:text-blue-900 transition"
              >
                Change Details
              </button>
            </div>
          )}
        </form>
        
        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Securing Indian Civic Infrastructure
        </p>
      </div>
    </div>
  );
};

export default LoginView;
