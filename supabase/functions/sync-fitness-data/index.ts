
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Parse the fitness data from the request body
    const { activityData } = await req.json()
    
    if (!activityData || !Array.isArray(activityData)) {
      return new Response(
        JSON.stringify({ error: 'Invalid activity data format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Transform and insert the fitness data
    const fitnessData = activityData.map((activity: any) => ({
      user_id: user.id,
      activity_type: activity.activity_type || 'walking',
      steps: activity.steps || 0,
      distance: activity.distance || 0,
      calories: activity.calories || 0,
      active_minutes: activity.active_minutes || 0,
      start_time: activity.start_time,
      end_time: activity.end_time || new Date().toISOString(),
    }))
    
    // Insert the fitness data
    const { error } = await supabaseClient
      .from('fitness_activities')
      .insert(fitnessData)
    
    if (error) throw error
    
    // Calculate coins earned (1 coin per 100 steps)
    const totalSteps = fitnessData.reduce((sum: number, activity: any) => sum + activity.steps, 0)
    const coinsEarned = Math.floor(totalSteps / 100)
    
    // Get the current currency for the user
    const { data: currencyData, error: currencyFetchError } = await supabaseClient
      .from('user_currency')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    
    if (currencyFetchError && currencyFetchError.code !== 'PGRST116') throw currencyFetchError
    
    let currentCoins = 0;
    let currencyExists = false;
    
    // Check if user already has a currency record
    if (currencyData) {
      currentCoins = currencyData.coins || 0;
      currencyExists = true;
    }
    
    let updatedCurrency;
    
    // Update or insert the user's currency based on whether a record exists
    if (currencyExists) {
      // Update existing record
      const { data, error: updateError } = await supabaseClient
        .from('user_currency')
        .update({
          coins: currentCoins + coinsEarned,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      updatedCurrency = data;
    } else {
      // Insert new record
      const { data, error: insertError } = await supabaseClient
        .from('user_currency')
        .insert({
          user_id: user.id,
          coins: coinsEarned,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      updatedCurrency = data;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Fitness data synced successfully',
        currency: updatedCurrency || { coins: coinsEarned },
        coinsEarned: coinsEarned,
        totalSteps: totalSteps
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in sync-fitness-data function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
