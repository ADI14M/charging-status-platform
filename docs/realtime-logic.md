# Real-time Status Update Strategy

We utilize a **Hybrid Model** combining Event-Driven Push and Heartbeat/TTL (Time-To-Live). This ensures rapid UI updates while handling the common "silent failure" scenario (e.g., charger loses internet connection).

## 1. Primary: Event-Driven Push (Supabase Realtime)
This layer handles "Active" state changes initiated by the charger or the system.

-   **Mechanism**:
    -   Charger HW / IoT Controller detects state change (e.g., Plug Connected, Charging Started).
    -   Charger calls API (Edge Function) to update `charger_status` table.
    -   **PostgreSQL** emits a `UPDATE` event.
    -   **Supabase Realtime** broadcasts this event to all subscribed clients (Mobile Apps viewing that station).
-   **Latency**: milliseconds.
-   **Usage**: Immediate feedback for "Available" <-> "Busy".

## 2. Secondary: Heartbeat & TTL (Offline Detection)
This layer handles "Passive" failures where a charger goes offline without sending a disconnect signal.

-   **Mechanism**:
    -   **Charger**: Sends a lightweight "heartbeat" ping (or simple API call) every **5 minutes**.
    -   **Database**: Updates `last_seen_at` timestamp in `charger_status`.
    -   **Client Application (Flutter)**:
        -   When rendering a marker, checks:
            ```dart
            bool isOnline = (DateTime.now() - status.lastSeenAt).inMinutes < 15;
            ```
        -   If `isOnline` is false, status is shown as **OFFLINE/UNKNOWN** (Grey), regardless of the implementation state.
    -   **Background Job (Optional)**: A scheduled Edge Function runs hourly to proactively mark chargers as `offline` in the DB if `last_seen_at` > 1 hour, to save client-side calculation overhead for map filtering.

## 3. Client-Side Optimization
To prevent battery drain and excessive data usage on the mobile app:

-   **Viewport Subscription**: Only subscribe to Realtime changes for chargers currently within the map's visible bounds (or a slightly larger buffer).
-   **Unsubscribe**: Unsubscribe from channels when the user navigates away from the map or puts the app in background.
-   **Throttle**: Debounce map movement events to avoid spamming subscription requests.

## Data Schema Implication (Preview)
The `charger_status` table will need:
-   `charger_id` (FK)
-   `current_status` (ENUM: AVAILABLE, BUSY, ERROR, MAINT)
-   `last_seen_at` (TIMESTAMP)
-   `metadata` (JSONB: kW, voltage, etc.)
