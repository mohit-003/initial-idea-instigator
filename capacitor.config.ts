
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitnessfarm.app',
  appName: 'Fitness Farm',
  webDir: 'dist',
  server: {
    url: 'https://47858b31-a1b3-4416-bf1a-7131cde18873.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  },
  android: {
    buildOptions: {
      androidGradleVersion: '7.4.2',
      gradleVersion: '7.6',
      kotlinVersion: '1.8.0'
    },
    minSdkVersion: 22,
    targetSdkVersion: 33
  }
};

export default config;
