
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footprints, Sprout, ShoppingBasket, Coins } from "lucide-react";

const Instructions = () => {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">🌾 FarmQuest Game Instructions 🌾</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to FarmQuest!
          Turn your real-life steps into coins, grow your farm, and become a legendary harvester!
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Footprints className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 1: Walk to Earn Coins</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Every real-world step gives you in-game coins.</li>
                  <li>The more you walk, the richer you become!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 2: Buy Seeds</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Use coins to purchase seeds from the shop.</li>
                  <li>Each seed grows into a valuable crop over time.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingBasket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 3: Get a Harvest Basket</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>You need a basket to harvest crops.</li>
                  <li>Buy one in the shop to start collecting!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 4: Plant and Grow</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Plant seeds in your fields and wait for them to grow.</li>
                  <li>Each crop has a different growth time.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingBasket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 5: Harvest Crops</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>When crops are ready, use your basket to harvest them.</li>
                  <li>Your harvested crops go into your inventory.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 6: Sell Crops for Coins</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Sell your crops to earn more coins.</li>
                  <li>Use coins to buy more seeds and upgrade your tools.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">📝 Tips:</h2>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Walk daily to boost your coin count!</li>
            <li>Upgrade baskets for faster harvests.</li>
            <li>Plan crops based on your walking patterns.</li>
          </ul>
          
          <div className="text-center mt-6">
            <p className="text-xl font-medium">Happy farming! 👣🌽</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Instructions;
