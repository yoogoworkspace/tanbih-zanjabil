-- Migration to add notification preferences to the user_profiles table.

ALTER TABLE public.user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{
  "prayers": {
    "fajr": true,
    "dhuhr": true,
    "asr": true,
    "maghrib": true,
    "isha": true,
    "jumah": true,
    "reminderTime": "15"
  },
  "sunnah": {
    "rawatib": true,
    "tahajjud": false,
    "duha": true,
    "tarawih": true
  },
  "dhikr": {
    "morning": true,
    "evening": true,
    "sleep": true,
    "wakeup": true,
    "frequency": "daily"
  },
  "special": {
    "laylatAlQadr": true,
    "islamicHolidays": true,
    "ramadan": true,
    "hajj": true
  }
}'::jsonb;

-- Update the RLS policy to allow users to update their own notification preferences.
DROP POLICY "users_manage_own_user_profiles" ON public.user_profiles;

CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());