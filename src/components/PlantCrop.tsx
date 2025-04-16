
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Crop, Seed } from "@/lib/types";
import { Shovel, Leaf, Clock, Sprout, Plus, X } from "lucide-react";

interface PlantCropProps {
  availableSeeds: Seed[];
  onPlant: (seed: Seed, position: { x: number, y: number }) => void;
  existingCrops: Crop[];
  maxCrops?: number;
}

const PlantCrop = ({ 
  availableSeeds, 
  onPlant, 
  existingCrops,
  maxCrops = 9
}: PlantCropProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number, y: number } | null>(null);
  const [isPlanting, setIsPlanting] = useState(false);
  
  const { toast } = useToast();
  
  // Check if we've reached the maximum number of crops
  const maxCropsReached = existingCrops.length >= maxCrops;
  
  // Initialize grid positions (3x3 grid)
  const gridPositions = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { x: col, y: row, index };
  });
  
  // Check which positions are already occupied by crops
  const occupiedPositions = existingCrops.map(crop => ({
    x: crop.position.x,
    y: crop.position.y
  }));
  
  const isPositionOccupied = (x: number, y: number) => {
    return occupiedPositions.some(pos => pos.x === x && pos.y === y);
  };
  
  const handleSelectSeed = (seedId: string) => {
    setSelectedSeed(seedId);
  };
  
  const handleSelectPosition = (x: number, y: number) => {
    if (isPositionOccupied(x, y)) return;
    setSelectedPosition({ x, y });
  };
  
  const handlePlantCrop = async () => {
    if (!selectedSeed || !selectedPosition) {
      toast({
        title: "Cannot plant crop",
        description: "Please select a seed and position for your crop.",
        variant: "destructive"
      });
      return;
    }
    
    const seed = availableSeeds.find(s => s.id === selectedSeed);
    if (!seed) {
      toast({
        title: "Seed not found",
        description: "The selected seed could not be found.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsPlanting(true);
      
      // Call the parent component's onPlant callback
      await onPlant(seed, selectedPosition);
      
      toast({
        title: "Crop planted!",
        description: `You've planted a ${seed.name}.`,
      });
      
      // Reset selections and close dialog
      setSelectedSeed(null);
      setSelectedPosition(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error planting crop:", error);
      toast({
        title: "Failed to plant crop",
        description: error instanceof Error ? error.message : "An error occurred while planting the crop.",
        variant: "destructive"
      });
    } finally {
      setIsPlanting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shovel className="w-5 h-5" />
          Plant a Crop
        </CardTitle>
        <CardDescription>
          Plant seeds to grow into valuable crops
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {availableSeeds.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Leaf className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
            <p className="mb-1">No seeds available</p>
            <p className="text-sm">Visit the Seed Shop to purchase seeds.</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            You have {availableSeeds.length} type{availableSeeds.length !== 1 ? 's' : ''} of seeds 
            available. Plant them in your farm to grow crops and earn rewards.
          </p>
        )}
        
        {maxCropsReached && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 text-sm mb-4">
            <p className="font-medium">Maximum crops reached</p>
            <p className="text-xs mt-1">Harvest some crops to make room for new ones.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full gap-2" 
              disabled={availableSeeds.length === 0 || maxCropsReached}
            >
              <Plus className="w-4 h-4" />
              Plant New Crop
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Plant a Crop</DialogTitle>
              <DialogDescription>
                Choose a seed and where to plant it in your farm.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Seed</label>
                <Select value={selectedSeed || ""} onValueChange={handleSelectSeed}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a seed" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSeeds.map((seed) => (
                      <SelectItem key={seed.id} value={seed.id}>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span>{seed.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedSeed && (
                  <div className="mt-3 p-3 border rounded-md">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {availableSeeds.find(s => s.id === selectedSeed)?.growth_time || 0}h to grow
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {availableSeeds.find(s => s.id === selectedSeed)?.max_growth_stage || 0} growth stages
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {availableSeeds.find(s => s.id === selectedSeed)?.description}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Position</label>
                <div className="grid grid-cols-3 gap-2 aspect-square">
                  {gridPositions.map(({ x, y, index }) => {
                    const isOccupied = isPositionOccupied(x, y);
                    const isSelected = selectedPosition?.x === x && selectedPosition?.y === y;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isOccupied && handleSelectPosition(x, y)}
                        className={`aspect-square rounded-md flex items-center justify-center transition-colors ${
                          isOccupied 
                            ? 'bg-muted/70 cursor-not-allowed' 
                            : isSelected
                              ? 'bg-primary/20 border-2 border-primary'
                              : 'bg-accent/10 hover:bg-accent/20'
                        }`}
                        disabled={isOccupied}
                      >
                        {isOccupied ? (
                          <Sprout className="w-6 h-6 text-muted-foreground" />
                        ) : isSelected ? (
                          <Leaf className="w-6 h-6 text-primary" />
                        ) : (
                          <Plus className="w-6 h-6 text-muted-foreground/50" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Select an empty plot to plant your crop. 
                  {occupiedPositions.length > 0 && ' Occupied plots are unavailable.'}
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handlePlantCrop} 
                disabled={!selectedSeed || !selectedPosition || isPlanting}
              >
                {isPlanting ? 'Planting...' : (
                  <>
                    <Shovel className="w-4 h-4 mr-2" />
                    Plant Crop
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PlantCrop;
