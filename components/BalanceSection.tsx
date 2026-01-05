import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const DonutChart: React.FC<{ percentage: number, color: string }> = ({ percentage, color }) => {
  const radius = 24;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg]"
        >
          <circle
            stroke="var(--color-accent)"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-colors opacity-30"
          />
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
    </div>
  );
};

const BalanceSection: React.FC = () => {
  // Use the new brand color #9fb6b2
  const brandColor = "#9fb6b2";

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-medium text-primary mb-4 transition-colors">Balance</h2>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-primary mb-1 transition-colors">$2,485.000</div>
        <div className="text-secondary text-sm">Total Balance</div>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {/* Income Card - Added Gradient */}
        <div className="bg-gradient-to-br from-[#1f2128] via-[#1f2128] to-[#1f2128]/80 border border-white/5 p-5 rounded-2xl flex justify-between items-center relative overflow-hidden group shadow-lg transition-all hover:border-brand-green/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="z-10">
            <div className="mb-3 text-secondary p-1.5 bg-white/5 rounded-lg w-fit">
               <TrendingDown className="text-brand-green rotate-45" size={18} />
            </div>
            <div className="text-2xl font-semibold text-primary mb-1 transition-colors">$89,498.000</div>
            <div className="text-secondary text-sm">Income</div>
          </div>
          <div className="z-10">
             <DonutChart percentage={75} color={brandColor} />
          </div>
        </div>

        {/* Outcome Card - Added Gradient */}
        <div className="bg-gradient-to-br from-[#1f2128] via-[#1f2128] to-[#1f2128]/80 border border-white/5 p-5 rounded-2xl flex justify-between items-center relative overflow-hidden group shadow-lg transition-all hover:border-brand-green/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="z-10">
            <div className="mb-3 text-secondary p-1.5 bg-white/5 rounded-lg w-fit">
               <TrendingDown className="text-white/70 -rotate-45" size={18} />
            </div>
            <div className="text-2xl font-semibold text-primary mb-1 transition-colors">$53,944.000</div>
            <div className="text-secondary text-sm">Outcome</div>
          </div>
          <div className="z-10">
             <DonutChart percentage={60} color={brandColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;