
export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  iconType: 'spotify' | 'amazon' | 'id' | 'card' | 'apple';
}

export interface UpcomingPayment {
  id: string;
  name: string;
  date: string;
  amount: number;
  description: string;
}

export interface ChartDataPoint {
  name: string;
  income: number;
  expense: number;
  balance: number;
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  CAD = 'CAD',
  GBP = 'GBP'
}

export type CardTheme = 'green' | 'purple' | 'blue' | 'orange';

export interface CardDetails {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  status: string;
  currency: string;
  balance: number;
  theme: CardTheme;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}
