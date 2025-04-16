
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  
  // Create Supabase client with service role key (admin access)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    
    // Parse request body if it exists
    let body = {}
    if (req.method === 'POST') {
      body = await req.json()
    }
    
    // Authenticate the request using the JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid or expired token')
    }
    
    const userId = user.id
    
    // Handle different API endpoints
    switch (path) {
      case 'get-user-data':
        // Get user profile, currency, and fitness data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
          
        if (profileError) throw profileError
        
        const { data: currencyData, error: currencyError } = await supabase
          .from('user_currency')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
          
        const currency = currencyError || !currencyData 
          ? { coins: 0 } 
          : currencyData
          
        const { data: fitnessData, error: fitnessError } = await supabase
          .from('fitness_activities')
          .select('*')
          .eq('user_id', userId)
          .order('start_time', { ascending: false })
          .limit(7)
          
        if (fitnessError) throw fitnessError
        
        return new Response(
          JSON.stringify({
            profile: profileData,
            currency: currency,
            fitness: fitnessData || []
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
        
      case 'spend-coins':
        // Validate request
        const { amount } = body as { amount: number }
        if (typeof amount !== 'number' || amount <= 0) {
          throw new Error('Invalid amount')
        }
        
        // Get current balance
        const { data: userCurrency, error: fetchError } = await supabase
          .from('user_currency')
          .select('coins')
          .eq('user_id', userId)
          .maybeSingle()
          
        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError
        
        const currentCoins = userCurrency?.coins || 0
        
        if (currentCoins < amount) {
          throw new Error('Insufficient funds')
        }
        
        // Update balance
        const { data: updatedCurrency, error: updateError } = await supabase
          .from('user_currency')
          .upsert({ 
            user_id: userId,
            coins: currentCoins - amount,
            last_updated: new Date().toISOString()
          })
          .select()
          .single()
          
        if (updateError) throw updateError
        
        return new Response(
          JSON.stringify(updatedCurrency),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
        
      case 'add-game-progress':
        // Record in-game progress, achievements, etc.
        const { progress } = body as { progress: any }
        
        // Here you would store the progress data in a game_progress table
        // This is a simplified example
        console.log('Game progress received:', progress)
        
        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
        
      default:
        throw new Error('Unknown endpoint')
    }
  } catch (error) {
    console.error('API error:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
