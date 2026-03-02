# Edge Functions & Backend Logic

This document defines the structure and logic for Supabase Edge Functions.

## Directory Structure
```
backend/supabase/functions/
├── _shared/              # Shared code (DB client, CORS headers)
│   ├── cors.ts
│   └── supabaseAdmin.ts
├── payment-create-order/ # Step 1: Init Payment
│   └── index.ts
├── payment-verify/       # Step 2: Verify & Start
│   └── index.ts
├── cron-status-cleanup/  # Scheduled: Offline detection
│   └── index.ts
└── admin-approve-station/# Admin action
    └── index.ts
```

## Function Definitions

### 1. `payment-verify` (Critical)
Start charging session securely after payment.

- **Endpoint**: `/functions/v1/payment-verify`
- **Method**: POST
- **Body**:
  ```json
  {
      "order_id": "order_IsK...",
      "payment_id": "pay_IsK...",
      "signature": "e5c..."
  }
  ```
- **Logic**:
  1. Generate expected signature: `HMAC_SHA256(order_id + "|" + payment_id, secret)`.
  2. Compare with `signature`.
  3. If valid:
     - Update `transactions` -> `status = 'paid'`.
     - Update `charger_status` -> `current_status = 'charging'`, `current_session_id = transaction.id`.
     - Return `success: true`.

### 2. `cron-status-cleanup` (Maintenance)
Handles "Silent Failures" where chargers stop sending heartbeats.

- **Trigger**: Planned Cron (e.g., every 10 mins).
- **Logic**:
  ```sql
  UPDATE public.charger_status
  SET current_status = 'offline'
  WHERE 
      current_status != 'offline' 
      AND last_seen_at < NOW() - INTERVAL '1 hour';
  ```

### 3. `admin-approve-station` (Admin Only)
- **Auth**: Service Role / Admin user check.
- **Body**: `{ "station_id": "..." }`
- **Logic**:
  - Update `charging_stations` set `status = 'active'`.
  - Send email/notification to Owner (via Resend or FCM).

## Environment Variables Needed
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin actions)
- `FCM_SERVER_KEY` (for notifications)
