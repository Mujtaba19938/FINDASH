import React from 'react';
import { LayoutDashboard, Calendar, FileText, Wallet, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Calendar, label: 'Schedule' },
  { icon: FileText, label: 'Invoices' },
  { icon: Wallet, label: 'My Cards' },
  { icon: Settings, label: 'Settings' },
];

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Inner Sphere */}
    <circle cx="58" cy="58" r="16" />
    
    {/* Outer Crescent */}
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95C65.5 95 79.2 87.1 87.5 75C80 78 72 80 64 80C39.1472 80 19 59.8528 19 35C19 28.5 20.5 22.3 23.1 16.8C30.5 9.5 40 5 50 5ZM85 25C80 20 72 15 64 15C68 18 71 22 73 26C78 24 82 24.5 85 25Z" 
    />
    <path 
       d="M50 5C74.8528 5 95 25.1472 95 50C95 55 94.2 59.8 92.7 64.3C88.5 54 82 45 73.5 38C82 32 89 22 92 10C80 5 65 2 50 5Z"
       opacity="0.2"
    />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, activePage, onNavigate }) => {
  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-20'} bg-dark-bg h-screen flex flex-col py-8 border-r border-dark-border fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button Area */}
      <div className="mb-12 flex justify-center w-full px-4">
        <button 
          onClick={toggle}
          className={`
            h-10 bg-brand-green rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:scale-105 transition-all duration-300 z-20
            ${isOpen ? 'w-full gap-2' : 'w-10'}
          `}
        >
           <Logo size={24} className="text-black shrink-0" />
           {isOpen && (
             <span className="text-sm font-bold tracking-wider animate-in fade-in duration-300">FINDASH</span>
           )}
        </button>
      </div>
      
      {/* Menu Items */}
      <div className="flex flex-col gap-4 flex-1 w-full px-4">
        {MENU_ITEMS.map((item) => {
          const isActive = activePage === item.label;
          return (
            <button 
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`
                flex items-center p-3 rounded-xl transition-all duration-200 group w-full overflow-hidden
                ${isActive ? 'bg-dark-card text-brand-green shadow-lg' : 'text-secondary hover:text-primary hover:bg-dark-card/50'}
                ${isOpen ? 'justify-start px-4 gap-3' : 'justify-center'}
              `}
              title={!isOpen ? item.label : undefined}
            >
              <item.icon size={24} className={`shrink-0 ${isActive ? 'text-brand-green' : 'group-hover:text-primary'}`} />
              
              <span 
                className={`whitespace-nowrap font-medium transition-all duration-300 origin-left
                  ${isOpen ? 'opacity-100 max-w-[200px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-4 hidden'}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;