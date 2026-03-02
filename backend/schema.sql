-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('user', 'charger_owner', 'admin');

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE, -- For charger owners
    trust_score INTEGER DEFAULT 100, -- Gamification / User reliability score
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. CHARGING STATIONS (Venues)
-- -----------------------------------------------------------------------------
CREATE TYPE station_status AS ENUM ('active', 'pending_approval', 'suspended', 'maintenance');

CREATE TABLE public.charging_stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL, -- PostGIS for filtering by lat/long
    images TEXT[], -- Array of image URLs
    amenities TEXT[], -- e.g. ['wifi', 'cafe', 'restroom']
    status station_status DEFAULT 'pending_approval',
    avg_rating NUMERIC(2, 1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    verification_score INTEGER DEFAULT 0, -- Calculated from confirmation logs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Geospatial search
CREATE INDEX idx_stations_location ON public.charging_stations USING GIST (location);
CREATE INDEX idx_stations_owner ON public.charging_stations(owner_id);

ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active stations are viewable by everyone" 
    ON public.charging_stations FOR SELECT 
    USING (status = 'active');

CREATE POLICY "Owners can view own stations" 
    ON public.charging_stations FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own stations" 
    ON public.charging_stations FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own stations" 
    ON public.charging_stations FOR UPDATE 
    USING (auth.uid() = owner_id);

-- -----------------------------------------------------------------------------
-- 3. CHARGERS (Individual Units) & PRICING
-- -----------------------------------------------------------------------------
CREATE TYPE connector_type AS ENUM ('type2', 'ccs2', 'chademo', 'gbt', 'wall_socket');

CREATE TABLE public.chargers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES public.charging_stations(id) ON DELETE CASCADE NOT NULL,
    connector_type connector_type NOT NULL,
    max_power_kw NUMERIC(5, 2) NOT NULL, -- e.g. 7.2, 50.0
    price_per_kwh NUMERIC(10, 2) NOT NULL, -- In INR
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chargers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chargers are viewable by everyone" 
    ON public.chargers FOR SELECT USING (true);

CREATE POLICY "Owners can manage chargers" 
    ON public.chargers FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.charging_stations s 
        WHERE s.id = chargers.station_id AND s.owner_id = auth.uid()
    ));

-- -----------------------------------------------------------------------------
-- 4. CHARGER STATUS (Real-time)
-- -----------------------------------------------------------------------------
CREATE TYPE charger_state AS ENUM ('available', 'charging', 'preparation', 'offline', 'error');

CREATE TABLE public.charger_status (
    charger_id UUID REFERENCES public.chargers(id) ON DELETE CASCADE PRIMARY KEY,
    current_status charger_state DEFAULT 'offline',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    current_session_id UUID, -- Link to active transaction if occupied
    metadata JSONB DEFAULT '{}'::jsonb, -- e.g. { "current": 16.5, "voltage": 230 }
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.charger_status;

ALTER TABLE public.charger_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Status viewable by everyone" 
    ON public.charger_status FOR SELECT USING (true);

-- Only Edge Functions or Hardware (via Service Role) should write to this typically.
-- If Owners manually update:
CREATE POLICY "Owners can update status" 
    ON public.charger_status FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.chargers c
        JOIN public.charging_stations s ON c.station_id = s.id
        WHERE c.id = charger_status.charger_id AND s.owner_id = auth.uid()
    ));

-- -----------------------------------------------------------------------------
-- 5. TRANSACTIONS
-- -----------------------------------------------------------------------------
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    charger_id UUID REFERENCES public.chargers(id) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_provider_id TEXT, -- Razorpay Order ID
    units_consumed_kwh NUMERIC(10, 3) DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON public.transactions(user_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transactions" 
    ON public.transactions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Owners view transactions for their chargers" 
    ON public.transactions FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.chargers c
        JOIN public.charging_stations s ON c.station_id = s.id
        WHERE c.id = transactions.charger_id AND s.owner_id = auth.uid()
    ));

-- -----------------------------------------------------------------------------
-- 6. REVIEWS & TRUST SCORES
-- -----------------------------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES public.charging_stations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can review" 
    ON public.reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- USER CONFIRMATION LOGS (Works / Doesn't Work)
CREATE TABLE public.verification_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES public.charging_stations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    is_working BOOLEAN NOT NULL,
    issue_reported TEXT, -- Optional description of failure
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view logs" ON public.verification_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert logs" ON public.verification_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. DATABASE FUNCTIONS
-- -----------------------------------------------------------------------------
-- Function to update station rating on new review
CREATE OR REPLACE FUNCTION update_station_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.charging_stations
    SET 
        avg_rating = (SELECT AVG(rating) FROM public.reviews WHERE station_id = NEW.station_id),
        total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE station_id = NEW.station_id)
    WHERE id = NEW.station_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_added
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_station_rating();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
