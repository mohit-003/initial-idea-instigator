
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  User, 
  Shirt 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Character } from '@/lib/types';

interface CharacterCustomizerProps {
  character: Character;
  onSave: (character: Character) => void;
}

const CharacterCustomizer = ({ character, onSave }: CharacterCustomizerProps) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  
  const hairStyles = 5;
  const outfits = 4;
  
  const skinTones = [
    "#fad7aa",
    "#e2b690",
    "#c58c5c",
    "#a86c49",
    "#6a4c39"
  ];
  
  const hairColors = [
    "#111827", // Black
    "#422006", // Brown
    "#b45309", // Dark blonde
    "#fbbf24", // Blonde
    "#d1d5db", // Gray
    "#ef4444", // Red
  ];
  
  const handleHairStyleChange = (increment: number) => {
    setCurrentCharacter(prev => ({
      ...prev,
      hair_style: (prev.hair_style + increment + hairStyles) % hairStyles
    }));
  };
  
  const handleOutfitChange = (increment: number) => {
    setCurrentCharacter(prev => ({
      ...prev,
      outfit: (prev.outfit + increment + outfits) % outfits
    }));
  };
  
  const handleSkinToneChange = (tone: string) => {
    setCurrentCharacter(prev => ({
      ...prev,
      skin_tone: tone
    }));
  };
  
  const handleHairColorChange = (color: string) => {
    setCurrentCharacter(prev => ({
      ...prev,
      hair_color: color
    }));
  };
  
  const handleSave = () => {
    onSave(currentCharacter);
  };

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm hover-lift button-transition">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Character Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Character preview */}
          <div className="w-full md:w-1/2 bg-muted rounded-lg overflow-hidden flex items-center justify-center p-6">
            <div 
              className="w-48 h-48 relative flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(223,239,254,0.1) 100%)'
              }}
            >
              {/* Body */}
              <div 
                className="w-24 h-40 rounded-3xl relative"
                style={{ backgroundColor: currentCharacter.skin_tone }}
              >
                {/* Face */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-16">
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="w-2 h-2 rounded-full bg-foreground"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground"></div>
                  </div>
                  <div className="w-4 h-1 rounded-full bg-foreground mx-auto mt-4"></div>
                </div>
                
                {/* Hair */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  style={{ color: currentCharacter.hair_color }}
                >
                  {currentCharacter.hair_style === 0 && (
                    <div className="w-20 h-8 rounded-t-3xl bg-current"></div>
                  )}
                  {currentCharacter.hair_style === 1 && (
                    <div className="w-24 h-10 rounded-t-full bg-current"></div>
                  )}
                  {currentCharacter.hair_style === 2 && (
                    <>
                      <div className="w-20 h-8 rounded-t-3xl bg-current"></div>
                      <div className="w-4 h-12 bg-current absolute right-0 top-6"></div>
                    </>
                  )}
                  {currentCharacter.hair_style === 3 && (
                    <div className="w-24 h-4 bg-current rounded-md"></div>
                  )}
                  {currentCharacter.hair_style === 4 && (
                    <>
                      <div className="w-20 h-8 rounded-t-3xl bg-current"></div>
                      <div className="w-6 h-14 bg-current absolute left-0 top-4 rounded-l-lg"></div>
                      <div className="w-6 h-14 bg-current absolute right-0 top-4 rounded-r-lg"></div>
                    </>
                  )}
                </div>
                
                {/* Clothing */}
                <div className="absolute bottom-0 left-0 right-0 h-20">
                  {currentCharacter.outfit === 0 && (
                    <div className="w-full h-full bg-primary rounded-b-3xl"></div>
                  )}
                  {currentCharacter.outfit === 1 && (
                    <div className="w-full h-full bg-secondary rounded-b-3xl"></div>
                  )}
                  {currentCharacter.outfit === 2 && (
                    <div className="w-full h-full bg-accent rounded-b-3xl"></div>
                  )}
                  {currentCharacter.outfit === 3 && (
                    <div className="w-full h-full bg-muted-foreground rounded-b-3xl"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Customization controls */}
          <div className="w-full md:w-1/2">
            <Tabs defaultValue="style">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="style" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Style</span>
                </TabsTrigger>
                <TabsTrigger value="color" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>Colors</span>
                </TabsTrigger>
                <TabsTrigger value="outfit" className="flex items-center gap-1">
                  <Shirt className="h-4 w-4" />
                  <span>Outfit</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="style">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hair Style</label>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleHairStyleChange(-1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center">
                        {currentCharacter.hair_style + 1}/{hairStyles}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleHairStyleChange(1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Outfit Style</label>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOutfitChange(-1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center">
                        {currentCharacter.outfit + 1}/{outfits}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOutfitChange(1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="color">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Skin Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {skinTones.map((tone, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full transition-all ${
                            currentCharacter.skin_tone === tone 
                              ? 'ring-2 ring-primary ring-offset-2' 
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: tone }}
                          onClick={() => handleSkinToneChange(tone)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hair Color</label>
                    <div className="flex flex-wrap gap-2">
                      {hairColors.map((color, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full transition-all ${
                            currentCharacter.hair_color === color 
                              ? 'ring-2 ring-primary ring-offset-2' 
                              : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleHairColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="outfit">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    More outfit customization options will be available soon! For now, you can change the outfit style in the Style tab.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              className="w-full mt-6 button-transition hover-lift"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterCustomizer;
