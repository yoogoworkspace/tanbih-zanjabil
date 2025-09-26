-- Migration to create the function for checking and awarding monthly deed rewards.

CREATE OR REPLACE FUNCTION public.check_and_award_monthly_deed_reward(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reward_id UUID;
    v_completion_threshold INT;
    v_duration_days INT;
    v_completion_percentage DECIMAL;
    v_last_reward_date TIMESTAMPTZ;
    v_reward_awarded BOOLEAN := false;
BEGIN
    -- Get the monthly reward details
    SELECT id, completion_threshold_percent, duration_days
    INTO v_reward_id, v_completion_threshold, v_duration_days
    FROM public.rewards
    WHERE reward_name = 'Monthly Deed Completion' AND is_active = true
    LIMIT 1;

    -- If no reward is found, exit
    IF v_reward_id IS NULL THEN
        RAISE NOTICE 'No active monthly deed reward found.';
        RETURN false;
    END IF;

    -- Check if the user has already been awarded this reward in the current period
    SELECT awarded_at
    INTO v_last_reward_date
    FROM public.user_rewards
    WHERE user_id = p_user_id
      AND reward_id = v_reward_id
      AND awarded_at >= (NOW() - (v_duration_days || ' days')::interval)
    ORDER BY awarded_at DESC
    LIMIT 1;

    IF v_last_reward_date IS NOT NULL THEN
        RAISE NOTICE 'User has already been awarded the monthly reward in the current period.';
        RETURN false;
    END IF;

    -- Calculate the completion percentage for the last 30 days
    WITH user_deeds_last_30_days AS (
        SELECT is_completed
        FROM public.user_deeds
        WHERE user_id = p_user_id
          AND due_date >= (CURRENT_DATE - (v_duration_days || ' days')::interval)
          AND due_date < CURRENT_DATE
    )
    SELECT
        (COUNT(*) FILTER (WHERE is_completed = true)::DECIMAL * 100) / NULLIF(COUNT(*), 0)
    INTO v_completion_percentage
    FROM user_deeds_last_30_days;

    RAISE NOTICE 'User completion percentage: %', v_completion_percentage;

    -- If the user meets the threshold, award the reward
    IF v_completion_percentage IS NOT NULL AND v_completion_percentage >= v_completion_threshold THEN
        INSERT INTO public.user_rewards (user_id, reward_id)
        VALUES (p_user_id, v_reward_id);
        v_reward_awarded := true;
        RAISE NOTICE 'Reward awarded to user %', p_user_id;
    ELSE
        RAISE NOTICE 'User did not meet the reward threshold.';
    END IF;

    RETURN v_reward_awarded;

END;
$$;