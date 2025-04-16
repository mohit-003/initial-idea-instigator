
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FarmData } from '@/lib/types';

interface FarmVisualizerProps {
  farmData: FarmData;
  isLoading?: boolean;
  onClick?: () => void;
}

const FarmVisualizer = ({ farmData, isLoading = false, onClick }: FarmVisualizerProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isLoading || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = Math.min(parent.offsetWidth * 0.7, 300);
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Draw farm
    const drawFarm = () => {
      if (!context) return;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sky gradient
      const skyGradient = context.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      skyGradient.addColorStop(0, '#a6d8ff');
      skyGradient.addColorStop(1, '#e6f4ff');
      context.fillStyle = skyGradient;
      context.fillRect(0, 0, canvas.width, canvas.height * 0.4);
      
      // Draw ground
      const groundGradient = context.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      groundGradient.addColorStop(0, '#8db56b');
      groundGradient.addColorStop(1, '#6a8b49');
      context.fillStyle = groundGradient;
      context.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);
      
      // Draw soil patches for crops
      const patchWidth = canvas.width / 8;
      const patchHeight = patchWidth * 0.5;
      const patchY = canvas.height * 0.65;
      
      // Place crops in rows
      farmData.crops.forEach((crop, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        
        const x = canvas.width * 0.1 + col * (patchWidth + 10);
        const y = patchY - row * (patchHeight + 15);
        
        // Draw soil patch
        context.fillStyle = '#59421f';
        context.beginPath();
        context.ellipse(x + patchWidth/2, y + patchHeight/2, patchWidth/2, patchHeight/4, 0, 0, Math.PI * 2);
        context.fill();
        
        // Draw crop based on growth stage
        const growthPercent = crop.growth_stage / crop.max_growth_stage;
        const cropHeight = patchWidth * 1.2 * growthPercent;
        const cropWidth = patchWidth * 0.3;
        
        if (growthPercent > 0) {
          // Draw stem
          context.fillStyle = '#4d7c0f';
          context.fillRect(
            x + patchWidth/2 - cropWidth/10, 
            y - cropHeight, 
            cropWidth/5, 
            cropHeight
          );
          
          // Draw leaves
          if (growthPercent > 0.3) {
            context.fillStyle = '#65a30d';
            // Left leaf
            context.beginPath();
            context.ellipse(
              x + patchWidth/2 - cropWidth/3, 
              y - cropHeight * 0.7, 
              cropWidth/3, 
              cropWidth/5, 
              Math.PI/4, 
              0, 
              Math.PI * 2
            );
            context.fill();
            
            // Right leaf
            context.beginPath();
            context.ellipse(
              x + patchWidth/2 + cropWidth/3, 
              y - cropHeight * 0.6, 
              cropWidth/3, 
              cropWidth/5, 
              -Math.PI/4, 
              0, 
              Math.PI * 2
            );
            context.fill();
          }
          
          // Draw crop top/fruit
          if (growthPercent > 0.7) {
            let color;
            switch (crop.name) {
              case 'Wheat':
                color = '#f59e0b';
                break;
              case 'Tomato':
                color = '#ef4444';
                break;
              case 'Blueberry':
                color = '#3b82f6';
                break;
              default:
                color = '#84cc16';
            }
            
            context.fillStyle = color;
            context.beginPath();
            context.arc(
              x + patchWidth/2, 
              y - cropHeight, 
              cropWidth/2 * (growthPercent), 
              0, 
              Math.PI * 2
            );
            context.fill();
          }
        }
        
        // Add crop name if it's grown enough
        if (growthPercent > 0.4) {
          context.fillStyle = '#1f2937';
          context.font = '10px Inter, sans-serif';
          context.textAlign = 'center';
          context.fillText(
            crop.name, 
            x + patchWidth/2, 
            y + patchHeight/2 + 15
          );
        }
      });
      
      // Draw farm level indicator
      context.fillStyle = '#1f2937';
      context.font = 'bold 16px Inter, sans-serif';
      context.textAlign = 'left';
      context.fillText(`Farm Level: ${farmData.level}`, 20, 30);
    };
    
    drawFarm();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [farmData, isLoading, showAnimation]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/50 shadow-sm hover-lift">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            <div className="h-7 w-1/3 bg-muted animate-pulse rounded-md"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded-md w-full"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`overflow-hidden border border-border/50 shadow-sm hover-lift button-transition ${showAnimation ? 'opacity-100' : 'opacity-0'} ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Your Virtual Farm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 relative overflow-hidden rounded-md bg-background mb-4">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Farm Progress</span>
            <span className="text-sm font-medium">
              {farmData.experience}/{farmData.next_level_xp} XP
            </span>
          </div>
          <Progress 
            value={(farmData.experience / farmData.next_level_xp) * 100} 
            className="h-2" 
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>You have {farmData.crops.length} crops growing. Keep moving to help them grow!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmVisualizer;
