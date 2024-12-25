import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
 appId: 'com.gbr-food.android',
 appName: 'GBR Food App',
 webDir: 'www',
 // server: {
 //   androidScheme: 'https',
 //   iosScheme: 'https',
 //   hostname: 'your-backend-url.com'  // if using a custom backend URL
 // }
 "plugins": {
  "Camera": {
   "allowEditing": true,
   "saveToGallery": false
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
