import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Currency } from '../types';

// Mock exchange rates relative to USD
const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.USD]: 1.0,
  [Currency.EUR]: 0.92,
  [Currency.GBP]: 0.79,
  [Currency.CAD]: 1.36,
};

const CurrencyConverter: React.FC = () => {
  const [sendAmount, setSendAmount] = useState<string>('1000.00');
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
  const [toCurrency, setToCurrency] = useState<Currency>(Currency.CAD);

  // Calculate rate based on selected currencies
  const rate = useMemo(() => {
    return EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency];
  }, [fromCurrency, toCurrency]);

  // Calculate received amount automatically when send amount or rate changes
  const receiveAmount = useMemo(() => {
    const amount = parseFloat(sendAmount);
    if (isNaN(amount)) return '0.00';
    return (amount * rate).toFixed(2);
  }, [sendAmount, rate]);

  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow numbers and one decimal point
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSendAmount(value);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-green to-brand-greenDark rounded-2xl p-6 text-black/80">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-black">Conversion</h3>
          {/* Menu dots implied */}
       </div>

       <div className="mb-4">
          <div className="text-xs font-medium opacity-70 mb-2 text-black/70">Recipient</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center border border-white/10">
              <span className="font-mono text-sm tracking-wider text-black">5897 9093 3390 7038</span>
              <span className="font-bold text-black/60 italic text-xs">VISA</span>
          </div>
       </div>

       <div className="mb-4">
          <div className="text-xs font-medium opacity-70 mb-2 text-black/70">You send</div>
          <div className="flex gap-2">
             <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <input 
                  type="text" 
                  value={sendAmount} 
                  onChange={handleSendAmountChange}
                  className="bg-transparent w-full outline-none font-medium placeholder-black/50 text-black"
                  placeholder="0.00"
                />
             </div>
             <div className="relative w-24">
                <select 
                   value={fromCurrency}
                   onChange={(e) => setFromCurrency(e.target.value as Currency)}
                   className="w-full h-full bg-white/20 backdrop-blur-sm rounded-xl pl-3 pr-8 py-3 border border-white/10 appearance-none font-medium text-sm outline-none cursor-pointer hover:bg-white/30 transition-colors text-black"
                >
                   {Object.values(Currency).map((curr) => (
                      <option key={curr} value={curr} className="bg-white text-black">{curr}</option>
                   ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/60" />
             </div>
          </div>
       </div>

       <div className="mb-8">
          <div className="text-xs font-medium opacity-70 mb-2 text-black/70">Recipient gets</div>
          <div className="flex gap-2">
             <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <input 
                  type="text" 
                  value={receiveAmount} 
                  readOnly
                  className="bg-transparent w-full outline-none font-medium placeholder-black/50 cursor-default text-black"
                />
             </div>
             <div className="relative w-24">
                <select 
                   value={toCurrency}
                   onChange={(e) => setToCurrency(e.target.value as Currency)}
                   className="w-full h-full bg-white/20 backdrop-blur-sm rounded-xl pl-3 pr-8 py-3 border border-white/10 appearance-none font-medium text-sm outline-none cursor-pointer hover:bg-white/30 transition-colors text-black"
                >
                   {Object.values(Currency).map((curr) => (
                      <option key={curr} value={curr} className="bg-white text-black">{curr}</option>
                   ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/60" />
             </div>
          </div>
       </div>

       <div className="flex justify-between items-center">
          <div>
             <div className="text-sm font-bold text-black">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</div>
             <div className="text-[10px] font-medium opacity-70 text-black/70">Conversion Rate</div>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-xl font-medium text-sm shadow-lg hover:bg-gray-900 transition-colors">
             Send
          </button>
       </div>
    </div>
  );
};

export default CurrencyConverter;