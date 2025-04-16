
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { unityGame } from '@/services/unityIntegrationService';
import { Gamepad2, Copy, ExternalLink, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UnityGameIntegrationProps {
  availableCoins: number;
}

const UnityGameIntegration = ({ availableCoins }: UnityGameIntegrationProps) => {
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateAuthToken = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect to the Unity game",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingToken(true);
      const token = await unityGame.getAuthToken();
      setAuthToken(token);
      
      if (!token) {
        throw new Error("Failed to generate authentication token");
      }
      
      toast({
        title: "Auth token generated",
        description: "You can now use this token to connect to the Unity game",
      });
    } catch (error) {
      console.error("Error generating auth token:", error);
      toast({
        title: "Error generating token",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (!authToken) return;
    
    navigator.clipboard.writeText(authToken).then(() => {
      toast({
        title: "Token copied!",
        description: "The authentication token has been copied to your clipboard",
      });
    }).catch(err => {
      console.error("Could not copy text: ", err);
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the token manually",
        variant: "destructive"
      });
    });
  };

  const launchUnityGame = () => {
    const deepLink = unityGame.generateGameDeepLink();
    window.location.href = deepLink;
    
    // Fallback if deep link doesn't work
    setTimeout(() => {
      // If we're still here after 1 second, the deep link probably didn't work
      toast({
        title: "Game launch",
        description: "If the game didn't launch automatically, please copy your auth token and open the game manually",
      });
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Unity Game Integration
        </CardTitle>
        <CardDescription>
          Connect to the Unity farming game using your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
          <span className="font-medium">Available Balance</span>
          <span className="flex items-center gap-1 font-bold">
            <Coins className="w-4 h-4 text-yellow-500" />
            {availableCoins} Coins
          </span>
        </div>
        
        {authToken ? (
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Your Authentication Token:</p>
              <div className="relative">
                <pre className="text-xs bg-background border rounded p-2 overflow-x-auto max-h-24">
                  {authToken}
                </pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-1 right-1" 
                  onClick={copyTokenToClipboard}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                variant="default" 
                className="w-full gap-2"
                onClick={launchUnityGame}
              >
                <ExternalLink className="w-4 h-4" />
                Launch Unity Game
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Click the button above to launch the game with your authentication token
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-center text-muted-foreground">
              Generate an authentication token to connect to the Unity farming game. Your progress and coins will be synchronized between the web app and the game.
            </p>
            <Button 
              onClick={generateAuthToken} 
              disabled={isGeneratingToken}
              className="gap-2"
            >
              {isGeneratingToken ? "Generating..." : "Generate Auth Token"}
              <Gamepad2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Your farm progress and coins are shared between this web application and the Unity game. Changes made in either platform will be synchronized.
        </p>
      </CardFooter>
    </Card>
  );
};

export default UnityGameIntegration;
