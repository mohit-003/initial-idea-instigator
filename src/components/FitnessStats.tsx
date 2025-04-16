
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserFitnessData, fetchUserCurrency } from '@/services/fitnessService';
import { useAuth } from '@/contexts/AuthContext';
import { Footprints, Flame, Timer, Coins, AreaChart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const FitnessStats = () => {
  const [fitnessData, setFitnessData] = useState<any[]>([]);
  const [currency, setCurrency] = useState({ coins: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await fetchUserFitnessData();
        const currencyData = await fetchUserCurrency();
        
        setFitnessData(data || []);
        setCurrency(currencyData);
      } catch (error) {
        console.error('Error loading fitness data:', error);
        toast({
          title: "Failed to load fitness data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

  // Calculate totals
  const totalSteps = fitnessData.reduce((sum, activity) => sum + activity.steps, 0);
  const totalDistance = fitnessData.reduce((sum, activity) => sum + activity.distance, 0).toFixed(2);
  const totalCalories = fitnessData.reduce((sum, activity) => sum + activity.calories, 0);
  const totalActiveMinutes = fitnessData.reduce((sum, activity) => sum + activity.active_minutes, 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Footprints className="mr-2 h-4 w-4" />
              Total Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSteps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AreaChart className="mr-2 h-4 w-4" />
              Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance} km</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flame className="mr-2 h-4 w-4" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              Farm Coins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency.coins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FitnessStats;
