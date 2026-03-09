import React, { useEffect } from 'react';

interface LegalViewProps {
  type: 'terms' | 'privacy';
}

const LegalView: React.FC<LegalViewProps> = ({ type }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 md:p-12">
        {type === 'terms' ? (
          <>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Terms & Conditions</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Last Updated: February 2026</p>
            
            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and registering on the Public Project platform ("Platform"), you agree to be bound by these Terms and Conditions. This Platform is designed to facilitate civic engagement, infrastructure tracking, and project funding in compliance with the laws of India, including the Information Technology Act, 2000.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">2. User Roles & Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Citizens:</strong> Must provide accurate location (Pincode) and contact details. Fraudulent reporting of civic issues is strictly prohibited and may lead to account suspension.</li>
                  <li><strong>Contractors:</strong> Must upload valid GST Certificates and licensing documents. Any false documentation submitted will be reported to the relevant authorities under the Indian Penal Code (IPC).</li>
                  <li><strong>Investors:</strong> Must provide valid PAN and Incorporation Certificates. All investments are subject to regulatory compliance and the Platform acts solely as a facilitator.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">3. Data Accuracy & Public Information</h2>
                <p>
                  The Platform aggregates public infrastructure data. While we strive for accuracy, we do not guarantee the completeness of project statuses. Users agree not to misuse the data exported from this Platform for malicious purposes.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">4. Payments & Fees</h2>
                <p>
                  Any verification fees or premium subscription charges paid on the Platform are non-refundable. Payment processing is handled by secure third-party gateways in compliance with RBI guidelines.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">5. Limitation of Liability</h2>
                <p>
                  The Platform, its administrators, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the services, including but not limited to project delays or funding disputes.
                </p>
              </section>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Privacy Policy</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Compliance: DPDP Act 2023</p>
            
            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">1. Introduction</h2>
                <p>
                  Public Project ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform, in strict compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">2. Data Collection</h2>
                <p>We collect personal data necessary for the functioning of the civic platform:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Identity Data:</strong> Name, Email Address, Mobile Number.</li>
                  <li><strong>KYC Data:</strong> PAN, Aadhar, GST Certificates, and Incorporation Certificates (for Contractors and Investors).</li>
                  <li><strong>Location Data:</strong> Pincode and geo-coordinates for mapping civic issues.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">3. Purpose of Data Processing</h2>
                <p>Your data is processed solely for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verifying user identity to prevent spam and fraudulent reporting.</li>
                  <li>Connecting contractors and investors with verified public infrastructure projects.</li>
                  <li>Sending OTPs and critical platform notifications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">4. Data Sharing & Disclosure</h2>
                <p>
                  We do not sell your personal data. Data may be shared with:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Government Authorities:</strong> When required by law or for official civic project integration.</li>
                  <li><strong>Verified Entities:</strong> Limited project data is shared between verified contractors and investors to facilitate infrastructure development.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">5. Data Security & Retention</h2>
                <p>
                  We implement robust, industry-standard encryption to protect your data. KYC documents are stored securely and are only accessible by authorized administrators. Data is retained only as long as necessary to fulfill the purposes outlined in this policy or as required by Indian law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-3">6. User Rights</h2>
                <p>
                  Under the DPDP Act 2023, you have the right to access, correct, and request the erasure of your personal data. To exercise these rights, please contact our Data Protection Officer via the platform's support channels.
                </p>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LegalView;
