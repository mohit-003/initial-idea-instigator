
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApkDownloadButtonProps extends ButtonProps {
  showIcon?: boolean;
  text?: string;
}

const ApkDownloadButton = ({
  className,
  variant = "default",
  size,
  showIcon = true,
  text = "Download Android App",
  ...props
}: ApkDownloadButtonProps) => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    // The URL to your APK file hosted on your server
    const apkUrl = "/fitness-farm-app.apk";
    
    try {
      // Create an anchor element and trigger download
      const link = document.createElement("a");
      link.href = apkUrl;
      link.download = "fitness-farm-app.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Development Note",
        description: "We've implemented Capacitor for native app development. Follow the detailed instructions in the console log to build the app correctly.",
        duration: 8000,
      });
      
      console.log(`
=== FITNESS FARM ANDROID APP DEVELOPMENT GUIDE ===

This project is set up with Capacitor to build a native Android app.
To correctly build the Android app and avoid NullPointerException errors:

1. Clone this project to your local machine
2. Run 'npm install' to install all dependencies
3. Run 'npm run build' to build your web application
4. Run 'npx cap sync' to sync your web build to the Android project
5. Run 'npx cap open android' to open the project in Android Studio

FIXING NULL POINTER EXCEPTIONS:
- Make sure you've run 'npx cap sync' AFTER 'npm run build'
- Check MainActivity.java has this in onCreate(): super.onCreate(savedInstanceState)
- Verify the appId in capacitor.config.ts matches the package name in AndroidManifest.xml
- If error persists, insert this before all plugin usage: 
  if (bridge != null && getContext() != null) { /* plugin code here */ }

FIXING GRADLE OR JAVA ERRORS:
- In Android Studio, go to File > Project Structure
- Under Modules, ensure the package name is 'com.fitnessfarm.app'
- Go to android/app/build.gradle and verify:
  - applicationId is 'com.fitnessfarm.app'
  - compileSdkVersion is 33 or higher
  - minSdkVersion is 22 or higher
  - Add this to avoid version conflicts:
    configurations.all {
      resolutionStrategy {
        force 'androidx.core:core-ktx:1.9.0'
      }
    }

AFTER SYNCING GRADLE:
- Clean project (Build > Clean Project)
- Rebuild project (Build > Rebuild)
- If still failing, try File > Invalidate Caches and Restart

For fitness tracking integration, add these to your AndroidManifest.xml:
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

Once built, you'll find the APK in android/app/build/outputs/apk/debug/
      `);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the setup file. Please check the console for development instructions.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleDownload}
      {...props}
    >
      {showIcon && <Download className="w-4 h-4 mr-2" />}
      {text}
    </Button>
  );
};

export default ApkDownloadButton;
