import React from 'react';
import { Pencil } from 'lucide-react';
import { CardDetails } from '../types';

interface CardInfoProps {
  details: CardDetails;
  onUpdate: (field: keyof CardDetails, value: string | number) => void;
}

const CardInfo: React.FC<CardInfoProps> = ({ details, onUpdate }) => {
  return (
    <div className="bg-dark-card rounded-2xl p-6 mb-6 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary">Card Info</h3>
        <button className="text-secondary hover:text-primary transition-colors">
          <Pencil size={18} />
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Card Number</span>
          <input 
            type="text" 
            value={details.cardNumber}
            onChange={(e) => onUpdate('cardNumber', e.target.value)}
            className="text-primary font-mono bg-transparent text-right outline-none focus:text-brand-green w-48 transition-colors"
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Card Holder</span>
          <input 
            type="text" 
            value={details.cardHolder}
            onChange={(e) => onUpdate('cardHolder', e.target.value)}
            className="text-primary bg-transparent text-right outline-none focus:text-brand-green w-40 transition-colors"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Valid Thru</span>
          <div className="flex gap-2 justify-end">
             <input 
               type="text" 
               value={details.expiry}
               onChange={(e) => onUpdate('expiry', e.target.value)}
               className="text-primary bg-transparent text-right outline-none focus:text-brand-green w-16 transition-colors"
               placeholder="MM/YY"
             />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
           <span className="text-secondary">CVV</span>
           <input 
               type="text" 
               value={details.cvv}
               onChange={(e) => onUpdate('cvv', e.target.value)}
               className="text-primary bg-transparent text-right outline-none focus:text-brand-green w-10 transition-colors"
               maxLength={4}
             />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Status</span>
          <select 
            value={details.status}
            onChange={(e) => onUpdate('status', e.target.value)}
            className="text-primary bg-transparent text-right outline-none focus:text-brand-green cursor-pointer appearance-none transition-colors"
            style={{ textAlignLast: 'right' }}
          >
             <option value="Active" className="bg-dark-card text-primary">Active</option>
             <option value="Blocked" className="bg-dark-card text-primary">Blocked</option>
             <option value="Expired" className="bg-dark-card text-primary">Expired</option>
          </select>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Currency</span>
          <select 
             value={details.currency}
             onChange={(e) => onUpdate('currency', e.target.value)}
             className="text-primary bg-transparent text-right outline-none focus:text-brand-green cursor-pointer appearance-none transition-colors"
             style={{ textAlignLast: 'right' }}
          >
             <option value="USD" className="bg-dark-card text-primary">USD</option>
             <option value="EUR" className="bg-dark-card text-primary">EUR</option>
             <option value="GBP" className="bg-dark-card text-primary">GBP</option>
          </select>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Balance</span>
          <div className="flex items-center justify-end">
            <span className="text-primary font-medium mr-1">$</span>
            <input 
                type="number" 
                value={details.balance}
                onChange={(e) => onUpdate('balance', parseFloat(e.target.value))}
                className="text-primary font-medium bg-transparent text-right outline-none focus:text-brand-green w-24 transition-colors"
            />
          </div>
        </div>
      </div>

      <button className="w-full bg-primary text-dark-bg font-semibold py-3 rounded-xl hover:opacity-90 transition-all border border-dark-border">
        Details
      </button>
    </div>
  );
};

export default CardInfo;