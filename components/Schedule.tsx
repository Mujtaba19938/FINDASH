import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Mock data for scheduled events
const EVENTS = [
  { id: 1, title: 'Rent Payment', date: '2024-07-01', day: 1, amount: 1200, type: 'outgoing', category: 'Housing' },
  { id: 2, title: 'Salary Deposit', date: '2024-07-05', day: 5, amount: 4500, type: 'incoming', category: 'Income' },
  { id: 3, title: 'Design Project', date: '2024-07-12', day: 12, amount: 1250, type: 'incoming', category: 'Freelance' },
  { id: 4, title: 'Netflix Sub', date: '2024-07-15', day: 15, amount: 15.99, type: 'outgoing', category: 'Entertainment' },
  { id: 5, title: 'Internet Bill', date: '2024-07-18', day: 18, amount: 89.00, type: 'outgoing', category: 'Utilities' },
  { id: 6, title: 'Gym Membership', date: '2024-07-28', day: 28, amount: 45, type: 'outgoing', category: 'Health' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Schedule: React.FC = () => {
  // Hardcoded to July 2024 for visual consistency with mock data
  const [currentDate] = useState(new Date(2024, 6, 1)); 

  // Generate calendar days for July 2024 (Starts on Monday)
  // July 1st 2024 is a Monday (Index 1)
  const daysInMonth = 31;
  const startDayIndex = 1; // Monday

  const calendarCells = [];
  // Empty cells for previous month
  for (let i = 0; i < startDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const getEventsForDay = (day: number) => EVENTS.filter(e => e.day === day);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Calendar Section */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-dark-card rounded-2xl p-6 h-full flex flex-col shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <h2 className="text-2xl font-semibold text-primary transition-colors">July 2024</h2>
                 <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-dark-accent text-secondary hover:text-primary transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-dark-accent text-secondary hover:text-primary transition-colors">
                        <ChevronRight size={20} />
                    </button>
                 </div>
              </div>
              <button className="bg-brand-green text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-greenDark transition-colors shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                <Plus size={18} />
                <span>Add Event</span>
              </button>
            </div>

            <div className="grid grid-cols-7 mb-4 px-2">
              {DAYS.map(day => (
                <div key={day} className="text-secondary text-xs font-semibold uppercase tracking-wider text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-5 gap-3 flex-1">
              {calendarCells.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} className="rounded-xl bg-transparent" />;
                
                const dayEvents = getEventsForDay(day);
                const isToday = day === 22; // Mock today

                return (
                  <div 
                    key={day} 
                    className={`
                      min-h-[100px] rounded-xl p-3 relative border transition-all duration-200 group cursor-pointer flex flex-col justify-between
                      ${isToday 
                        ? 'bg-brand-green/5 border-brand-green/30' 
                        : 'bg-dark-accent/50 border-transparent hover:bg-dark-accent hover:border-dark-border'}
                    `}
                  >
                    <span className={`text-sm font-semibold ${isToday ? 'text-brand-green' : 'text-secondary group-hover:text-primary'}`}>
                      {day}
                    </span>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      {dayEvents.map(event => (
                        <div key={event.id} className="flex items-center gap-1.5 overflow-hidden">
                           <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.type === 'incoming' ? 'bg-brand-green' : 'bg-red-400'}`}></div>
                           <span className="text-[10px] text-secondary truncate font-medium">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-brand-green to-[#22c55e] rounded-2xl p-6 text-black shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
             
             <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                   <p className="font-semibold text-black/60 mb-1 text-sm uppercase tracking-wide">Total Scheduled</p>
                   <h3 className="text-4xl font-bold tracking-tight">$5,230.50</h3>
                </div>
                <div className="p-3 bg-black/10 rounded-xl backdrop-blur-sm">
                   <CalendarIcon size={24} className="text-black" />
                </div>
             </div>
             <div className="text-xs font-bold bg-black/10 backdrop-blur-md p-3 rounded-xl inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                6 Active Events this month
             </div>
          </div>

          {/* Upcoming List */}
          <div className="bg-dark-card rounded-2xl p-6 flex-1 shadow-sm border border-dark-border/50 transition-colors">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-primary transition-colors">Upcoming</h3>
                <button className="text-xs text-brand-green font-medium hover:underline">View All</button>
             </div>
             
             <div className="flex flex-col gap-4">
                {EVENTS.map(event => (
                   <div key={event.id} className="flex items-center justify-between p-3 hover:bg-dark-accent/20 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-dark-border">
                      <div className="flex items-center gap-4">
                         <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                            ${event.type === 'incoming' 
                               ? 'bg-brand-green/10 text-brand-green group-hover:bg-brand-green/20' 
                               : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'}
                         `}>
                            {event.type === 'incoming' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                         </div>
                         <div>
                            <div className="text-primary font-bold text-sm transition-colors">{event.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-secondary text-xs font-medium">{event.date}</span>
                               <span className="w-1 h-1 rounded-full bg-secondary"></span>
                               <span className="text-secondary text-xs">{event.category}</span>
                            </div>
                         </div>
                      </div>
                      <div className={`font-bold text-sm ${event.type === 'incoming' ? 'text-brand-green' : 'text-primary'}`}>
                         {event.type === 'incoming' ? '+' : '-'}${event.amount.toLocaleString()}
                      </div>
                   </div>
                ))}
             </div>

             <div className="mt-6 pt-6 border-t border-dark-border">
                <div className="flex items-center justify-between text-sm text-secondary mb-2">
                    <span>Monthly Limit</span>
                    <span className="text-primary font-medium">$12,000</span>
                </div>
                <div className="w-full h-2 bg-dark-accent rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green w-[45%] rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Schedule;