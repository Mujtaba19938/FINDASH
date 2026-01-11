// Supabase Database Types
// This file should be auto-generated using Supabase CLI: supabase gen types typescript
// For now, we'll define a basic structure that matches our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      incomes: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          last_received: string | null;
          currency: string;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          last_received?: string | null;
          currency?: string;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          last_received?: string | null;
          currency?: string;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          is_fixed: boolean;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          is_fixed?: boolean;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          is_fixed?: boolean;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          due_date: string;
          recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          type: 'bill' | 'debt' | 'subscription' | 'other';
          priority_hint: number;
          currency: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          due_date: string;
          recurrence: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          type: 'bill' | 'debt' | 'subscription' | 'other';
          priority_hint?: number;
          currency?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          due_date?: string;
          recurrence?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'one-time';
          type?: 'bill' | 'debt' | 'subscription' | 'other';
          priority_hint?: number;
          currency?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          vendor?: string | null;
          timestamp?: string;
          currency?: string;
          account_id?: string | null;
          is_recurring_flag?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          vendor?: string | null;
          timestamp?: string;
          currency?: string;
          account_id?: string | null;
          is_recurring_flag?: boolean;
          created_at?: string;
        };
      };
      balance_timeseries: {
        Row: {
          id: string;
          user_id: string;
          timestamp: string;
          balance: number;
          currency: string;
          account_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timestamp?: string;
          balance: number;
          currency?: string;
          account_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timestamp?: string;
          balance?: number;
          currency?: string;
          account_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
