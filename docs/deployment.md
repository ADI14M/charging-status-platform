# Deployment & Production Checklist

## 1. Supabase (Backend)
- [ ] **Environment Separation**: Ensure you have two separate projects: `ev-charging-dev` and `ev-charging-prod`.
- [ ] **Sync Schema**: Run migrations on Prod:
  ```bash
  supabase link --project-ref <prod-project-id>
  supabase db push
  ```
- [ ] **Edge Functions Policies**:
  - Enforce `verifyJWT` on sensitive functions (`payment-create-order`).
  - Set Secrets in Prod:
    ```bash
    supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=... FCM_SERVER_KEY=... --env-file .env.prod
    ```
- [ ] **Auth Settings**:
  - Disable "Enable Email Signup" if you only want Phone/Google.
  - Configure Google Auth Client IDs for Android/iOS in Supabase Dashboard.
  - Redirect URLs: Add `io.supabase.evcharging://login-callback` for deep linking.

## 2. Admin Panel (Next.js on Vercel)
- [ ] **Build Settings**: 
  - Framework Preset: Next.js
  - Root Directory: `admin-panel`
- [ ] **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Prod URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Prod Anon Key
- [ ] **Domain**: Map custom domain (e.g., `admin.evchargemaster.com`).

## 3. Mobile App (Flutter)
- [ ] **App Signing**:
  - Generate Keystore: `keytool -genkey -v -keystore my-release-key.jks ...`
  - Create `key.properties` (DO NOT COMMIT).
- [ ] **Google Cloud Console**:
  - Enable "Maps SDK for Android" & "Maps SDK for iOS".
  - Restrict API Keys to your package name (`com.evcharging.app`) and SHA-1 fingerprint.
- [ ] **Razorpay**:
  - Switch SDK key from `rzp_test_...` to `rzp_live_...`.
- [ ] **Permissions**:
  - Verify `AndroidManifest.xml` has:
    ```xml
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.INTERNET" />
    ```
  - iOS `Info.plist`: Key `NSLocationWhenInUseUsageDescription` must have a valid string explaining usage.

## 4. Security & Compliance
- [ ] **RLS Audit**: Ensure NO policies allow `true` for INSERT/UPDATE unless strictly intended.
  - *Critical*: `charger_status` should only be writable by Owners (for specific fields) or Edge Functions.
- [ ] **Data Privacy**: Add Privacy Policy URL in Auth screen (required for Play Store).
- [ ] **Payment Security**:
  - Ensure `payment-verify` function strictly checks Signature.
  - Never log full credit card info (Razorpay handles this, but don't log inputs excessively).
