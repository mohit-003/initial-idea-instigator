
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  avatar_url?: string;
}

export interface FitnessData {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  distance: number;
  calories: number;
  active_minutes: number;
}

export interface FarmData {
  level: number;
  crops: Crop[];
  experience: number;
  next_level_xp: number;
  achievements: Achievement[];
  friends: Friend[];
  available_seeds: Seed[];
  farm_coins: number;
}

export interface Crop {
  id: string;
  name: string;
  growth_stage: number;
  max_growth_stage: number;
  planted_date: string;
  harvest_date?: string;
  water_level: number;
  health: number;
  rewards: {
    coins: number;
    experience: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface Seed {
  id: string;
  name: string;
  description: string;
  cost: number;
  growth_time: number; // hours to grow
  max_growth_stage: number;
  rewards: {
    coins: number;
    experience: number;
  };
  image_url: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlock_date?: string;
  progress: number;
  target: number;
  reward: {
    coins: number;
    experience: number;
    seeds?: Seed[];
  };
}

export interface Friend {
  user_id: string;
  username: string;
  avatar_url?: string;
  farm_level: number;
  last_active: string;
}

export interface Character {
  hair_style: number;
  hair_color: string;
  skin_tone: string;
  outfit: number;
  accessories: string[];
}

export interface ActivityLog {
  id: string;
  user_id: string;
  date: string;
  activity_type: 'crop_planted' | 'crop_harvested' | 'achievement_unlocked' | 'level_up' | 'friend_added';
  details: Record<string, any>;
}

export interface ProgressChart {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  active_minutes: number;
}

export interface SocialInteraction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  interaction_type: 'gift' | 'visit' | 'message' | 'help';
  details: Record<string, any>;
  created_at: string;
}
