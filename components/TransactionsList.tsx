import React, { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { Music, ShoppingBag, CreditCard, Box, Apple, ChevronDown, CheckCircle2, Download, Share2 } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'spotify': return <Music size={20} className="text-brand-green" />;
    case 'amazon': return <ShoppingBag size={20} className="text-yellow-400" />;
    case 'id': return <Box size={20} className="text-blue-400" />;
    case 'card': return <CreditCard size={20} className="text-purple-400" />;
    case 'apple': return <Apple size={20} className="text-primary" />;
    default: return <CreditCard size={20} />;
  }
};

const getCategory = (type: string) => {
    switch (type) {
        case 'spotify': return 'Entertainment';
        case 'amazon': return 'Shopping';
        case 'id': return 'Services';
        case 'card': return 'Transfer';
        case 'apple': return 'Electronics';
        default: return 'General';
    }
}

const TransactionsList: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-primary mb-4 transition-colors">Transactions</h3>
      <div className="flex flex-col gap-3">
        {MOCK_TRANSACTIONS.map((t) => {
           const isExpanded = expandedId === t.id;
           return (
             <div 
                key={t.id} 
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${isExpanded ? 'bg-dark-card border-brand-green/30 shadow-lg' : 'hover:bg-dark-card border-transparent'}`}
             >
               <div 
                  onClick={() => toggleExpand(t.id)}
                  className="flex items-center justify-between p-3 cursor-pointer group"
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors shadow-sm ${isExpanded ? 'bg-dark-accent border-brand-green/50' : 'bg-dark-card border-dark-border group-hover:border-dark-accent'}`}>
                        {getIcon(t.iconType)}
                     </div>
                     <div>
                        <div className="text-primary font-bold text-sm transition-colors">{t.name}</div>
                        <div className="text-secondary text-xs font-medium">{t.date}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="text-primary font-bold text-sm transition-colors">
                         {t.amount < 0 ? `-$${Math.abs(t.amount)}` : `+$${t.amount}`}
                      </div>
                      <div className={`text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180 text-brand-green' : 'group-hover:text-primary'}`}>
                          <ChevronDown size={16} />
                      </div>
                  </div>
               </div>

               {/* Expanded Content */}
               <div 
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
               >
                  <div className="overflow-hidden">
                      <div className="p-4 pt-0 border-t border-dark-border/50 mt-2">
                          <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                  <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Status</span>
                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-brand-green font-medium">
                                      <CheckCircle2 size={12} /> Completed
                                  </div>
                              </div>
                              <div>
                                  <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Category</span>
                                  <div className="mt-1 text-xs text-primary font-medium">{getCategory(t.iconType)}</div>
                              </div>
                              <div>
                                  <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Transaction ID</span>
                                  <div className="mt-1 text-xs text-primary font-mono tracking-wide">TRX-{t.id.padStart(8, '0')}</div>
                              </div>
                              <div>
                                  <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Payment Method</span>
                                  <div className="mt-1 text-xs text-primary font-medium flex items-center gap-2">
                                    <div className="w-5 h-3 bg-white/20 rounded-sm"></div> **** 4565
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex gap-3 mt-2">
                              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-accent hover:bg-dark-accent/80 text-primary text-xs font-semibold transition-colors border border-transparent hover:border-dark-border">
                                  <Download size={14} /> Receipt
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-accent hover:bg-dark-accent/80 text-primary text-xs font-semibold transition-colors border border-transparent hover:border-dark-border">
                                  <Share2 size={14} /> Share
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default TransactionsList;