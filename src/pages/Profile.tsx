
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CharacterCustomizer from "@/components/CharacterCustomizer";
import { User, Character } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState<User>({
    id: "1",
    username: "farmer_jane",
    email: "jane@harveststeps.com",
    created_at: new Date().toISOString(),
    avatar_url: "/placeholder.svg"
  });

  // Add character state based on the Character type from types.ts
  const [character, setCharacter] = useState<Character>({
    hair_style: 0,
    hair_color: "#111827", // Default black
    skin_tone: "#e2b690", // Default medium tone
    outfit: 0,
    accessories: []
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  // Add handler for saving character changes
  const handleSaveCharacter = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    toast({
      title: "Character updated",
      description: "Your character appearance has been saved successfully."
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="character">Character</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={user.username} 
                  onChange={(e) => setUser({...user, username: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user.email} 
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="character" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Character Customization</CardTitle>
              <CardDescription>
                Personalize your farmer character's appearance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pass the required props to CharacterCustomizer */}
              <CharacterCustomizer 
                character={character} 
                onSave={handleSaveCharacter} 
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveCharacter(character)}>
                Save Character
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
