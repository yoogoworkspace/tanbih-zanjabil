-- Location: supabase/migrations/20250926034724_islamic_wellness_auth.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete schema creation with authentication
-- Dependencies: None (first migration)

-- ================================
-- 1. TYPES AND ENUMS
-- ================================

CREATE TYPE public.user_role AS ENUM ('admin', 'user', 'imam', 'counselor');
CREATE TYPE public.prayer_status AS ENUM ('scheduled', 'completed', 'missed');
CREATE TYPE public.wellness_mood AS ENUM ('excellent', 'good', 'okay', 'difficult', 'struggling');
CREATE TYPE public.activity_type AS ENUM ('prayer', 'dhikr', 'quran_reading', 'dua', 'charity', 'reflection');

-- ================================
-- 2. CORE USER TABLES
-- ================================

-- Critical intermediary table (PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Prayer tracking and scheduling
CREATE TABLE public.prayer_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    prayer_name TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    actual_time TIMESTAMPTZ,
    status public.prayer_status DEFAULT 'scheduled'::public.prayer_status,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wellness survey and mood tracking
CREATE TABLE public.wellness_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    mood public.wellness_mood NOT NULL,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(3,1),
    spiritual_connection INTEGER CHECK (spiritual_connection BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Islamic activities tracking
CREATE TABLE public.spiritual_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Halal product verification
CREATE TABLE public.halal_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    brand TEXT,
    barcode TEXT,
    is_halal BOOLEAN,
    verification_source TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AI recommendations and guidance
CREATE TABLE public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'spiritual', 'wellness', 'prayer', 'charity'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 3. INDEXES FOR PERFORMANCE
-- ================================

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_prayer_times_user_id ON public.prayer_times(user_id);
CREATE INDEX idx_prayer_times_scheduled_time ON public.prayer_times(scheduled_time);
CREATE INDEX idx_wellness_surveys_user_id ON public.wellness_surveys(user_id);
CREATE INDEX idx_wellness_surveys_created_at ON public.wellness_surveys(created_at);
CREATE INDEX idx_spiritual_activities_user_id ON public.spiritual_activities(user_id);
CREATE INDEX idx_halal_products_user_id ON public.halal_products(user_id);
CREATE INDEX idx_ai_recommendations_user_id ON public.ai_recommendations(user_id);

-- ================================
-- 4. ROW LEVEL SECURITY SETUP
-- ================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.halal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- ================================
-- 5. RLS POLICIES (Pattern 1 & 2)
-- ================================

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for all other tables
CREATE POLICY "users_manage_own_prayer_times"
ON public.prayer_times
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_wellness_surveys"
ON public.wellness_surveys
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_spiritual_activities"
ON public.spiritual_activities
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_halal_products"
ON public.halal_products
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_ai_recommendations"
ON public.ai_recommendations
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ================================
-- 6. FUNCTIONS AND TRIGGERS
-- ================================

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ================================
-- 7. MOCK DATA FOR TESTING
-- ================================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    imam_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields for authentication
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@islamicwellness.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (imam_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'imam@islamicwellness.com', crypt('imam123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Imam Ahmad", "role": "imam"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'ahmed.hassan@email.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ahmed Hassan", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample prayer times
    INSERT INTO public.prayer_times (user_id, prayer_name, scheduled_time, status) VALUES
        (user_uuid, 'Fajr', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '5 hours', 'scheduled'),
        (user_uuid, 'Dhuhr', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '12 hours', 'scheduled'),
        (user_uuid, 'Asr', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '15 hours', 'scheduled'),
        (user_uuid, 'Maghrib', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '18 hours', 'scheduled'),
        (user_uuid, 'Isha', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '20 hours', 'scheduled');

    -- Create sample wellness survey
    INSERT INTO public.wellness_surveys (user_id, mood, stress_level, sleep_hours, spiritual_connection, notes) VALUES
        (user_uuid, 'good', 6, 7.5, 8, 'Feeling spiritually connected after morning prayer'),
        (user_uuid, 'excellent', 3, 8.0, 9, 'Had a peaceful day with regular dhikr');

    -- Create sample spiritual activities
    INSERT INTO public.spiritual_activities (user_id, activity_type, duration_minutes, notes) VALUES
        (user_uuid, 'prayer', 15, 'Maghrib prayer with family'),
        (user_uuid, 'quran_reading', 30, 'Read Surah Al-Baqarah verses 1-20'),
        (user_uuid, 'dhikr', 20, 'SubhanAllah x100, Alhamdulillah x100'),
        (user_uuid, 'dua', 10, 'Evening supplications');

    -- Create sample halal products
    INSERT INTO public.halal_products (user_id, product_name, brand, is_halal, verification_source, notes) VALUES
        (user_uuid, 'Chicken Nuggets', 'Halal Foods Co.', true, 'Official Halal Certificate', 'Certified by Islamic Council'),
        (user_uuid, 'Beef Jerky', 'Snack Brand', false, 'Ingredient Check', 'Contains non-halal additives');

    -- Create sample AI recommendations
    INSERT INTO public.ai_recommendations (user_id, category, title, content, priority) VALUES
        (user_uuid, 'spiritual', 'Morning Dhikr Reminder', 'Start your day with Adhkar Al-Sabah for spiritual protection and barakah.', 4),
        (user_uuid, 'wellness', 'Stress Management', 'Based on your wellness survey, try incorporating more istighfar in your daily routine.', 3),
        (user_uuid, 'prayer', 'Prayer Time Optimization', 'Consider setting reminders 15 minutes before each prayer time for better preparation.', 5);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- ================================
-- 8. HELPER FUNCTIONS
-- ================================

-- Function to get user prayer statistics
CREATE OR REPLACE FUNCTION public.get_user_prayer_stats(user_uuid UUID)
RETURNS TABLE(
    total_prayers BIGINT,
    completed_prayers BIGINT,
    completion_rate DECIMAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
    COUNT(*) as total_prayers,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_prayers,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
        2
    ) as completion_rate
FROM public.prayer_times pt
WHERE pt.user_id = user_uuid
AND pt.created_at >= CURRENT_DATE - INTERVAL '30 days';
$$;

-- Function to get wellness trends
CREATE OR REPLACE FUNCTION public.get_wellness_trend(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE(
    date DATE,
    avg_mood_score DECIMAL,
    avg_stress_level DECIMAL,
    avg_spiritual_connection DECIMAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
    ws.created_at::DATE as date,
    AVG(
        CASE ws.mood
            WHEN 'excellent' THEN 5
            WHEN 'good' THEN 4
            WHEN 'okay' THEN 3
            WHEN 'difficult' THEN 2
            WHEN 'struggling' THEN 1
        END
    ) as avg_mood_score,
    AVG(ws.stress_level::DECIMAL) as avg_stress_level,
    AVG(ws.spiritual_connection::DECIMAL) as avg_spiritual_connection
FROM public.wellness_surveys ws
WHERE ws.user_id = user_uuid
AND ws.created_at >= CURRENT_DATE - INTERVAL '%s days'
GROUP BY ws.created_at::DATE
ORDER BY date DESC;
$$;