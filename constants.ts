import { ChartDataPoint, Transaction, UpcomingPayment } from './types';

export const MOCK_HISTORY_DATA: ChartDataPoint[] = [
  { name: 'Jan', income: 40000, expense: 24000, balance: 60000 },
  { name: 'Feb', income: 30000, expense: 13980, balance: 48000 },
  { name: 'Mar', income: 20000, expense: 9800, balance: 52000 },
  { name: 'Apr', income: 27800, expense: 39080, balance: 85000 },
  { name: 'May', income: 18900, expense: 4800, balance: 65000 },
  { name: 'Jun', income: 23900, expense: 3800, balance: 70000 },
  { name: 'Jul', income: 34900, expense: 4300, balance: 55000 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'Spotify', date: '22.06.2024', amount: -12.00, iconType: 'spotify' },
  { id: '2', name: 'Amazon', date: '21.06.2024', amount: -573, iconType: 'amazon' },
  { id: '3', name: 'ID Foundation', date: '18.06.2021', amount: -200, iconType: 'id' },
  { id: '4', name: '**** **** **** 4565', date: '17.06.2024', amount: -200, iconType: 'card' },
  { id: '5', name: 'Apple', date: '15.06.2024', amount: -623, iconType: 'apple' },
];

export const MOCK_PAYMENTS: UpcomingPayment[] = [
  { id: '1', name: 'Electric Bill', date: 'Tomorrow', amount: -2833.00, description: 'Utility' },
  { id: '2', name: 'Netflix', date: '25.09.2024', amount: -32.53, description: 'Entertainment' },
  { id: '3', name: 'Electric Bill', date: 'Tomorrow', amount: -2833.00, description: 'Utility' },
];
