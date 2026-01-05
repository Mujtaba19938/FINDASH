import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle, Clock, AlertCircle, Download, ArrowUpRight } from 'lucide-react';

// Mock Data
const INVOICES = [
  { id: 'INV-001', client: 'Acme Corp', date: 'Jun 20, 2024', dueDate: 'Jul 04, 2024', amount: 2500.00, status: 'paid', items: 3, avatar: 'AC' },
  { id: 'INV-002', client: 'Globex Inc', date: 'Jun 25, 2024', dueDate: 'Jul 09, 2024', amount: 4800.50, status: 'pending', items: 5, avatar: 'GL' },
  { id: 'INV-003', client: 'Soylent Corp', date: 'Jun 28, 2024', dueDate: 'Jul 12, 2024', amount: 1200.00, status: 'overdue', items: 2, avatar: 'SC' },
  { id: 'INV-004', client: 'Initech', date: 'Jul 01, 2024', dueDate: 'Jul 15, 2024', amount: 3450.00, status: 'pending', items: 4, avatar: 'IN' },
  { id: 'INV-005', client: 'Umbrella Corp', date: 'Jul 02, 2024', dueDate: 'Jul 16, 2024', amount: 9800.00, status: 'paid', items: 8, avatar: 'UC' },
  { id: 'INV-006', client: 'Stark Ind', date: 'Jul 03, 2024', dueDate: 'Jul 17, 2024', amount: 15000.00, status: 'pending', items: 1, avatar: 'SI' },
  { id: 'INV-007', client: 'Massive Dynamic', date: 'Jul 05, 2024', dueDate: 'Jul 19, 2024', amount: 2100.00, status: 'paid', items: 3, avatar: 'MD' },
];

const Invoices: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-brand-green bg-brand-green/10 border-brand-green/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'overdue': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-secondary bg-dark-accent/50 border-dark-border';
    }
  };

  const filteredInvoices = filter === 'all' 
    ? INVOICES 
    : INVOICES.filter(inv => inv.status === filter);

  // Calculate stats
  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = INVOICES.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = INVOICES.filter(i => i.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-brand-green/20 border border-transparent transition-all shadow-sm">
                <div className="relative z-10">
                    <div className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle size={16} className="text-brand-green" /> Total Paid
                    </div>
                    <div className="text-3xl font-bold text-primary tracking-tight transition-colors">${totalPaid.toLocaleString()}</div>
                    <div className="text-xs text-brand-green mt-2 font-medium flex items-center gap-1">
                        <ArrowUpRight size={14} /> +12% from last month
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-brand-green/10 transition-colors"></div>
            </div>

            <div className="bg-dark-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-yellow-400/20 border border-transparent transition-all shadow-sm">
                <div className="relative z-10">
                    <div className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-yellow-400" /> Pending Amount
                    </div>
                    <div className="text-3xl font-bold text-primary tracking-tight transition-colors">${totalPending.toLocaleString()}</div>
                    <div className="text-xs text-yellow-400 mt-2 font-medium">
                        5 invoices pending
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-yellow-400/10 transition-colors"></div>
            </div>

            <div className="bg-dark-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-red-400/20 border border-transparent transition-all shadow-sm">
                <div className="relative z-10">
                    <div className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400" /> Overdue
                    </div>
                    <div className="text-3xl font-bold text-primary tracking-tight transition-colors">${totalOverdue.toLocaleString()}</div>
                    <div className="text-xs text-red-400 mt-2 font-medium">
                        Action required
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-red-400/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-red-400/10 transition-colors"></div>
            </div>
        </div>

        {/* Main Content */}
        <div className="bg-dark-card rounded-2xl min-h-[600px] flex flex-col shadow-sm transition-colors">
             {/* Header Toolbar */}
             <div className="p-6 border-b border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                <div className="flex gap-2 p-1 bg-dark-accent rounded-xl transition-colors">
                    {['all', 'paid', 'pending', 'overdue'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                                ${filter === f ? 'bg-dark-card text-primary shadow-sm' : 'text-secondary hover:text-primary'}
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search invoices..." 
                            className="bg-dark-accent text-primary pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-brand-green/50 focus:outline-none text-sm w-48 transition-all placeholder-secondary"
                        />
                    </div>
                    <button className="bg-brand-green text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-greenDark transition-colors shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                        <Plus size={18} />
                        <span>New Invoice</span>
                    </button>
                </div>
             </div>

             {/* List Header */}
             <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-secondary uppercase tracking-wider border-b border-dark-border transition-colors">
                 <div className="col-span-1 text-center"># ID</div>
                 <div className="col-span-3 pl-4">Client Name</div>
                 <div className="col-span-2">Date</div>
                 <div className="col-span-2 text-right">Amount</div>
                 <div className="col-span-2 text-center">Status</div>
                 <div className="col-span-2 text-center">Action</div>
             </div>

             {/* List Body */}
             <div className="flex-1 overflow-y-auto">
                 {filteredInvoices.map((inv) => (
                     <div 
                        key={inv.id}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-dark-accent/10 border-b border-dark-border transition-colors group"
                     >
                         <div className="col-span-1 text-sm text-secondary font-mono text-center">{inv.id.split('-')[1]}</div>
                         
                         <div className="col-span-3 flex items-center gap-3 pl-4">
                             <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center text-xs font-bold text-primary border border-dark-border">
                                {inv.avatar}
                             </div>
                             <div>
                                <div className="text-primary font-medium text-sm transition-colors">{inv.client}</div>
                                <div className="text-secondary text-[10px]">{inv.items} items</div>
                             </div>
                         </div>
                         
                         <div className="col-span-2">
                             <div className="text-primary text-sm transition-colors">{inv.date}</div>
                             <div className="text-secondary text-[10px]">Due: {inv.dueDate}</div>
                         </div>
                         
                         <div className="col-span-2 text-right">
                             <div className="text-primary font-bold text-sm transition-colors">${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                         </div>
                         
                         <div className="col-span-2 flex justify-center">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(inv.status)}`}>
                                 {inv.status}
                             </span>
                         </div>
                         
                         <div className="col-span-2 flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-dark-accent rounded-lg text-secondary hover:text-primary transition-colors" title="Download">
                                <Download size={16} />
                             </button>
                             <button className="p-2 hover:bg-dark-accent rounded-lg text-secondary hover:text-primary transition-colors">
                                <MoreHorizontal size={16} />
                             </button>
                         </div>
                     </div>
                 ))}
                 
                 {filteredInvoices.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-secondary">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>No invoices found</p>
                    </div>
                 )}
             </div>
        </div>
    </div>
  );
}

export default Invoices;