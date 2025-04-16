import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Code } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ApkDownloadButton from "@/components/ApkDownloadButton";

const AndroidApp = () => {
  const [activeTab, setActiveTab] = useState("android");
  const { toast } = useToast();
  
  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mt-8 mb-4">Integration Guides</h1>
      <p className="text-muted-foreground mb-8">
        Connect your farming RPG game to our fitness tracking platform
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="android">Android App Integration</TabsTrigger>
          <TabsTrigger value="unity">Unity Game Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="android" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Android Fitness App Setup</CardTitle>
              <CardDescription>
                Track fitness data with our Android app and sync it with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 1: Download the App</h3>
                <p>Download our Harvest Steps Fitness Tracker app from our website or use the button below.</p>
                <ApkDownloadButton variant="outline" className="mt-2" />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 2: Sign In</h3>
                <p>Sign in with the same account you use for the Harvest Steps website.</p>
                <div className="bg-muted p-4 rounded-md">
                  <p>Email: your.email@example.com</p>
                  <p>Password: **********</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: Enable Permissions</h3>
                <p>Allow the app to access your device's fitness sensors.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Motion & fitness activity</li>
                  <li>Location services (optional for route tracking)</li>
                  <li>Background activity</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 4: Start Tracking</h3>
                <p>Your steps and activity will automatically sync to your account.</p>
                <div className="bg-muted p-4 rounded-md">
                  <p>Steps walked = Farm Coins earned</p>
                  <p>1 coin per 100 steps walked</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Need help? Contact support@harveststeps.com
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="unity" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Unity Game Integration</CardTitle>
              <CardDescription>
                Connect your Unity farming game to our fitness tracking platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 1: Install Supabase for Unity</h3>
                <p>Add Supabase SDK to your Unity project via the Package Manager.</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
                      {`# Add via git URL in the Package Manager:
https://github.com/supabase-community/supabase-unity`}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyClick("https://github.com/supabase-community/supabase-unity")}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 2: Initialize Supabase Client</h3>
                <p>Set up the Supabase client in your Unity project.</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
{`using Supabase;
using Supabase.Gotrue;

public class SupabaseManager : MonoBehaviour
{
    private Client supabaseClient;
    private string supabaseUrl = "https://gyznxttsncqajqcbxefj.supabase.co";
    private string supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5em54dHRzbmNxYWpxY2J4ZWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzMzMDksImV4cCI6MjA1NzAwOTMwOX0.Lh7JTOSgxMEMcAGLREXiZaRADpRYdXJRXSUUm_z_1QU";
    
    private static SupabaseManager _instance;
    public static SupabaseManager Instance { get { return _instance; } }
    
    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(this.gameObject);
        }
        else
        {
            _instance = this;
            DontDestroyOnLoad(this.gameObject);
            InitializeSupabase();
        }
    }
    
    async void InitializeSupabase()
    {
        supabaseClient = new Client(supabaseUrl, supabaseKey);
        
        // If user was previously logged in, refresh their session
        var session = await supabaseClient.Auth.RetrieveSessionAsync();
        
        Debug.Log("Supabase initialized");
    }
    
    public Client GetClient()
    {
        return supabaseClient;
    }
}`}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyClick(`using Supabase;
using Supabase.Gotrue;

public class SupabaseManager : MonoBehaviour
{
    private Client supabaseClient;
    private string supabaseUrl = "https://gyznxttsncqajqcbxefj.supabase.co";
    private string supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5em54dHRzbmNxYWpxY2J4ZWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzMzMDksImV4cCI6MjA1NzAwOTMwOX0.Lh7JTOSgxMEMcAGLREXiZaRADpRYdXJRXSUUm_z_1QU";
    
    private static SupabaseManager _instance;
    public static SupabaseManager Instance { get { return _instance; } }
    
    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(this.gameObject);
        }
        else
        {
            _instance = this;
            DontDestroyOnLoad(this.gameObject);
            InitializeSupabase();
        }
    }
    
    async void InitializeSupabase()
    {
        supabaseClient = new Client(supabaseUrl, supabaseKey);
        
        // If user was previously logged in, refresh their session
        var session = await supabaseClient.Auth.RetrieveSessionAsync();
        
        Debug.Log("Supabase initialized");
    }
    
    public Client GetClient()
    {
        return supabaseClient;
    }
}`)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 3: User Authentication</h3>
                <p>Implement login functionality in your Unity game.</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
{`public class AuthManager : MonoBehaviour
{
    public async Task<bool> SignIn(string email, string password)
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            var response = await client.Auth.SignIn(email, password);
            
            if (response.User != null)
            {
                Debug.Log("User signed in: " + response.User.Id);
                return true;
            }
            
            return false;
        }
        catch (Exception e)
        {
            Debug.LogError("Sign in error: " + e.Message);
            return false;
        }
    }
    
    public async Task<bool> SignOut()
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            await client.Auth.SignOut();
            return true;
        }
        catch (Exception e)
        {
            Debug.LogError("Sign out error: " + e.Message);
            return false;
        }
    }
}`}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyClick(`public class AuthManager : MonoBehaviour
{
    public async Task<bool> SignIn(string email, string password)
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            var response = await client.Auth.SignIn(email, password);
            
            if (response.User != null)
            {
                Debug.Log("User signed in: " + response.User.Id);
                return true;
            }
            
            return false;
        }
        catch (Exception e)
        {
            Debug.LogError("Sign in error: " + e.Message);
            return false;
        }
    }
    
    public async Task<bool> SignOut()
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            await client.Auth.SignOut();
            return true;
        }
        catch (Exception e)
        {
            Debug.LogError("Sign out error: " + e.Message);
            return false;
        }
    }
}`)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Step 4: Fetch Currency & User Data</h3>
                <p>Get the user's fitness data and currency for use in your game.</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
{`public class GameDataManager : MonoBehaviour
{
    private int userCoins = 0;
    
    // Call this when game starts
    public async Task FetchUserData()
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            var sessionResponse = await client.Auth.RetrieveSessionAsync();
            
            if (sessionResponse == null)
            {
                Debug.LogError("User not logged in");
                return;
            }
            
            // Fetch user currency
            var response = await client.From<UserCurrency>()
                .Select("*")
                .Single();
                
            if (response != null)
            {
                userCoins = response.Coins;
                Debug.Log("User has " + userCoins + " coins");
            }
            else
            {
                Debug.Log("No currency data found, defaulting to 0 coins");
                userCoins = 0;
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error fetching data: " + e.Message);
        }
    }
    
    // Spend coins in the game
    public async Task<bool> SpendCoins(int amount)
    {
        if (amount <= 0)
        {
            Debug.LogError("Invalid amount");
            return false;
        }
        
        if (userCoins < amount)
        {
            Debug.Log("Not enough coins");
            return false;
        }
        
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            
            // Call the unity-game-api edge function
            var requestData = new Dictionary<string, object>
            {
                { "amount", amount }
            };
            
            var response = await client.Functions.Invoke<Dictionary<string, object>>(
                "unity-game-api/spend-coins", 
                requestData
            );
            
            // Update local coin count
            userCoins -= amount;
            Debug.Log("Spent " + amount + " coins. Remaining: " + userCoins);
            
            return true;
        }
        catch (Exception e)
        {
            Debug.LogError("Error spending coins: " + e.Message);
            return false;
        }
    }
}

// Model class for currency data
[Supabase.Postgrest.Attributes.Table("user_currency")]
public class UserCurrency
{
    [Supabase.Postgrest.Attributes.PrimaryKey("id")]
    public string Id { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("user_id")]
    public string UserId { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("coins")]
    public int Coins { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("last_updated")]
    public DateTime LastUpdated { get; set; }
}`}
                    </code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyClick(`public class GameDataManager : MonoBehaviour
{
    private int userCoins = 0;
    
    // Call this when game starts
    public async Task FetchUserData()
    {
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            var sessionResponse = await client.Auth.RetrieveSessionAsync();
            
            if (sessionResponse == null)
            {
                Debug.LogError("User not logged in");
                return;
            }
            
            // Fetch user currency
            var response = await client.From<UserCurrency>()
                .Select("*")
                .Single();
                
            if (response != null)
            {
                userCoins = response.Coins;
                Debug.Log("User has " + userCoins + " coins");
            }
            else
            {
                Debug.Log("No currency data found, defaulting to 0 coins");
                userCoins = 0;
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error fetching data: " + e.Message);
        }
    }
    
    // Spend coins in the game
    public async Task<bool> SpendCoins(int amount)
    {
        if (amount <= 0)
        {
            Debug.LogError("Invalid amount");
            return false;
        }
        
        if (userCoins < amount)
        {
            Debug.Log("Not enough coins");
            return false;
        }
        
        try
        {
            var client = SupabaseManager.Instance.GetClient();
            
            // Call the unity-game-api edge function
            var requestData = new Dictionary<string, object>
            {
                { "amount", amount }
            };
            
            var response = await client.Functions.Invoke<Dictionary<string, object>>(
                "unity-game-api/spend-coins", 
                requestData
            );
            
            // Update local coin count
            userCoins -= amount;
            Debug.Log("Spent " + amount + " coins. Remaining: " + userCoins);
            
            return true;
        }
        catch (Exception e)
        {
            Debug.LogError("Error spending coins: " + e.Message);
            return false;
        }
    }
}

// Model class for currency data
[Supabase.Postgrest.Attributes.Table("user_currency")]
public class UserCurrency
{
    [Supabase.Postgrest.Attributes.PrimaryKey("id")]
    public string Id { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("user_id")]
    public string UserId { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("coins")]
    public int Coins { get; set; }
    
    [Supabase.Postgrest.Attributes.Column("last_updated")]
    public DateTime LastUpdated { get; set; }
}`)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <p className="text-sm text-muted-foreground">
                Our API automatically converts fitness activity to in-game currency that players can spend in your farming game.
              </p>
              <Button variant="default">
                Download Unity Integration Package
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AndroidApp;
