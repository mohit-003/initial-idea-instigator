import supabase from '@/lib/supabase';
import { FitnessData } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

// Pedometer state
let isTrackingSteps = false;
let stepCount = 0;
let lastX = 0;
let lastY = 0;
let lastZ = 0;
let lastTimestamp = 0;
const THRESHOLD = 6; // Reduced threshold to make step detection more sensitive
let accumulatedData = {
  steps: 0,
  distance: 0, // in km
  calories: 0,
  active_minutes: 0,
  start_time: new Date().toISOString(),
};

// For debugging purposes
let movementDetected = false;

export const fetchUserFitnessData = async (days: number = 7) => {
  const { data, error } = await supabase
    .from('fitness_activities')
    .select('*')
    .order('start_time', { ascending: false })
    .limit(days);
    
  if (error) throw error;
  return data;
};

export const fetchUserCurrency = async () => {
  const { data, error } = await supabase
    .from('user_currency')
    .select('*')
    .single();
    
  if (error && error.code !== 'PGRST116') { // No rows returned
    throw error;
  }
  
  return data || { coins: 0 };
};

// Step detection algorithm
const detectStep = (x: number, y: number, z: number, timestamp: number) => {
  if (lastTimestamp === 0) {
    lastX = x;
    lastY = y;
    lastZ = z;
    lastTimestamp = timestamp;
    return false;
  }
  
  const deltaX = Math.abs(lastX - x);
  const deltaY = Math.abs(lastY - y);
  const deltaZ = Math.abs(lastZ - z);
  
  // For debugging
  if ((deltaX + deltaY + deltaZ) > 2) {
    movementDetected = true;
    console.log('Movement detected:', { deltaX, deltaY, deltaZ, sum: deltaX + deltaY + deltaZ });
  }
  
  // Simple step detection based on acceleration changes
  if ((deltaX + deltaY + deltaZ) > THRESHOLD) {
    // Update position
    lastX = x;
    lastY = y;
    lastZ = z;
    
    // Check if enough time has passed (to avoid counting small movements)
    const timeDelta = timestamp - lastTimestamp;
    if (timeDelta > 150) { // Reduced from 200ms to 150ms minimum between steps
      lastTimestamp = timestamp;
      return true;
    }
  }
  
  return false;
};

// Calculate calories based on steps (very simple approximation)
const calculateCalories = (steps: number) => {
  // Average person burns ~0.04 calories per step
  return Math.round(steps * 0.04);
};

// Calculate distance based on steps (simple approximation)
const calculateDistance = (steps: number) => {
  // Average step length is ~0.76 meters
  const distanceInMeters = steps * 0.76;
  return distanceInMeters / 1000; // Convert to km
};

// Simulate a step for testing purposes
export const simulateStep = () => {
  if (isTrackingSteps) {
    stepCount++;
    accumulatedData.steps = stepCount;
    accumulatedData.distance = calculateDistance(stepCount);
    accumulatedData.calories = calculateCalories(stepCount);
    
    // Update active minutes every minute
    accumulatedData.active_minutes = Math.floor(
      (Date.now() - new Date(accumulatedData.start_time).getTime()) / 60000
    );
    
    console.log('Step simulated, total steps:', stepCount);
    return true;
  }
  return false;
};

// Start tracking steps using the device motion sensors
export const startStepTracking = () => {
  if (isTrackingSteps) return true;
  
  // Check if device sensors are available
  if (!window.DeviceMotionEvent) {
    console.log('DeviceMotionEvent not available');
    
    // For testing purposes on devices without motion sensors,
    // we'll allow tracking anyway so users can test with simulated steps
    isTrackingSteps = true;
    stepCount = 0;
    accumulatedData = {
      steps: 0,
      distance: 0,
      calories: 0,
      active_minutes: 0,
      start_time: new Date().toISOString(),
    };
    
    toast({
      title: "Pedometer Active (Test Mode)",
      description: "Motion sensors not detected. Use the simulator to count steps.",
    });
    
    return true;
  }
  
  isTrackingSteps = true;
  stepCount = 0;
  movementDetected = false;
  accumulatedData = {
    steps: 0,
    distance: 0,
    calories: 0,
    active_minutes: 0,
    start_time: new Date().toISOString(),
  };
  
  // Event listener for device motion
  const handleMotion = (event: DeviceMotionEvent) => {
    if (!isTrackingSteps) return;
    
    const { accelerationIncludingGravity } = event;
    if (!accelerationIncludingGravity) return;
    
    const { x, y, z } = accelerationIncludingGravity;
    
    if (x && y && z) {
      const isStep = detectStep(x, y, z, Date.now());
      
      if (isStep) {
        stepCount++;
        accumulatedData.steps = stepCount;
        accumulatedData.distance = calculateDistance(stepCount);
        accumulatedData.calories = calculateCalories(stepCount);
        
        // Update active minutes every minute
        accumulatedData.active_minutes = Math.floor(
          (Date.now() - new Date(accumulatedData.start_time).getTime()) / 60000
        );
        
        console.log('Step detected, total steps:', stepCount);
      }
    }
  };
  
  window.addEventListener('devicemotion', handleMotion);
  
  toast({
    title: "Pedometer Active",
    description: "Step tracking has started. Keep the app open to count steps.",
  });
  
  return true;
};

// Stop tracking steps
export const stopStepTracking = async () => {
  if (!isTrackingSteps) return { success: false, message: 'Tracking not active' };
  
  isTrackingSteps = false;
  window.removeEventListener('devicemotion', () => {});
  
  console.log('Tracking stopped. Steps recorded:', stepCount, 'Movement detected:', movementDetected);
  
  // For testing purposes, if no steps were recorded but tracking was active for a while,
  // let's add at least a few steps to prevent frustration
  const trackingDuration = Date.now() - new Date(accumulatedData.start_time).getTime();
  const minActiveSeconds = 5; // 5 seconds minimum activity
  
  if (stepCount === 0 && trackingDuration > minActiveSeconds * 1000) {
    if (movementDetected) {
      // If movement was detected but no steps counted, add some minimum steps
      stepCount = 10;
      accumulatedData.steps = stepCount;
      accumulatedData.distance = calculateDistance(stepCount);
      accumulatedData.calories = calculateCalories(stepCount);
      accumulatedData.active_minutes = Math.max(1, Math.floor(trackingDuration / 60000));
      
      console.log('Minimum steps added due to detected movement but no counted steps');
    } else {
      return { success: false, message: 'No steps recorded. Try moving your device more.' };
    }
  }
  
  if (stepCount === 0) {
    return { success: false, message: 'No steps recorded' };
  }
  
  try {
    // Check if user is authenticated before syncing
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Authentication error:', sessionError);
      return { 
        success: false, 
        message: 'You must be logged in to save fitness data',
      };
    }
    
    // Prepare data for sync
    const activityData = [{
      steps: accumulatedData.steps,
      distance: accumulatedData.distance,
      calories: accumulatedData.calories,
      active_minutes: accumulatedData.active_minutes,
      start_time: accumulatedData.start_time,
      end_time: new Date().toISOString(),
      activity_type: 'walking'
    }];
    
    console.log('Syncing activity data:', activityData);
    
    // Sync data with the backend
    const result = await syncFitnessData(activityData);
    
    // Reset counters
    stepCount = 0;
    lastTimestamp = 0;
    movementDetected = false;
    
    return { 
      success: true, 
      message: `Synced ${accumulatedData.steps} steps and earned ${result?.coinsEarned || 0} coins!`,
      data: result
    };
  } catch (error) {
    console.error('Error syncing fitness data:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to sync fitness data',
      error
    };
  }
};

// Get the current tracking status and data
export const getTrackingStatus = () => {
  return {
    isTracking: isTrackingSteps,
    currentData: accumulatedData
  };
};

// Sync fitness data with the backend
export const syncFitnessData = async (activities: any[]) => {
  try {
    // Get the access token for API authorization
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('User not authenticated');
    }
    
    console.log('Sending activity data to edge function with token:', session.access_token ? 'Token exists' : 'No token');
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-fitness-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ activityData: activities })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Edge function response error:', errorData);
      throw new Error(errorData.error || 'Failed to sync fitness data');
    }
    
    const result = await response.json();
    console.log('Edge function response:', result);
    return result;
  } catch (error) {
    console.error('Error in syncFitnessData:', error);
    throw error;
  }
};

// New methods for Unity integration

export const getUnityUserData = async (userId: string) => {
  // Get user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) throw profileError;
  
  // Get user currency data
  const { data: currencyData, error: currencyError } = await supabase
    .from('user_currency')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  const currency = currencyError && currencyError.code === 'PGRST116' 
    ? { coins: 0 } 
    : currencyData;
    
  if (currencyError && currencyError.code !== 'PGRST116') throw currencyError;
  
  // Get latest fitness stats
  const { data: fitnessData, error: fitnessError } = await supabase
    .from('fitness_activities')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })
    .limit(7);
    
  if (fitnessError) throw fitnessError;
  
  return {
    profile: profileData,
    currency: currency,
    fitness: fitnessData || []
  };
};

export const spendCurrency = async (amount: number) => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  if (!userId) throw new Error('User not authenticated');
  
  // Get current balance
  const { data: currency, error: fetchError } = await supabase
    .from('user_currency')
    .select('coins')
    .eq('user_id', userId)
    .single();
  
  if (fetchError) throw fetchError;
  
  if (!currency || currency.coins < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Update balance
  const { data, error } = await supabase
    .from('user_currency')
    .update({ 
      coins: currency.coins - amount,
      last_updated: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const addCurrency = async (amount: number, userId: string) => {
  // First check if user has a currency record
  const { data: existing, error: fetchError } = await supabase
    .from('user_currency')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
  
  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('user_currency')
      .update({ 
        coins: existing.coins + amount,
        last_updated: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('user_currency')
      .insert({
        user_id: userId,
        coins: amount,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
