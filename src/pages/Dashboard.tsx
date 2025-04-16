
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FitnessStats from '@/components/FitnessStats';
import { FarmData } from '@/lib/types';
import FarmVisualizer from '@/components/FarmVisualizer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PwaInstallButton from '@/components/PwaInstallButton';
import Pedometer from '@/components/Pedometer';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const simulatedFarmData: FarmData = {
    level: 1,
    experience: 75,
    next_level_xp: 100,
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
      }
    ],
    achievements: [],
    friends: [],
    available_seeds: [],
    farm_coins: 0
  };

  useEffect(() => {
    setFarmData(simulatedFarmData);
  }, []);

  const handleViewFarm = () => {
    navigate('/farm');
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.user_metadata?.username || 'Farmer'}</h1>
          <p className="text-muted-foreground">
            Farm Level: {farmData.level} • XP: {farmData.experience}/{farmData.next_level_xp}
          </p>
        </div>
        
        <div className="flex gap-3">
          <PwaInstallButton variant="outline" size="sm" />
          <Button size="sm" className="gap-1" onClick={handleViewFarm}>
            <Plus className="w-4 h-4" />
            Manage Farm
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FitnessStats />
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Farm</h2>
              <Button variant="link" className="p-0 h-auto" onClick={handleViewFarm}>
                View Full Farm
              </Button>
            </div>
            <FarmVisualizer 
              farmData={farmData} 
              onClick={handleViewFarm}
            />
          </section>
        </div>
        
        <div className="space-y-6">
          {/* Add the new Pedometer component */}
          <Pedometer />
          
          <section className="bg-muted/40 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Track Your Steps</h3>
                <p className="text-sm text-muted-foreground">Use our web app to track your daily steps and activities.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Earn Farm Coins</h3>
                <p className="text-sm text-muted-foreground">Every 100 steps earns you 1 Farm Coin to spend in your virtual farm.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">3. Grow Your Farm</h3>
                <p className="text-sm text-muted-foreground">Use your coins to plant and grow crops, expanding your virtual farm.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">4. Level Up</h3>
                <p className="text-sm text-muted-foreground">As you grow crops and stay active, you'll level up and unlock new features.</p>
              </div>
            </div>
          </section>
          
          <section className="bg-muted/40 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Install Web App</h2>
            <p className="text-sm text-muted-foreground mb-4">Use Fitness Farm as a standalone app on your device.</p>
            <PwaInstallButton variant="default" className="w-full" />
          </section>
        </div>
      </div>
    </div>
  );
}
