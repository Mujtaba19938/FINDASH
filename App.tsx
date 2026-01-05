import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreditCard from './components/CreditCard';
import BalanceSection from './components/BalanceSection';
import CardInfo from './components/CardInfo';
import TransactionsList from './components/TransactionsList';
import UpcomingPayments from './components/UpcomingPayments';
import BalanceHistory from './components/BalanceHistory';
import CurrencyConverter from './components/CurrencyConverter';
import Schedule from './components/Schedule';
import Invoices from './components/Invoices';
import Settings from './components/Settings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { CardDetails, NotificationItem } from './types';

const INITIAL_CARDS: CardDetails[] = [
  {
    id: '1',
    cardNumber: '1234 5678 1234 5678',
    cardHolder: 'Mujtaba Khanani',
    expiry: '12/25',
    cvv: '123',
    status: 'Active',
    currency: 'USD',
    balance: 1863.82,
    theme: 'green'
  },
  {
    id: '2',
    cardNumber: '8765 4321 8765 4321',
    cardHolder: 'Mujtaba Khanani',
    expiry: '10/26',
    cvv: '456',
    status: 'Active',
    currency: 'EUR',
    balance: 4250.50,
    theme: 'purple'
  },
  {
    id: '3',
    cardNumber: '4567 8901 2345 6789',
    cardHolder: 'Mujtaba Khanani',
    expiry: '08/24',
    cvv: '789',
    status: 'Active',
    currency: 'GBP',
    balance: 950.00,
    theme: 'blue'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Payment Received', message: 'You received $4,500.00 from Upwork.', time: '2 min ago', read: false, type: 'success' },
  { id: '2', title: 'Security Alert', message: 'New login detected from Mac OS.', time: '1 hour ago', read: false, type: 'warning' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const [cards, setCards] = useState<CardDetails[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // Real-time notification simulation
  useEffect(() => {
    const messages = [
      { title: 'New Invoice', message: 'Invoice #008 created successfully.', type: 'info' },
      { title: 'Subscription', message: 'Netflix subscription payment pending.', type: 'warning' },
      { title: 'Goal Reached', message: 'You hit your savings goal!', type: 'success' },
      { title: 'System Update', message: 'Platform maintenance scheduled.', type: 'alert' },
      { title: 'Transfer Complete', message: 'Sent $200.00 to Alex.', type: 'success' },
    ];

    const interval = setInterval(() => {
      // 30% chance to trigger a notification every 8 seconds
      if (Math.random() > 0.7) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const newNotification: NotificationItem = {
          id: Date.now().toString(),
          title: randomMsg.title,
          message: randomMsg.message,
          time: 'Just now',
          read: false,
          type: randomMsg.type as any,
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id?: string) => {
    if (id) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const activeCard = cards[activeCardIndex];

  const handleCardUpdate = (field: keyof CardDetails, value: string | number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[activeCardIndex] = { ...newCards[activeCardIndex], [field]: value };
      return newCards;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="w-16 h-16 rounded-2xl bg-dark-card flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 border-2 border-secondary border-t-brand-green rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show login/signup forms if user is not authenticated
  if (!user) {
    return (
      <div className="relative min-h-screen bg-dark-bg text-primary font-sans selection:bg-brand-green selection:text-black transition-colors duration-300 overflow-x-hidden">
        {/* Global Background Gradients */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
              background: 'radial-gradient(circle at 30% 20%, #9fb6b2 0%, #727d7d 25%, #2b2f33 60%, #0f1113 100%)',
              opacity: 0.15
          }}
        ></div>
        {showSignUp ? (
          <SignUp 
            onSwitchToLogin={() => setShowSignUp(false)} 
            onSignUpSuccess={() => setShowSignUp(false)}
          />
        ) : (
          <Login 
            onSwitchToSignUp={() => setShowSignUp(true)} 
            onLoginSuccess={() => {}}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-bg text-primary font-sans selection:bg-brand-green selection:text-black transition-colors duration-300 overflow-x-hidden">
      
      {/* Global Background Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
            background: 'radial-gradient(circle at 30% 20%, #9fb6b2 0%, #727d7d 25%, #2b2f33 60%, #0f1113 100%)',
            opacity: 0.15
        }}
      ></div>

      <div className="relative z-10 flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          activePage={currentPage}
          onNavigate={setCurrentPage}
        />
        
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'} pr-8 pl-8 py-6 max-w-[1600px] mx-auto w-full`}
        >
          <Header 
            title={currentPage} 
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearNotifications}
            onChatToggle={() => setIsChatOpen(!isChatOpen)}
            onLogout={handleLogout}
            user={user}
          />
          
          {currentPage === 'Dashboard' && (
            <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Card & Details */}
              <div className="col-span-12 lg:col-span-3 flex flex-col">
                 <CreditCard 
                   cards={cards} 
                   activeIndex={activeCardIndex} 
                   onIndexChange={setActiveCardIndex} 
                 />
                 <CardInfo details={activeCard} onUpdate={handleCardUpdate} />
                 <UpcomingPayments />
              </div>

              {/* Middle Column: Balance & Transactions */}
              <div className="col-span-12 lg:col-span-4 flex flex-col">
                 <div className="mb-8">
                    <BalanceSection />
                 </div>
                 <div className="flex-1">
                    <TransactionsList />
                 </div>
              </div>

              {/* Right Column: Chart & Converter */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                 <BalanceHistory />
                 <div>
                    <CurrencyConverter />
                 </div>
              </div>
            </div>
          )}

          {currentPage === 'Schedule' && <Schedule />}
          
          {currentPage === 'Invoices' && <Invoices />}
          
          {currentPage === 'Settings' && <Settings user={user} />}
          
          {/* Placeholder for other pages */}
          {!['Dashboard', 'Schedule', 'Invoices', 'Settings'].includes(currentPage) && (
             <div className="flex items-center justify-center h-[60vh] text-secondary flex-col gap-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-dark-card flex items-center justify-center shadow-lg">
                   <div className="w-8 h-8 border-2 border-secondary border-t-brand-green rounded-full animate-spin"></div>
                </div>
                <p>Work in Progress</p>
             </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;