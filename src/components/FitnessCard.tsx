
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Footprints, Activity, Calendar, Flame } from 'lucide-react';
import { FitnessData } from '@/lib/types';

interface FitnessCardProps {
  data: FitnessData;
  isLoading?: boolean;
}

const FitnessCard = ({ data, isLoading = false }: FitnessCardProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setProgress(Math.min((data.steps / 10000) * 100, 100));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data.steps]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/50 shadow-sm hover-lift">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="h-7 w-1/3 bg-muted animate-pulse rounded-md"></div>
            <div className="h-6 w-8 bg-muted animate-pulse rounded-md"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse mr-3"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const metrics = [
    { 
      icon: <Footprints className="h-6 w-6 text-primary" />,
      label: "Steps",
      value: data.steps.toLocaleString(),
      subtext: "Daily Goal: 10,000"
    },
    { 
      icon: <Activity className="h-6 w-6 text-sky" />,
      label: "Distance",
      value: `${data.distance.toFixed(2)} km`,
      subtext: `Approx. ${(data.distance * 0.621371).toFixed(2)} miles`
    },
    { 
      icon: <Flame className="h-6 w-6 text-secondary" />,
      label: "Calories",
      value: data.calories.toLocaleString(),
      subtext: "Based on your activity"
    },
    { 
      icon: <Calendar className="h-6 w-6 text-muted-foreground" />,
      label: "Active Minutes",
      value: data.active_minutes.toString(),
      subtext: "Goal: 30 minutes"
    }
  ];

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm hover-lift button-transition">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Fitness Activity</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatDate(data.date)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Step Goal</span>
            <span className="text-sm font-medium">{Math.floor(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-start">
              <div className="p-2 rounded-full bg-background mr-3">
                {metric.icon}
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-lg font-semibold mr-2">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FitnessCard;
