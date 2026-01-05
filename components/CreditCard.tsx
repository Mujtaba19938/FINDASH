import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardDetails, CardTheme } from '../types';

interface CreditCardProps {
  cards: CardDetails[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const THEMES: Record<CardTheme, string> = {
  // Updated Green theme to Metallic
  green: "from-[#9fb6b2] via-[#727d7d] to-[#2b2f33]", 
  purple: "from-[#c084fc] via-[#e879f9] to-[#f472b6]",
  blue: "from-[#60a5fa] via-[#3b82f6] to-[#2563eb]",
  orange: "from-[#fb923c] via-[#fdba74] to-[#fca5a5]"
};

const SingleCard: React.FC<{ 
  details: CardDetails; 
  isActive: boolean; 
  style?: React.CSSProperties 
}> = ({ details, isActive, style }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip when card becomes inactive or data changes significantly
  useEffect(() => {
    if (!isActive) setIsFlipped(false);
  }, [isActive]);

  const themeGradient = THEMES[details.theme] || THEMES.green;

  return (
    <div 
      className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out [perspective:1000px] ${isActive ? 'cursor-pointer' : ''}`}
      style={style}
      onClick={() => isActive && setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full aspect-[1.586/1] transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* --- Front Face --- */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-[#1f2128]">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} opacity-90 z-0`}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
          
          {/* Content */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="w-12 h-9 bg-yellow-200/80 rounded-md relative overflow-hidden flex items-center justify-center">
               <div className="w-full h-[1px] bg-yellow-600/50 absolute top-2"></div>
               <div className="w-full h-[1px] bg-yellow-600/50 absolute top-4"></div>
               <div className="w-full h-[1px] bg-yellow-600/50 absolute bottom-2"></div>
               <div className="h-full w-[1px] bg-yellow-600/50 absolute left-2"></div>
               <div className="h-full w-[1px] bg-yellow-600/50 absolute right-2"></div>
            </div>
            <span className="font-bold text-white/90 italic text-lg tracking-wider">FIN BANK</span>
          </div>

          <div className="relative z-10">
            <div className="text-white font-mono text-2xl tracking-[0.15em] mb-4 drop-shadow-md truncate">
              {details.cardNumber}
            </div>
            
            <div className="flex justify-between items-end">
               <div>
                  <div className="flex gap-6 text-[10px] text-white/80 font-mono mb-1 uppercase">
                     <div>
                        <span className="block text-[8px] opacity-70">Member Since</span>
                        <span>21</span>
                     </div>
                     <div>
                        <span className="block text-[8px] opacity-70">Valid Thru</span>
                        <span>{details.expiry}</span>
                     </div>
                  </div>
                  <div className="text-white font-medium tracking-widest uppercase text-sm drop-shadow-sm">
                    {details.cardHolder}
                  </div>
               </div>
               <div className="opacity-80">
                   <div className="flex relative h-8 w-12">
                       <div className="w-8 h-8 rounded-full bg-white/50 absolute left-0 mix-blend-overlay"></div>
                       <div className="w-8 h-8 rounded-full bg-white/50 absolute right-0 mix-blend-overlay"></div>
                   </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- Back Face --- */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${themeGradient}`}>
           <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} opacity-90 z-0`}></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

           <div className="relative z-10 flex flex-col w-full h-full py-6">
              <div className="w-full h-10 bg-black/80 mb-4 shadow-sm"></div>

              <div className="px-6 flex items-center gap-3">
                 <div className="flex-1 h-8 bg-white/90 rounded-sm flex items-center justify-start px-2 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                    <span className="font-cursive text-black/70 text-xs italic z-10 font-serif">Sign here</span>
                 </div>
                 <div className="w-12 h-8 bg-white/90 rounded-sm flex items-center justify-center">
                    <span className="font-mono font-bold text-black italic text-sm">{details.cvv}</span>
                 </div>
              </div>

              <div className="px-6 mt-4">
                 <p className="text-[7px] text-white/90 leading-relaxed text-justify opacity-80">
                    This card is the property of FinDash Bank. If found, please return to any FinDash branch or contact customer service at 1-800-FINDASH. Use of this card constitutes acceptance of the terms and conditions.
                 </p>
              </div>

              <div className="absolute bottom-6 right-6 opacity-80">
                   <div className="flex relative h-8 w-12">
                       <div className="w-8 h-8 rounded-full bg-white/50 absolute left-0 mix-blend-overlay"></div>
                       <div className="w-8 h-8 rounded-full bg-white/50 absolute right-0 mix-blend-overlay"></div>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const CreditCard: React.FC<CreditCardProps> = ({ cards, activeIndex, onIndexChange }) => {
  const handleNext = () => {
    onIndexChange((activeIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    onIndexChange((activeIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">Card</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="p-1 rounded bg-dark-card hover:bg-gray-700 text-gray-400 transition-colors z-20"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNext}
            className="p-1 rounded bg-dark-card hover:bg-gray-700 text-gray-400 transition-colors z-20"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Container for the Stack */}
      <div className="relative w-full aspect-[1.586/1] mb-12">
        {cards.map((card, index) => {
          // Calculate relative index for visual stacking
          const total = cards.length;
          
          // Logic to determine visual position (0 = Front, 1 = Middle, 2 = Back)
          let visualIndex = (index - activeIndex + total) % total;
          
          // Styles based on visual index
          let style: React.CSSProperties = {
             zIndex: 30 - visualIndex * 10,
             transform: `translateY(${visualIndex * 14}px) scale(${1 - visualIndex * 0.05})`,
             opacity: visualIndex > 2 ? 0 : 1 - visualIndex * 0.2,
             filter: visualIndex > 0 ? 'brightness(0.7)' : 'none',
             pointerEvents: visualIndex === 0 ? 'auto' : 'none',
          };

          if (visualIndex > 2) {
             style.opacity = 0;
             style.pointerEvents = 'none';
          }

          return (
            <SingleCard 
              key={card.id} 
              details={card} 
              isActive={index === activeIndex} 
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CreditCard;