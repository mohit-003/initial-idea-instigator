
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footprints, Play, Square, ZapIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  startStepTracking, 
  stopStepTracking, 
  getTrackingStatus,
  simulateStep
} from '@/services/fitnessService';
import { supabase } from '@/integrations/supabase/client';

const Pedometer = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [showDeviceWarning, setShowDeviceWarning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Update UI with current tracking data
  useEffect(() => {
    if (!isTracking) return;

    const intervalId = setInterval(() => {
      const { currentData } = getTrackingStatus();
      setCurrentSteps(currentData.steps);
      setDistance(currentData.distance);
      setCalories(currentData.calories);
      setActiveMinutes(currentData.active_minutes);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTracking]);

  // Initialize tracking status
  useEffect(() => {
    const { isTracking: trackingActive } = getTrackingStatus();
    setIsTracking(trackingActive);
    
    // Check if device motion is available
    if (!window.DeviceMotionEvent) {
      setShowDeviceWarning(true);
    }
    
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to track and save your fitness activities.",
          variant: "destructive"
        });
      }
    };
    
    checkAuth();
  }, [toast]);

  // Handler to start tracking
  const handleStartTracking = () => {
    const result = startStepTracking();
    setIsTracking(result);
    
    if (!result) {
      toast({
        title: "Feature not available",
        description: "Pedometer requires motion sensors that are not available on this device.",
        variant: "destructive"
      });
    }
  };

  // Handler to stop tracking and sync data
  const handleStopTracking = async () => {
    try {
      setIsSyncing(true);
      
      // Check if user is authenticated
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your fitness activities.",
          variant: "destructive"
        });
        setIsTracking(false);
        setIsSyncing(false);
        return;
      }
      
      const result = await stopStepTracking();
      setIsTracking(false);
      setSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Fitness Activity Saved",
          description: result.message,
        });
      } else {
        toast({
          title: "Failed to save activity",
          description: result.message || "An unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error stopping tracking:", error);
      toast({
        title: "Failed to save activity",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Simulate a step for testing purposes
  const handleSimulateStep = () => {
    if (simulateStep()) {
      const { currentData } = getTrackingStatus();
      setCurrentSteps(currentData.steps);
      setDistance(currentData.distance);
      setCalories(currentData.calories);
      setActiveMinutes(currentData.active_minutes);
      
      toast({
        title: "Step Simulated",
        description: `Steps: ${currentData.steps}`,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="w-5 h-5" />
          Pedometer
        </CardTitle>
        <CardDescription>
          Track your steps to earn Farm Coins
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showDeviceWarning && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Device Limitation</AlertTitle>
            <AlertDescription>
              Your device doesn't support motion sensors needed for step tracking. 
              You can use the "Simulate Step" button for testing.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{currentSteps}</div>
          <div className="text-sm text-muted-foreground">steps</div>
        </div>
        
        <Progress value={(currentSteps / 10000) * 100} className="h-2" />
        
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="text-xl font-semibold">{distance.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">km</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{calories}</div>
            <div className="text-xs text-muted-foreground">calories</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{activeMinutes}</div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </div>
        </div>
        
        {syncResult?.success && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <p className="text-sm font-medium text-primary">
              +{syncResult.data?.coinsEarned || 0} Farm Coins earned!
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {isTracking ? (
          <Button 
            onClick={handleStopTracking} 
            variant="destructive" 
            className="w-full gap-2"
            disabled={isSyncing}
          >
            {isSyncing ? 'Saving...' : <><Square className="w-4 h-4" /> Stop & Save</>}
          </Button>
        ) : (
          <Button 
            onClick={handleStartTracking} 
            className="w-full gap-2"
            disabled={isSyncing}
          >
            <Play className="w-4 h-4" /> Start Tracking
          </Button>
        )}
        
        {isTracking && (
          <Button
            onClick={handleSimulateStep}
            variant="outline"
            className="w-full gap-2"
            disabled={isSyncing}
          >
            <ZapIcon className="w-4 h-4" /> Simulate Step
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Pedometer;
