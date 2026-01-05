import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Calendar } from 'lucide-react';
import { MOCK_HISTORY_DATA } from '../constants';

const BalanceHistory: React.FC = () => {
  const brandColor = "#9fb6b2";

  // Custom cursor for tooltip
  const CustomCursor = (props: any) => {
    const { x, y, width, height } = props;
    return (
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill="var(--color-accent)" 
        rx={8} 
        opacity={0.4}
      />
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#1f2128] via-[#1f2128] to-[#1f2128]/80 border border-white/5 p-6 rounded-2xl mb-6 relative h-[320px] shadow-lg transition-colors overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>

      <div className="relative z-10 flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-primary transition-colors">Balance History</h3>
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-secondary hover:text-primary transition-all border border-white/5">
          <Calendar size={18} />
        </button>
      </div>

      <div className="relative z-10 h-[240px] w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={MOCK_HISTORY_DATA}
            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="var(--color-accent)" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k%` : value}
            />
            <Tooltip 
               cursor={<CustomCursor />}
               contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '12px' }}
               itemStyle={{ color: 'var(--color-text-primary)' }}
            />
            {/* Background Bars */}
            <Bar 
              dataKey="balance" 
              barSize={32} 
              radius={[20, 20, 20, 20]}
            >
               {MOCK_HISTORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="white" fillOpacity={0.05} />
               ))}
            </Bar>
            
            {/* The Line */}
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke={brandColor}
              strokeWidth={2} 
              dot={{ r: 4, fill: brandColor, stroke: 'var(--color-card)', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: brandColor, stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceHistory;