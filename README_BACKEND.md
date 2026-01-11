# Finance Copilot Backend

This backend provides financial analysis, forecasting, and advisory capabilities for the FinDash application.

## Architecture

- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **API**: Vercel serverless functions
- **Authentication**: Firebase Auth (JWT tokens verified on the frontend, user ID passed to backend)
- **Language**: TypeScript

## Setup

### 1. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration file: `supabase/migrations/001_initial_schema.sql`
3. Get your Supabase credentials from the project settings:
   - Project URL
   - Anon key
   - Service role key (for admin operations)

### 2. Environment Variables

Create a `.env.local` file (or set in Vercel dashboard):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Database Migration

Run the SQL migration in your Supabase SQL editor:

```bash
# Or use Supabase CLI:
supabase db push
```

## API Endpoints

All endpoints are deployed as Vercel serverless functions under `/api/`:

### Financial Analytics

- `GET /api/finance/burn-rate` - Calculate monthly burn rate
- `GET /api/finance/savings-rate` - Calculate savings rate
- `GET /api/finance/runway` - Calculate financial runway
- `GET /api/finance/payment-priority` - Get prioritized upcoming payments
- `GET /api/finance/cashflow-forecast?months=6` - Generate cashflow forecast
- `GET /api/finance/anomalies` - Detect spending anomalies
- `GET /api/finance/classification` - Classify expenses (discretionary vs fixed)
- `GET /api/finance/risk-score` - Calculate overall risk score

### Simulations

- `POST /api/finance/simulate-purchase` - Simulate purchase impact
  - Body: `{ "amount": 1000 }`
- `POST /api/finance/simulate-income` - Simulate income change
  - Body: `{ "percent": 10 }` (positive = increase, negative = decrease)
- `POST /api/finance/simulate-expense` - Simulate expense change
  - Body: `{ "percent": -20 }` (negative = decrease)

### Aggregated Endpoints

- `GET /api/advisory` - Get comprehensive financial summary (for LLM consumption)
- `POST /api/intent` - Intent router for natural language queries
  - Body: `{ "query": "How am I doing financially?" }`

## Authentication

All endpoints require authentication via the `X-User-Id` header or `Authorization: Bearer <token>` header.

The backend expects the frontend to verify Firebase JWT tokens and pass the user ID in the request headers.

## Response Format

All endpoints return structured JSON responses:

```typescript
interface MetricResult {
  metric: string;
  value: string | number;
  risk: "low" | "medium" | "high" | "critical";
  explanation: string;
  inputs: Record<string, any>;
}
```

## Usage Examples

### Get Burn Rate

```bash
curl -X GET https://your-app.vercel.app/api/finance/burn-rate \
  -H "X-User-Id: user-firebase-uid-here"
```

### Simulate Purchase

```bash
curl -X POST https://your-app.vercel.app/api/finance/simulate-purchase \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user-firebase-uid-here" \
  -d '{"amount": 5000}'
```

### Get Financial Summary

```bash
curl -X GET https://your-app.vercel.app/api/advisory \
  -H "X-User-Id: user-firebase-uid-here"
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to set environment variables in the Vercel dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for the complete database schema.

Tables:
- `incomes` - Income sources
- `expenses` - Recurring expenses
- `recurring_payments` - Upcoming payments (bills, debts, subscriptions)
- `transactions` - Transaction history
- `balance_timeseries` - Historical balance data

All tables are user-scoped via `user_id` with Row Level Security (RLS) enabled.
