-- Grant table-level permissions to the authenticated role for user_profiles

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.prayer_times TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.wellness_surveys TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.spiritual_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.halal_products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_recommendations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.deed_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_deeds TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.rewards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_rewards TO authenticated;