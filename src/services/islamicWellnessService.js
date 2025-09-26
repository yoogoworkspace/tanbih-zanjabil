import { supabase } from '../lib/supabase';

// Islamic Wellness Platform service for managing user data
export const islamicWellnessService = {
  
  // ================================
  // PRAYER TIMES SERVICE
  // ================================
  async getPrayerTimes(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('prayer_times')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('scheduled_time', { ascending: true })
        ?.limit(limit);
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load prayer times. Please try again.' }
      };
    }
  },

  async createPrayerTime(userId, prayerData) {
    try {
      const { data, error } = await supabase
        ?.from('prayer_times')
        ?.insert([{ ...prayerData, user_id: userId }])
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to create prayer time. Please try again.' }
      };
    }
  },

  async updatePrayerStatus(prayerId, status, actualTime = null) {
    try {
      const updateData = { status };
      if (actualTime) {
        updateData.actual_time = actualTime;
      }

      const { data, error } = await supabase
        ?.from('prayer_times')
        ?.update(updateData)
        ?.eq('id', prayerId)
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to update prayer status. Please try again.' }
      };
    }
  },

  // ================================
  // WELLNESS SURVEYS SERVICE
  // ================================
  async getWellnessSurveys(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('wellness_surveys')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load wellness surveys. Please try again.' }
      };
    }
  },

  async createWellnessSurvey(userId, surveyData) {
    try {
      const { data, error } = await supabase
        ?.from('wellness_surveys')
        ?.insert([{ ...surveyData, user_id: userId }])
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to save wellness survey. Please try again.' }
      };
    }
  },

  // ================================
  // SPIRITUAL ACTIVITIES SERVICE
  // ================================
  async getSpiritualActivities(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        ?.from('spiritual_activities')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('completed_at', { ascending: false })
        ?.limit(limit);
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load spiritual activities. Please try again.' }
      };
    }
  },

  async createSpiritualActivity(userId, activityData) {
    try {
      const { data, error } = await supabase
        ?.from('spiritual_activities')
        ?.insert([{ ...activityData, user_id: userId }])
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to save spiritual activity. Please try again.' }
      };
    }
  },

  // ================================
  // HALAL PRODUCTS SERVICE
  // ================================
  async getHalalProducts(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        ?.from('halal_products')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load halal products. Please try again.' }
      };
    }
  },

  async createHalalProduct(userId, productData) {
    try {
      const { data, error } = await supabase
        ?.from('halal_products')
        ?.insert([{ ...productData, user_id: userId }])
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to save halal product. Please try again.' }
      };
    }
  },

  async updateHalalProduct(productId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('halal_products')
        ?.update(updates)
        ?.eq('id', productId)
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to update halal product. Please try again.' }
      };
    }
  },

  // ================================
  // AI RECOMMENDATIONS SERVICE
  // ================================
  async getAIRecommendations(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('ai_recommendations')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('priority', { ascending: false })
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load AI recommendations. Please try again.' }
      };
    }
  },

  async markRecommendationAsRead(recommendationId) {
    try {
      const { data, error } = await supabase
        ?.from('ai_recommendations')
        ?.update({ is_read: true })
        ?.eq('id', recommendationId)
        ?.select()
        ?.maybeSingle();
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to mark recommendation as read. Please try again.' }
      };
    }
  },

  // ================================
  // ANALYTICS AND STATISTICS
  // ================================
  async getPrayerStats(userId) {
    try {
      const { data, error } = await supabase
        ?.rpc('get_user_prayer_stats', { user_uuid: userId });
      
      if (error) {
        return { data: null, error: { message: error?.message } };
      }
      
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: 'Failed to load prayer statistics. Please try again.' }
      };
    }
  },

  async getWellnessTrend(userId, daysBack = 30) {
    try {
      const { data, error } = await supabase
        ?.rpc('get_wellness_trend', { 
          user_uuid: userId, 
          days_back: daysBack 
        });
      
      if (error) {
        return { data: [], error: { message: error?.message } };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      return {
        data: [],
        error: { message: 'Failed to load wellness trends. Please try again.' }
      };
    }
  }
};