-- Migration to create tables for the user incentive and reward system.

-- ================================
-- 1. REWARDS TABLE
-- ================================
-- This table will store the details of available rewards.
CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_name TEXT NOT NULL,
    description TEXT,
    amount_usd DECIMAL(10, 2) NOT NULL,
    completion_threshold_percent INTEGER NOT NULL CHECK (completion_threshold_percent BETWEEN 0 AND 100),
    duration_days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 2. USER REWARDS TABLE
-- ================================
-- This table will track the rewards that have been awarded to users.
CREATE TABLE public.user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_claimed BOOLEAN DEFAULT false,
    claimed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_reward_period UNIQUE (user_id, reward_id, awarded_at)
);

-- ================================
-- 3. INDEXES FOR PERFORMANCE
-- ================================
CREATE INDEX idx_user_rewards_user_id ON public.user_rewards(user_id);

-- ================================
-- 4. ROW LEVEL SECURITY
-- ================================
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read available rewards.
CREATE POLICY "allow_read_for_authenticated_users"
ON public.rewards
FOR SELECT
TO authenticated
USING (is_active = true);

-- Users can view their own awarded rewards.
CREATE POLICY "users_view_own_rewards"
ON public.user_rewards
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ================================
-- 5. SEED DEFAULT REWARD
-- ================================
INSERT INTO public.rewards (reward_name, description, amount_usd, completion_threshold_percent, duration_days, is_active) VALUES
('Monthly Deed Completion', 'Awarded for completing 80% or more of daily deeds over a 30-day period.', 2.00, 80, 30, true);