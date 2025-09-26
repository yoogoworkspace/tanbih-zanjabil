import { supabase } from '../lib/supabase';

// Authentication service for Islamic Wellness Platform
export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          error: {
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
          }
        };
      }
      
      return {
        error: {
          message: 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  // Sign up with email and password
  async signUp(email, password, fullName, role = 'user') {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (error) {
        return { error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          error: {
            message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
          }
        };
      }
      
      return {
        error: {
          message: 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      
      if (error) {
        return { error: { message: error?.message } };
      }
      
      return { error: null };
    } catch (error) {
      return {
        error: {
          message: 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      
      if (error) {
        return { session: null, error: { message: error?.message } };
      }
      
      return { session, error: null };
    } catch (error) {
      return {
        session: null,
        error: {
          message: 'Network error. Please check your connection and try again.'
        }
      };
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();
      
      if (error) {
        return { profile: null, error: { message: error?.message } };
      }
      
      return { profile: data, error: null };
    } catch (error) {
      return {
        profile: null,
        error: {
          message: 'Failed to load profile. Please try again.'
        }
      };
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(updates)
        ?.eq('id', userId)
        ?.select()
        ?.single();
      
      if (error) {
        return { profile: null, error: { message: error?.message } };
      }
      
      return { profile: data, error: null };
    } catch (error) {
      return {
        profile: null,
        error: {
          message: 'Failed to update profile. Please try again.'
        }
      };
    }
  }
};