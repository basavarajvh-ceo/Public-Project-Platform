
import React from 'react';

const SystemArchitecture: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">System Architecture Overview</h2>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded flex items-center justify-center shrink-0"><i className="fas fa-layer-group"></i></div>
                    <div>
                      <h4 className="font-bold">Multi-Tenant Frontend</h4>
                      <p className="text-sm text-slate-600">Unified React interface with strictly isolated role-based navigation and persistent storage contexts.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded flex items-center justify-center shrink-0"><i className="fas fa-microchip"></i></div>
                    <div>
                      <h4 className="font-bold">Logic Layer</h4>
                      <p className="text-sm text-slate-600">Asynchronous workflow handling for citizen submissions, contractor bidding, and investor tracking.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-900 rounded flex items-center justify-center shrink-0"><i className="fas fa-shield-halved"></i></div>
                    <div>
                      <h4 className="font-bold">Immutable Audit Logs</h4>
                      <p className="text-sm text-slate-600">Critical lifecycle events are hashed and recorded to prevent post-completion modifications.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl overflow-hidden font-mono text-xs text-green-400">
                <p className="text-slate-500 mb-2">// Architecture flow</p>
                <p>Citizen -&gt; [Submit with Media] -&gt; Admin [Review &amp; Approve]</p>
                <p>Admin -&gt; [Create Project] -&gt; Contractor [Bid]</p>
                <p>Contractor -&gt; [Submit Milestones] -&gt; Public [View Status]</p>
                <p>Investor -&gt; [Fund Project] -&gt; Real-time [Dashboard Updates]</p>
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <p className="text-blue-400">Services:</p>
                  <p>- MediaService: S3/CDN + Cloudinary</p>
                  <p>- AuthSrv: JWT-based Role Isolation</p>
                  <p>- NotifSrv: Multi-channel SMS/Email</p>
                  <p>- GeoSrv: Map Box/Google Maps Integration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Database Schema (Role-Wise)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-users text-blue-900"></i> Citizens & Items</h4>
              <div className="space-y-2 text-sm font-mono bg-slate-50 p-3 rounded">
                <p>Table: users (Citizen)</p>
                <p>- id (UUID)</p>
                <p>- role (Enum)</p>
                <p>Table: submissions</p>
                <p>- id (TrackingID)</p>
                <p>- type (Enum)</p>
                <p>- media_refs (Array)</p>
                <p>- geo_loc (Point)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-hard-hat text-orange-500"></i> Contractor Entity</h4>
              <div className="space-y-2 text-sm font-mono bg-slate-50 p-3 rounded">
                <p>Table: contractor_profiles</p>
                <p>- id (FK: users.id)</p>
                <p>- company_gst (String)</p>
                <p>- portfolio_url (String)</p>
                <p>- is_verified (Bool)</p>
                <p>Table: project_bids</p>
                <p>- project_id (FK)</p>
                <p>- amount (Decimal)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-coins text-blue-600"></i> Investor Entity</h4>
              <div className="space-y-2 text-sm font-mono bg-slate-50 p-3 rounded">
                <p>Table: investor_profiles</p>
                <p>- id (FK: users.id)</p>
                <p>- intent_score (Int)</p>
                <p>- total_funded (Decimal)</p>
                <p>Table: investments</p>
                <p>- investor_id (FK)</p>
                <p>- project_id (FK)</p>
                <p>- roi_indicator (Percent)</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-950 mb-4">Indian Civic Deployment Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-blue-900">Compliance & Localization</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                <li>Integration with DigiLocker for document verification.</li>
                <li>Support for 12+ Indian Regional Languages (i18n).</li>
                <li>Offline-first mobile mode for areas with spotty connectivity.</li>
                <li>Direct linkage with MyGov API for existing grievance metrics.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-blue-900">Scaling Strategy</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                <li>Phase 1: Tier 1 Smart Cities (Pilot).</li>
                <li>Phase 2: District-wide aggregation (ULBs).</li>
                <li>Phase 3: National Dashboard with inter-state benchmarking.</li>
                <li>Public-Private Partnership (PPP) model incentivization.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SystemArchitecture;
