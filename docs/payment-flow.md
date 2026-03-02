# Razorpay Payment Flow

This document outlines the secure payment flow for EV charging sessions using Razorpay and Supabase Edge Functions.

## 1. Sequence Diagram

```mermaid
sequenceDiagram
    participant UserApp
    participant EdgeFunc as Supabase Edge Function
    participant Razorpay
    participant DB as Supabase DB

    Note over UserApp: User selects Plug & Amount
    UserApp->>EdgeFunc: POST /payment-create-order {chargerId, amount}
    
    Note over EdgeFunc: Validate Auth & Availability
    EdgeFunc->>Razorpay: Create Order (amount, currency, receipt)
    Razorpay-->>EdgeFunc: Return order_id
    EdgeFunc->>DB: Insert Transaction (status: PENDING, order_id)
    EdgeFunc-->>UserApp: Return {order_id, key_id}

    Note over UserApp: Open Razorpay Checkout SDK
    UserApp->>Razorpay: User pays via UPI/Card
    Razorpay-->>UserApp: Success Callback (pay_id, sign)

    Note over UserApp: Payment Success
    UserApp->>EdgeFunc: POST /payment-verify {order_id, pay_id, signature}
    
    Note over EdgeFunc: HMAC SHA256 Verification
    alt Signature Valid
        EdgeFunc->>Razorpay: Capture Payment (if manual capture)
        EdgeFunc->>DB: Update Transaction (status: PAID)
        EdgeFunc->>DB: Update Charger Status (state: CHARGING)
        EdgeFunc-->>UserApp: Success {status: "start_charging"}
    else Signature Invalid
        EdgeFunc-->>UserApp: Error "Verification Failed"
    end
```

## 2. Edge Functions

### `payment-create-order`
- **Auth**: Required (`auth.uid()`)
- **Inputs**: `charger_id`, `amount` (INR)
- **Logic**:
  1. Check if `charger_status` is `AVAILABLE`.
  2. Calculate amount in paisa (INR * 100).
  3. Call Razorpay API `orders.create`.
  4. Create `transactions` record with `payment_provider_id = order_id`.
- **Output**: `order_id`, `currency`, `key_id` (env var).

### `payment-webhook` (Optional / Fallback)
- **Auth**: None (Validate Webhook Secret)
- **Trigger**: `payment.captured` or `payment.failed` event from Razorpay.
- **Logic**:
  1. Verify `X-Razorpay-Signature`.
  2. Find transaction by `order_id`.
  3. Update status to `PAID` or `FAILED`.
  4. If `PAID` and charger not yet started, trigger start.
  
## 3. Security Measures
- **Never** store Razorpay `key_secret` in the mobile app.
- **Always** verify payment signature on the server (Edge Function).
- **Idempotency**: Ensure multiple webhook events don't trigger double charging (check if transaction is already `PAID`).
