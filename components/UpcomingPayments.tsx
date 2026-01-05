import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MOCK_PAYMENTS } from '../constants';

const UpcomingPayments: React.FC = () => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-primary mb-4 transition-colors">Upcoming Payments</h3>
      <div className="flex flex-col gap-3">
        {MOCK_PAYMENTS.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-1 hover:bg-dark-card/50 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-dark-card flex items-center justify-center border border-dark-border text-secondary shadow-sm">
                <ChevronLeft size={18} />
              </div>
              <div>
                <div className="text-primary font-medium text-sm transition-colors">{payment.name}</div>
                <div className="text-secondary text-xs">{payment.date}</div>
              </div>
            </div>
            <div className="text-primary font-medium text-sm transition-colors">
               {payment.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPayments;