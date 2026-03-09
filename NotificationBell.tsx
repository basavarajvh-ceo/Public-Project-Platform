import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface NotificationBellProps {
  role: UserRole;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate mock notifications based on role
    const mockNotifications: Notification[] = [];
    
    if (role === UserRole.CITIZEN) {
      mockNotifications.push(
        { id: 'n1', title: 'Project Approved', message: 'Your proposal "New Primary School" has been approved for funding.', date: '2 hours ago', read: false, type: 'success' },
        { id: 'n2', title: 'New Proposal Nearby', message: 'A new proposal "Community Center Infrastructure" was submitted in your area.', date: '1 day ago', read: true, type: 'info' }
      );
    } else if (role === UserRole.CONTRACTOR) {
      mockNotifications.push(
        { id: 'n3', title: 'Verification Successful', message: 'Your contractor profile has been verified by the admin.', date: 'Just now', read: false, type: 'success' },
        { id: 'n4', title: 'New Opportunity', message: 'A new project "MG Road Pedestrian Bridge" is open for proposals.', date: '3 hours ago', read: false, type: 'info' }
      );
    } else if (role === UserRole.INVESTOR) {
      mockNotifications.push(
        { id: 'n5', title: 'Project Update', message: 'The project "Solar Street Lights" you funded is now 50% complete.', date: '5 hours ago', read: false, type: 'info' },
        { id: 'n6', title: 'New Investment Opportunity', message: 'A new project "Community Water Purification Plant" is seeking funding.', date: '1 day ago', read: true, type: 'info' }
      );
    } else if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      mockNotifications.push(
        { id: 'n7', title: 'Pending Approvals', message: 'You have 3 new user registrations awaiting verification.', date: '10 mins ago', read: false, type: 'warning' },
        { id: 'n8', title: 'New Proposal Submitted', message: 'A citizen submitted a new proposal "New Primary School".', date: '1 hour ago', read: false, type: 'info' }
      );
    }

    setNotifications(mockNotifications);
  }, [role]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-900 hover:bg-slate-50 rounded-full transition"
      >
        <i className="fas fa-bell text-lg"></i>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-blue-900 hover:underline uppercase tracking-widest"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mt-1">
                      {notification.type === 'success' && <i className="fas fa-check-circle text-green-500"></i>}
                      {notification.type === 'info' && <i className="fas fa-info-circle text-blue-500"></i>}
                      {notification.type === 'warning' && <i className="fas fa-exclamation-circle text-amber-500"></i>}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {notification.message}
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                        {notification.date}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-900 rounded-full mt-1.5 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <i className="fas fa-bell-slash text-2xl mb-2"></i>
                <p className="text-xs font-bold uppercase tracking-widest">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
