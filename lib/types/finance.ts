// Finance Copilot Backend - TypeScript Types and Interfaces

// Database types matching Supabase schema
export interface Income {
  id: string;
  user_id: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
  last_received: string | null;
  currency: string;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
  is_fixed: boolean;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringPayment {
  id: string;
  user_id: string;
  amount: number;
  due_date: string; // ISO date string
  recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
  type: 'bill' | 'debt' | 'subscription' | 'other';
  priority_hint: number;
  currency: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  vendor: string | null;
  timestamp: string;
  currency: string;
  account_id: string | null;
  is_recurring_flag: boolean;
  created_at: string;
}

export interface BalanceTimeseries {
  id: string;
  user_id: string;
  timestamp: string;
  balance: number;
  currency: string;
  account_id: string | null;
  created_at: string;
}

// Metric Result Interface
export interface MetricResult {
  metric: string;
  value: string | number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  inputs: Record<string, any>;
}

// Financial Summary Interface for LLM consumption
export interface FinancialSummary {
  financial_state: {
    balance: number;
    income: number;
    burn_rate: number;
    runway: string; // e.g. "54 days"
    risk_level: 'low' | 'medium' | 'high' | 'critical';
  };
  insights: Array<{
    metric: string;
    value: any;
    risk: string;
    explanation: string;
  }>;
  simulations: Array<any>;
  anomalies: Array<any>;
  recommendations: Array<any>;
}

// API Request/Response Types
export interface AnalyticsRequest {
  userId: string;
  [key: string]: any;
}

export interface CashflowForecastRequest extends AnalyticsRequest {
  months: number;
}

export interface SimulatePurchaseRequest extends AnalyticsRequest {
  amount: number;
}

export interface SimulateIncomeChangeRequest extends AnalyticsRequest {
  percent: number;
}

export interface SimulateExpenseChangeRequest extends AnalyticsRequest {
  percent: number;
}

export interface IntentRouterRequest {
  query: string;
  userId: string;
}

export interface IntentRouterResponse {
  intent: string;
  called_functions: string[];
  aggregated_results: any;
}

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Recurrence types
export type RecurrenceType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';

// Payment types
export type PaymentType = 'bill' | 'debt' | 'subscription' | 'other';
