import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
 appId: 'com.gbr-food.android',
 appName: 'GBR Food App',
 webDir: 'www',
 "plugins": {
  "Camera": {
   "allowEditing": true,
   "saveToGallery": false
  },
  PushNotifications: {
   presentationOptions: ['badge', 'sound', 'alert'],
  },
  SplashScreen: {
   launchAutoHide: true,
   launchShowDuration: 3000,
   backgroundColor: "#ffffff",
   splashFullScreen: true,
   splashImmersive: true,
   androidScaleType: 'CENTER_CROP',
  }
 }
};

export default config;
