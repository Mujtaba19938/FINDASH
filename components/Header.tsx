import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, Sun, Moon, Check, X, AlertCircle, Info, CheckCircle, Sparkles, LogOut, Menu } from 'lucide-react';
import { User } from 'firebase/auth';
import { NotificationItem } from '../types';

interface HeaderProps {
  title?: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notifications?: NotificationItem[];
  onMarkAsRead?: (id?: string) => void;
  onClearAll?: () => void;
  onChatToggle?: () => void;
  onLogout?: () => void;
  user?: User | null;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Dashboard', 
  isDarkMode, 
  toggleTheme,
  notifications = [],
  onMarkAsRead,
  onClearAll,
  onChatToggle,
  onLogout,
  user,
  onMenuToggle,
  isMenuOpen = false
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-brand-green" />;
      case 'warning': return <AlertCircle size={14} className="text-yellow-400" />;
      case 'alert': return <AlertCircle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 pt-2 relative z-40">
      <div className="flex items-center gap-4">
        {/* Burger Menu Button - Mobile Only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2.5 bg-dark-card rounded-xl text-secondary hover:text-primary transition-all hover:bg-dark-accent shadow-sm"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight transition-colors">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-dark-card text-primary pl-10 pr-4 py-2.5 rounded-xl w-64 focus:outline-none focus:ring-1 focus:ring-brand-green/50 placeholder-secondary text-sm transition-all border border-transparent focus:border-brand-green/50 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 border-l border-dark-border pl-6 transition-colors">
          <button 
            onClick={onChatToggle}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-green to-brand-greenDark text-black px-4 py-2 rounded-full font-bold text-xs hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] transition-all transform hover:-translate-y-0.5 mr-2"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-dark-card rounded-full text-secondary hover:text-primary transition-all hover:bg-dark-accent shadow-sm"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 bg-dark-card rounded-full transition-all shadow-sm relative ${showNotifications ? 'text-primary bg-dark-accent' : 'text-secondary hover:text-primary hover:bg-dark-accent'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-card animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-dark-card rounded-2xl shadow-xl border border-dark-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-dark-border flex justify-between items-center">
                  <h3 className="font-semibold text-primary text-sm">Notifications</h3>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => onMarkAsRead?.()} 
                        className="text-[10px] text-brand-green hover:underline font-medium"
                        title="Mark all as read"
                     >
                        Mark all read
                     </button>
                     <button 
                        onClick={onClearAll} 
                        className="text-[10px] text-secondary hover:text-red-400 transition-colors"
                        title="Clear all"
                     >
                        Clear
                     </button>
                  </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                   {notifications.length === 0 ? (
                      <div className="p-8 text-center text-secondary text-xs">
                         <Bell size={24} className="mx-auto mb-2 opacity-20" />
                         No new notifications
                      </div>
                   ) : (
                      <div className="flex flex-col">
                         {notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-3 border-b border-dark-border/50 hover:bg-dark-accent/30 transition-colors flex gap-3 ${!n.read ? 'bg-brand-green/5' : ''}`}
                            >
                               <div className="mt-1">
                                  {getNotificationIcon(n.type)}
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                     <h4 className={`text-xs font-semibold ${!n.read ? 'text-primary' : 'text-secondary'}`}>{n.title}</h4>
                                     <span className="text-[9px] text-secondary/70 whitespace-nowrap ml-2">{n.time}</span>
                                  </div>
                                  <p className="text-[10px] text-secondary mt-0.5 leading-relaxed">{n.message}</p>
                               </div>
                               {!n.read && (
                                  <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       onMarkAsRead?.(n.id);
                                    }}
                                    className="self-center p-1 hover:bg-brand-green/10 rounded-full text-brand-green opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Mark as read"
                                  >
                                     <Check size={12} />
                                  </button>
                               )}
                            </div>
                         ))}
                      </div>
                   )}
                </div>
                
                <div className="p-2 border-t border-dark-border bg-dark-accent/20 text-center">
                   <button className="text-[10px] text-secondary hover:text-primary transition-colors font-medium">View All Activity</button>
                </div>
              </div>
            )}
          </div>
          
          <button className="p-2.5 bg-dark-card rounded-full text-secondary hover:text-primary transition-all hover:bg-dark-accent shadow-sm">
            <Mail size={20} />
          </button>
          
          <button 
            onClick={onLogout}
            className="p-2.5 bg-dark-card rounded-full text-secondary hover:text-red-400 transition-all hover:bg-dark-accent shadow-sm"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
          
          <div className="flex items-center gap-3 ml-2">
            {user?.email && (
              <div className="hidden md:block text-right">
                <div className="text-xs font-medium text-primary">{user.displayName || user.email.split('@')[0]}</div>
                <div className="text-[10px] text-secondary">{user.email}</div>
              </div>
            )}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dark-card cursor-pointer hover:border-brand-green transition-all shadow-sm" title={user?.email || 'User'}>
              <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;