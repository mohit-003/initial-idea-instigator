
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement } from "@/lib/types";
import { Trophy, Lock, CheckCircle, Gift, Coins, Sparkles } from "lucide-react";

interface AchievementsProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

const Achievements = ({ achievements = [], isLoading = false }: AchievementsProps) => {
  const [unlockedCount, setUnlockedCount] = useState(0);
  
  useEffect(() => {
    setUnlockedCount(achievements.filter(a => a.unlocked).length);
  }, [achievements]);
  
  // Sample achievements data for demonstration
  const sampleAchievements: Achievement[] = [
    {
      id: "ach-1",
      title: "First Steps",
      description: "Record your first 1,000 steps",
      icon: "footprints",
      unlocked: true,
      unlock_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 1000,
      target: 1000,
      reward: { coins: 50, experience: 10 }
    },
    {
      id: "ach-2",
      title: "Green Thumb",
      description: "Plant your first crop",
      icon: "plant",
      unlocked: true,
      unlock_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 1,
      target: 1,
      reward: { coins: 25, experience: 5 }
    },
    {
      id: "ach-3",
      title: "Marathon Runner",
      description: "Record 100,000 total steps",
      icon: "running",
      unlocked: false,
      progress: 45000,
      target: 100000,
      reward: { coins: 500, experience: 100 }
    },
    {
      id: "ach-4",
      title: "Harvest Festival",
      description: "Harvest 50 crops",
      icon: "scissors",
      unlocked: false,
      progress: 12,
      target: 50,
      reward: { coins: 300, experience: 75 }
    },
    {
      id: "ach-5",
      title: "Social Butterfly",
      description: "Add 5 friends",
      icon: "users",
      unlocked: false,
      progress: 2,
      target: 5,
      reward: { coins: 100, experience: 20 }
    },
    {
      id: "ach-6",
      title: "Farm Tycoon",
      description: "Earn 10,000 coins from your farm",
      icon: "piggy-bank",
      unlocked: false,
      progress: 3500,
      target: 10000,
      reward: { 
        coins: 1000, 
        experience: 200,
        seeds: [{
          id: "rare-seed-1",
          name: "Magic Bean",
          description: "A mysterious seed that grows into something special",
          cost: 1000,
          growth_time: 48,
          max_growth_stage: 5,
          rewards: { coins: 2000, experience: 400 },
          image_url: "/seeds/magic-bean.png"
        }]
      }
    }
  ];
  
  const displayAchievements = achievements.length > 0 ? achievements : sampleAchievements;
  const unlockedAchievements = displayAchievements.filter(a => a.unlocked);
  const inProgressAchievements = displayAchievements.filter(a => !a.unlocked);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "footprints":
        return <Sparkles className="h-5 w-5" />;
      case "plant":
        return <Sparkles className="h-5 w-5" />;
      case "running":
        return <Sparkles className="h-5 w-5" />;
      case "scissors":
        return <Sparkles className="h-5 w-5" />;
      case "users":
        return <Sparkles className="h-5 w-5" />;
      case "piggy-bank":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-muted animate-pulse"></div>
            <div className="h-7 w-40 bg-muted animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                </div>
                <div className="h-2 w-full bg-muted animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </CardTitle>
        <CardDescription>
          {unlockedCount} of {displayAchievements.length} achievements unlocked
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress" className="space-y-4">
            {inProgressAchievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No achievements in progress. Keep growing your farm!
              </div>
            ) : (
              inProgressAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="p-4 border rounded-lg transition-colors hover:bg-accent/5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {achievement.title}
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="bg-muted/50 w-10 h-10 rounded-full flex items-center justify-center">
                      {getIconComponent(achievement.icon)}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.target}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      {achievement.reward.coins} coins
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      {achievement.reward.experience} XP
                    </Badge>
                    
                    {achievement.reward.seeds && achievement.reward.seeds.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Gift className="h-3 w-3 text-green-500" />
                        {achievement.reward.seeds[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="unlocked" className="space-y-4">
            {unlockedAchievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No achievements unlocked yet. Keep growing your farm!
              </div>
            ) : (
              unlockedAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="p-4 border rounded-lg transition-colors hover:bg-accent/5 bg-primary/5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {achievement.title}
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked on {new Date(achievement.unlock_date!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                      {getIconComponent(achievement.icon)}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="flex items-center gap-1 text-xs bg-green-500/10 text-green-700 border-green-200">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      {achievement.reward.coins} coins
                    </Badge>
                    
                    <Badge className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-700 border-purple-200">
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      {achievement.reward.experience} XP
                    </Badge>
                    
                    {achievement.reward.seeds && achievement.reward.seeds.length > 0 && (
                      <Badge className="flex items-center gap-1 text-xs bg-green-500/10 text-green-700 border-green-200">
                        <Gift className="h-3 w-3 text-green-500" />
                        {achievement.reward.seeds[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Achievements;
