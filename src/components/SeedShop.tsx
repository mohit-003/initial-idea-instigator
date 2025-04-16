
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Seed } from "@/lib/types";
import { Coins, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SeedShopProps {
  availableCoins: number;
  onPurchase: (seed: Seed) => void;
}

const SeedShop = ({ availableCoins, onPurchase }: SeedShopProps) => {
  const [seeds, setSeeds] = useState<Seed[]>([
    {
      id: "seed-1",
      name: "Carrot",
      description: "A fast-growing root vegetable. Good for beginners.",
      cost: 50,
      growth_time: 12,
      max_growth_stage: 3,
      rewards: { coins: 75, experience: 20 },
      image_url: "/seeds/carrot-seed.png"
    },
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
      id: "seed-3",
      name: "Pumpkin",
      description: "A large gourd that yields big rewards but takes longer to grow.",
      cost: 200,
      growth_time: 48,
      max_growth_stage: 5,
      rewards: { coins: 300, experience: 80 },
      image_url: "/seeds/pumpkin-seed.png"
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
    },
    {
      id: "seed-5",
      name: "Golden Apple",
      description: "A rare fruit that takes a long time to grow but provides excellent rewards.",
      cost: 500,
      growth_time: 72,
      max_growth_stage: 6,
      rewards: { coins: 800, experience: 150 },
      image_url: "/seeds/golden-apple-seed.png"
    }
  ]);
  
  const [purchasing, setPurchasing] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handlePurchase = async (seed: Seed) => {
    if (availableCoins < seed.cost) {
      toast({
        title: "Not enough coins",
        description: `You need ${seed.cost - availableCoins} more coins to purchase this seed.`,
        variant: "destructive"
      });
      return;
    }

    try {
      setPurchasing(prev => ({ ...prev, [seed.id]: true }));
      
      // Update user currency in database
      const { error } = await supabase.functions.invoke('unity-game-api', {
        body: {
          amount: seed.cost
        },
        method: 'POST',
        headers: {
          'path': 'spend-coins'
        }
      });
      
      if (error) throw new Error(error.message || "Failed to purchase seed");
      
      // Notify parent component about the purchase
      onPurchase(seed);
      
      toast({
        title: "Seed purchased!",
        description: `You've purchased a ${seed.name} seed.`,
      });
    } catch (error) {
      console.error("Error purchasing seed:", error);
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "Failed to purchase seed",
        variant: "destructive"
      });
    } finally {
      setPurchasing(prev => ({ ...prev, [seed.id]: false }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          Seed Shop
        </CardTitle>
        <CardDescription>
          Purchase seeds to grow crops on your farm
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6 p-3 bg-muted/50 rounded-md">
          <span className="font-medium">Your Balance</span>
          <span className="flex items-center gap-1 font-bold">
            <Coins className="w-4 h-4 text-yellow-500" />
            {availableCoins} Coins
          </span>
        </div>
        
        <div className="grid gap-4">
          {seeds.map((seed) => (
            <div 
              key={seed.id} 
              className="flex justify-between border p-3 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{seed.name}</h4>
                    <p className="text-xs text-muted-foreground">{seed.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {seed.growth_time}h growth
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {seed.rewards.coins} coins reward
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {seed.rewards.experience} XP
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Coins className="w-4 h-4" />
                  {seed.cost}
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => handlePurchase(seed)}
                  disabled={availableCoins < seed.cost || purchasing[seed.id]}
                  className="mt-2"
                >
                  {purchasing[seed.id] ? "Buying..." : "Buy"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedShop;
