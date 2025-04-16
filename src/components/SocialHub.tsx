import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Friend, SocialInteraction } from "@/lib/types";
import { Users, Search, UserPlus, Gift, Send, MessageSquare, Home, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface SocialHubProps {
  friends?: Friend[];
  isLoading?: boolean;
}

const SocialHub = ({ friends: propsFriends = [], isLoading = false }: SocialHubProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>(propsFriends);
  const [recentActivity, setRecentActivity] = useState<SocialInteraction[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // If friends are passed from props, use them
    if (propsFriends.length > 0) {
      setFriends(propsFriends);
    } else {
      // Otherwise, use sample data
      setFriends(sampleFriends);
    }
    
    // Set sample activity data
    setRecentActivity(sampleActivity);
  }, [propsFriends]);
  
  // Sample data for demonstration
  const sampleFriends: Friend[] = [
    {
      user_id: "friend-1",
      username: "GreenThumbGamer",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
      farm_level: 12,
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: "friend-2",
      username: "FarmingWizard",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
      farm_level: 8,
      last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      user_id: "friend-3",
      username: "StepMaster5000",
      avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Gizmo",
      farm_level: 15,
      last_active: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ];
  
  const sampleActivity: SocialInteraction[] = [
    {
      id: "act-1",
      from_user_id: "friend-1",
      to_user_id: user?.id || "",
      interaction_type: "gift",
      details: { gift_type: "seed", seed_name: "Tomato Seed" },
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "act-2",
      from_user_id: user?.id || "",
      to_user_id: "friend-2",
      interaction_type: "visit",
      details: { duration: "5 minutes" },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "act-3",
      from_user_id: "friend-3",
      to_user_id: user?.id || "",
      interaction_type: "message",
      details: { message: "Check out my new farm layout!" },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // In a real app, this would be a Supabase call to search for users
      // For demo purposes, we'll just filter the sample friends that don't match current friends
      const currentFriendIds = friends.map(f => f.user_id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate search results with some fake users
      const results = [
        {
          user_id: "search-1",
          username: "FarmFriend123",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mimi",
          farm_level: 5,
          last_active: new Date().toISOString()
        },
        {
          user_id: "search-2",
          username: "StepCounter42",
          avatar_url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Peanut",
          farm_level: 7,
          last_active: new Date().toISOString()
        }
      ].filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !currentFriendIds.includes(user.user_id)
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for users:", error);
      toast({
        title: "Search failed",
        description: "Could not complete the search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleAddFriend = async (friend: Friend) => {
    try {
      // In a real app, this would make a Supabase call to add a friend
      // For demo purposes, we'll just add to the local state
      
      // Create a copy of the current friends array and add the new friend
      const updatedFriends = [...friends, friend];
      setFriends(updatedFriends);
      
      // Remove the added friend from search results
      setSearchResults(searchResults.filter(f => f.user_id !== friend.user_id));
      
      toast({
        title: "Friend added!",
        description: `${friend.username} is now your friend.`,
      });
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Failed to add friend",
        description: "Could not add this friend. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendGift = async (friendId: string) => {
    try {
      // In a real app, this would make a Supabase call to send a gift
      toast({
        title: "Gift sent!",
        description: "Your gift has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending gift:", error);
      toast({
        title: "Failed to send gift",
        description: "Could not send the gift. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleVisitFarm = (friendId: string) => {
    // This would navigate to a friend's farm view
    toast({
      title: "Visiting farm",
      description: "Loading friend's farm...",
    });
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted animate-pulse rounded-full"></div>
            <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-full bg-muted animate-pulse rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                </div>
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
          <Users className="w-5 h-5" />
          Social Hub
        </CardTitle>
        <CardDescription>
          Connect with friends and visit their farms
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="find">Find Friends</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You don't have any friends yet. Find friends to start connecting!
              </div>
            ) : (
              <div className="space-y-4">
                {friends.map((friend) => (
                  <div 
                    key={friend.user_id} 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors hover:bg-accent/5 ${activeFriendId === friend.user_id ? 'bg-accent/10' : ''}`}
                    onClick={() => setActiveFriendId(friend.user_id === activeFriendId ? null : friend.user_id)}
                  >
                    <Avatar>
                      <AvatarImage src={friend.avatar_url} />
                      <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-medium">{friend.username}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(friend.last_active)}
                      </div>
                    </div>
                    
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Level {friend.farm_level}
                    </div>
                    
                    {activeFriendId === friend.user_id && (
                      <div className="flex gap-2 mt-3 absolute left-0 right-0 -bottom-12 bg-background border-b border-x rounded-b-lg p-3 shadow-sm z-10 justify-center">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleSendGift(friend.user_id)}>
                          <Gift className="w-3.5 h-3.5" />
                          Gift
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleVisitFarm(friend.user_id)}>
                          <Home className="w-3.5 h-3.5" />
                          Visit
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="find">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? "Searching..." : <Search className="w-4 h-4" />}
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {searchResults.map((result) => (
                    <div 
                      key={result.user_id} 
                      className="flex items-center gap-3 p-3 border rounded-lg transition-colors hover:bg-accent/5"
                    >
                      <Avatar>
                        <AvatarImage src={result.avatar_url} />
                        <AvatarFallback>{result.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="font-medium">{result.username}</div>
                        <div className="text-xs text-muted-foreground">
                          Level {result.farm_level} Farmer
                        </div>
                      </div>
                      
                      <Button size="sm" className="gap-1" onClick={() => handleAddFriend(result)}>
                        <UserPlus className="w-3.5 h-3.5" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching "{searchQuery}".
                </div>
              ) : null}
              
              {!searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  Search for friends by typing their username above.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity. Connect with friends to see activity here!
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const isSender = activity.from_user_id === user?.id;
                  const otherUserId = isSender ? activity.to_user_id : activity.from_user_id;
                  const otherUser = friends.find(f => f.user_id === otherUserId);
                  
                  let icon, title, description;
                  
                  switch (activity.interaction_type) {
                    case 'gift':
                      icon = <Gift className="w-4 h-4 text-green-500" />;
                      title = isSender ? `You sent a gift` : `${otherUser?.username || 'Someone'} sent you a gift`;
                      description = `A ${activity.details.seed_name}`;
                      break;
                    case 'visit':
                      icon = <Home className="w-4 h-4 text-blue-500" />;
                      title = isSender ? `You visited a farm` : `${otherUser?.username || 'Someone'} visited your farm`;
                      description = `Visit lasted ${activity.details.duration}`;
                      break;
                    case 'message':
                      icon = <MessageSquare className="w-4 h-4 text-purple-500" />;
                      title = isSender ? `You sent a message` : `${otherUser?.username || 'Someone'} sent you a message`;
                      description = activity.details.message;
                      break;
                    default:
                      icon = <Calendar className="w-4 h-4 text-gray-500" />;
                      title = 'Activity';
                      description = 'Unknown activity type';
                  }
                  
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 border rounded-lg transition-colors hover:bg-accent/5"
                    >
                      <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center">
                        {icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">{title}</div>
                        <div className="text-xs text-muted-foreground">{description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(activity.created_at)}
                        </div>
                      </div>
                      
                      {otherUser && (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={otherUser.avatar_url} />
                          <AvatarFallback>{otherUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialHub;
