-- Migration to create tables for tracking user deeds and progress.

-- ================================
-- 1. DEED TEMPLATES TABLE
-- ================================
CREATE TABLE public.deed_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deed_name TEXT NOT NULL UNIQUE,
    deed_category TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false -- To mark deeds that are added for all new users
);

-- ================================
-- 2. USER DEEDS TABLE
-- ================================
CREATE TABLE public.user_deeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    deed_template_id UUID REFERENCES public.deed_templates(id) ON DELETE CASCADE,
    deed_name TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 3. INDEXES FOR PERFORMANCE
-- ================================
CREATE INDEX idx_user_deeds_user_id_due_date ON public.user_deeds(user_id, due_date);
CREATE INDEX idx_deed_templates_category ON public.deed_templates(deed_category);

-- ================================
-- 4. ROW LEVEL SECURITY
-- ================================
ALTER TABLE public.deed_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_deeds ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read deed templates
CREATE POLICY "allow_read_for_authenticated_users"
ON public.deed_templates
FOR SELECT
TO authenticated
USING (true);

-- Users can manage their own deeds
CREATE POLICY "users_manage_own_deeds"
ON public.user_deeds
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ================================
-- 5. SEED DEFAULT DEEDS
-- ================================
INSERT INTO public.deed_templates (deed_name, deed_category, description, is_default) VALUES
('Fajr Prayer', 'Prayer', 'Morning prayer before sunrise.', true),
('Dhuhr Prayer', 'Prayer', 'Midday prayer.', true),
('Asr Prayer', 'Prayer', 'Afternoon prayer.', true),
('Maghrib Prayer', 'Prayer', 'Evening prayer after sunset.', true),
('Isha Prayer', 'Prayer', 'Night prayer.', true),
('Read Qur''an for 15 minutes', 'Quran', 'Spend time reading the Holy Qur''an.', true),
('Morning Dhikr', 'Dhikr', 'Perform morning remembrances (Adhkar al-Sabah).', true),
('Evening Dhikr', 'Dhikr', 'Perform evening remembrances (Adhkar al-Masa).', true),
('Give Charity', 'Charity', 'Donate to a cause or help someone in need.', false),
('Sunnah Prayers (Rawatib)', 'Prayer', 'Perform the voluntary prayers associated with the five daily prayers.', false),
('Duha Prayer', 'Prayer', 'Perform the mid-morning prayer.', false),
('Tahajjud Prayer', 'Prayer', 'Perform the late-night voluntary prayer.', false);

-- ================================
-- 6. HELPER FUNCTION
-- ================================
-- This function will assign the default deeds to a new user upon profile creation.
CREATE OR REPLACE FUNCTION public.assign_default_deeds_to_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_deeds (user_id, deed_template_id, deed_name, due_date)
  SELECT
    NEW.id,
    dt.id,
    dt.deed_name,
    CURRENT_DATE
  FROM public.deed_templates dt
  WHERE dt.is_default = true;
  RETURN NEW;
END;
$$;

-- Trigger to call the function when a new user profile is created
CREATE TRIGGER on_user_profile_created_assign_deeds
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_deeds_to_new_user();