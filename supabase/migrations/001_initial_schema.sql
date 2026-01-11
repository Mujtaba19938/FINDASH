-- Finance Copilot Backend - Initial Schema
-- Creates all tables for financial data with proper indexing and RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Incomes table
CREATE TABLE IF NOT EXISTS incomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'one-time')),
    last_received TIMESTAMPTZ,
    currency TEXT NOT NULL DEFAULT 'USD',
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT NOT NULL,
    recurrence TEXT NOT NULL CHECK (recurrence IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'one-time')),
    is_fixed BOOLEAN NOT NULL DEFAULT false,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recurring payments table
CREATE TABLE IF NOT EXISTS recurring_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    recurrence TEXT NOT NULL CHECK (recurrence IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'one-time')),
    type TEXT NOT NULL CHECK (type IN ('bill', 'debt', 'subscription', 'other')),
    priority_hint INTEGER DEFAULT 0, -- Lower number = higher priority
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT NOT NULL,
    vendor TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    currency TEXT NOT NULL DEFAULT 'USD',
    account_id TEXT,
    is_recurring_flag BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Balance timeseries table
CREATE TABLE IF NOT EXISTS balance_timeseries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    balance DECIMAL(15, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    account_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_last_received ON incomes(last_received);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

CREATE INDEX IF NOT EXISTS idx_recurring_payments_user_id ON recurring_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_due_date ON recurring_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_user_due ON recurring_payments(user_id, due_date);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_timestamp ON transactions(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_balance_timeseries_user_id ON balance_timeseries(user_id);
CREATE INDEX IF NOT EXISTS idx_balance_timeseries_timestamp ON balance_timeseries(timestamp);
CREATE INDEX IF NOT EXISTS idx_balance_timeseries_user_timestamp ON balance_timeseries(user_id, timestamp DESC);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_timeseries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view their own incomes"
    ON incomes FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own incomes"
    ON incomes FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own incomes"
    ON incomes FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own incomes"
    ON incomes FOR DELETE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own expenses"
    ON expenses FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own expenses"
    ON expenses FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own expenses"
    ON expenses FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own expenses"
    ON expenses FOR DELETE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own recurring_payments"
    ON recurring_payments FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own recurring_payments"
    ON recurring_payments FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own recurring_payments"
    ON recurring_payments FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own recurring_payments"
    ON recurring_payments FOR DELETE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own balance_timeseries"
    ON balance_timeseries FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own balance_timeseries"
    ON balance_timeseries FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own balance_timeseries"
    ON balance_timeseries FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own balance_timeseries"
    ON balance_timeseries FOR DELETE
    USING (auth.uid()::text = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_incomes_updated_at BEFORE UPDATE ON incomes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_payments_updated_at BEFORE UPDATE ON recurring_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
