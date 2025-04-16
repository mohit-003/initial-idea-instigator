import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { FarmData, Crop, Seed, Achievement } from '@/lib/types';
import FarmVisualizer from '@/components/FarmVisualizer';
import SeedShop from '@/components/SeedShop';
import PlantCrop from '@/components/PlantCrop';
import Achievements from '@/components/Achievements';
import SocialHub from '@/components/SocialHub';
import ProgressChart from '@/components/ProgressChart';
import UnityGameIntegration from '@/components/UnityGameIntegration';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Home, Leaf, Sprout, Trophy, Users, TrendingUp, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Farm = () => {
  const [farmData, setFarmData] = useState<FarmData>({
    level: 1,
    crops: [],
    experience: 0,
    next_level_xp: 100,
    achievements: [],
    friends: [],
    available_seeds: [],
    farm_coins: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("farm");
  const [availableCoins, setAvailableCoins] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const { data: currencyData, error: currencyError } = await supabase
          .from('user_currency')
          .select('coins')
          .eq('user_id', user?.id)
          .maybeSingle();
          
        if (currencyError && currencyError.code !== 'PGRST116') {
          console.error('Error fetching currency:', currencyError);
        }
        
        const coins = currencyData?.coins || 500;
        setAvailableCoins(coins);
        
        setTimeout(() => {
          const sampleFarmData: FarmData = {
            level: 3,
            experience: 275,
            next_level_xp: 400,
            crops: [
              {
                id: '1',
                name: 'Carrot',
                growth_stage: 2,
                max_growth_stage: 3,
                planted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                water_level: 80,
                health: 95,
                rewards: { coins: 75, experience: 20 },
                position: { x: 0, y: 1 }
              },
              {
                id: '2',
                name: 'Tomato',
                growth_stage: 1,
                max_growth_stage: 4,
                planted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                water_level: 60,
                health: 100,
                rewards: { coins: 150, experience: 40 },
                position: { x: 1, y: 0 }
              },
              {
                id: '3',
                name: 'Sunflower',
                growth_stage: 3,
                max_growth_stage: 3,
                planted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                water_level: 30,
                health: 90,
                rewards: { coins: 100, experience: 25 },
                position: { x: 2, y: 2 }
              }
            ],
            achievements: [
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
              }
            ],
            friends: [],
            available_seeds: [
              {
                id: "seed-2",
                name: "Tomato",
                description: "A popular fruit that takes some time to grow.",
                cost: 100,
                growth_time: 24,
                max_growth_stage: 4,
                rewards: { coins: 150, experience: 40 },
                image_url: "/seeds/tomato-seed.png"
              },
              {
                id: "seed-4",
                name: "Sunflower",
                description: "A beautiful flower that grows quickly and provides a modest reward.",
                cost: 75,
                growth_time: 8,
                max_growth_stage: 3,
                rewards: { coins: 100, experience: 25 },
                image_url: "/seeds/sunflower-seed.png"
              }
            ],
            farm_coins: coins
          };
          
          setFarmData(sampleFarmData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading farm data:', error);
        setIsLoading(false);
        toast({
          title: "Failed to load farm data",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [user, toast]);
  
  const handlePurchaseSeed = (seed: Seed) => {
    const newCoins = availableCoins - seed.cost;
    setAvailableCoins(newCoins);
    
    const updatedFarmData = {
      ...farmData,
      available_seeds: [...farmData.available_seeds, seed],
      farm_coins: newCoins
    };
    
    setFarmData(updatedFarmData);
  };
  
  const handlePlantCrop = async (seed: Seed, position: { x: number, y: number }) => {
    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      name: seed.name,
      growth_stage: 0,
      max_growth_stage: seed.max_growth_stage,
      planted_date: new Date().toISOString(),
      water_level: 100,
      health: 100,
      rewards: seed.rewards,
      position
    };
    
    const updatedSeeds = farmData.available_seeds.filter(s => s.id !== seed.id);
    
    const updatedFarmData = {
      ...farmData,
      crops: [...farmData.crops, newCrop],
      available_seeds: updatedSeeds
    };
    
    setFarmData(updatedFarmData);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return true;
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Your Farm</h1>
          </div>
          <p className="text-muted-foreground">
            Level {farmData.level} • XP: {farmData.experience}/{farmData.next_level_xp} • 
            Coins: {availableCoins.toLocaleString()}
          </p>
        </div>
      </div>
      
      <Tabs 
        defaultValue="farm" 
        value={currentTab} 
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-1">
          <TabsTrigger value="farm" className="gap-1">
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Farm</span>
          </TabsTrigger>
          <TabsTrigger value="plant" className="gap-1">
            <Sprout className="w-4 h-4" />
            <span className="hidden md:inline">Plant</span>
          </TabsTrigger>
          <TabsTrigger value="shop" className="gap-1">
            <Leaf className="w-4 h-4" />
            <span className="hidden md:inline">Shop</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-1">
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-1">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden md:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="unity" className="gap-1">
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden md:inline">Unity Game</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="farm" className="space-y-6">
          <FarmVisualizer farmData={farmData} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="plant" className="space-y-6">
          <PlantCrop 
            availableSeeds={farmData.available_seeds}
            onPlant={handlePlantCrop}
            existingCrops={farmData.crops}
            maxCrops={9}
          />
        </TabsContent>
        
        <TabsContent value="shop" className="space-y-6">
          <SeedShop 
            availableCoins={availableCoins}
            onPurchase={handlePurchaseSeed}
          />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <Achievements 
            achievements={farmData.achievements}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <SocialHub 
            friends={farmData.friends}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <ProgressChart isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="unity" className="space-y-6">
          <UnityGameIntegration availableCoins={availableCoins} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Farm;
