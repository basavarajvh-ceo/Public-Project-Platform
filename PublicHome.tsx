
import React from 'react';
import { Link } from 'react-router-dom';

const PublicHome: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:flex lg:items-center lg:gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Rural Infrastructure <span className="text-orange-500">Exchange & Monitoring Platform</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            A unified platform connecting Public Users, Contractors, and Investors/CSR Entities to build better rural infrastructure. Submit projects, execute proposals, and fund development in real-time.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/feed" className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transition transform hover:-translate-y-0.5">
              Browse Projects
            </Link>
            <Link to="/signup" className="px-6 py-3 bg-white text-orange-600 border border-orange-200 font-semibold rounded-lg shadow-sm hover:bg-orange-50 transition">
              Submit Project
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-100">
            <div>
              <p className="text-3xl font-bold text-slate-900">4.2k+</p>
              <p className="text-slate-500 text-sm">Resolved Issues</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">₹128Cr</p>
              <p className="text-slate-500 text-sm">Funds Managed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">180+</p>
              <p className="text-slate-500 text-sm">Verified Contractors</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 mt-12 lg:mt-0">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-900 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop" 
              alt="Hospital Infrastructure" 
              className="relative rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <p className="text-sm font-bold">New Project Approved</p>
                  <p className="text-xs text-slate-500">District Hospital Construction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24 grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center text-xl mb-6">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">Public Users</h3>
          <p className="text-slate-600 mb-6">Submit new project proposals with location, description, and priority level. Track and monitor progress publicly on the Community Platform.</p>
          <Link to="/login" className="text-blue-900 font-semibold hover:underline flex items-center gap-2">
            Get Started <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-6">
            <i className="fas fa-hard-hat"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">Contractors</h3>
          <p className="text-slate-600 mb-6">Receive notifications for validated projects. Submit proposals, execute projects, and provide progress updates via the Project Dashboard.</p>
          <Link to="/login" className="text-orange-600 font-semibold hover:underline flex items-center gap-2">
            Partner With Us <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
        <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center text-xl mb-6">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="text-xl font-bold mb-4">Investors / CSR Entities</h3>
          <p className="text-slate-600 mb-6">Review and invest in validated projects. Monitor execution data and contractor performance through the Funding & CSR Portal.</p>
          <Link to="/login" className="text-slate-800 font-semibold hover:underline flex items-center gap-2">
            Invest in Future <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
