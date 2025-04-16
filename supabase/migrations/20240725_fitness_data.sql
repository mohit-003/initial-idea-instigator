
-- Create enum for activity types
CREATE TYPE public.activity_type AS ENUM ('walking', 'running', 'cycling', 'workout');

-- Create table for user fitness data
CREATE TABLE IF NOT EXISTS public.fitness_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  distance DOUBLE PRECISION NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  active_minutes INTEGER NOT NULL DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create in-game currency table
CREATE TABLE IF NOT EXISTS public.user_currency (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coins INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.fitness_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_currency ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see and modify their own fitness data
CREATE POLICY "Users can view their own fitness data" 
  ON public.fitness_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness data" 
  ON public.fitness_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only see and modify their own currency
CREATE POLICY "Users can view their own currency" 
  ON public.user_currency 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only the application can update currency (using service role)
CREATE POLICY "Users can insert their currency" 
  ON public.user_currency 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to calculate coins from fitness activity
CREATE OR REPLACE FUNCTION public.calculate_coins_from_activity()
RETURNS TRIGGER AS $$
DECLARE
  coins_earned INTEGER;
BEGIN
  -- Simple calculation: 1 coin per 100 steps
  coins_earned := NEW.steps / 100;
  
  -- Update user's currency
  INSERT INTO public.user_currency (user_id, coins)
  VALUES (NEW.user_id, coins_earned)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    coins = user_currency.coins + coins_earned,
    last_updated = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update coins when new fitness activity is added
CREATE TRIGGER update_coins_after_activity
  AFTER INSERT ON public.fitness_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_coins_from_activity();
