
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for Unity game integration
 * Contains methods to authenticate and synchronize data between web app and Unity game
 */
export const unityIntegrationService = {
  /**
   * Get the current user's access token for Unity authentication
   * @returns A promise that resolves to the access token or null if not authenticated
   */
  async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },
  
  /**
   * Get the current user's data for Unity
   * @returns User data including profile, currency, and fitness data
   */
  async getUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }
      
      const response = await supabase.functions.invoke('unity-game-api', {
        body: {},
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'X-Path': 'get-user-data'
        }
      });
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error('Error getting user data for Unity:', error);
      throw error;
    }
  },
  
  /**
   * Spend coins in the Unity game
   * @param amount The amount of coins to spend
   * @returns Updated currency data
   */
  async spendCoins(amount: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }
      
      const response = await supabase.functions.invoke('unity-game-api', {
        body: { amount },
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'X-Path': 'spend-coins'
        }
      });
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error('Error spending coins:', error);
      throw error;
    }
  },
  
  /**
   * Save game progress from Unity
   * @param progress The progress data from Unity
   * @returns Success status
   */
  async saveGameProgress(progress: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }
      
      const response = await supabase.functions.invoke('unity-game-api', {
        body: { progress },
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'X-Path': 'add-game-progress'
        }
      });
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error('Error saving game progress:', error);
      throw error;
    }
  },
  
  /**
   * Generate a deep link URL to open the Unity game with auth token
   * @returns URL to launch the Unity game with authentication
   */
  generateGameDeepLink(): string {
    // This would be replaced with your actual Unity game deep link scheme
    // Example: unitygame://auth?token=xyz
    return `unitygame://auth?appId=${encodeURIComponent(import.meta.env.VITE_SUPABASE_URL)}`;
  }
};

// Also export with a more memorable name
export const unityGame = unityIntegrationService;
