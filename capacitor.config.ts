import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
 appId: 'com.gbr.gbrfoodapp',
 appName: 'GBR Food App',
 webDir: 'www',
 plugins: {
  Camera: {
   allowEditing: true,
   saveToGallery: false
  },
  PushNotifications: {
   presentationOptions: ['badge', 'sound', 'alert'],
  },
  SplashScreen: {
   launchAutoHide: false,
   backgroundColor: "#000000",
   androidSplashResourceName: "splash",
   androidScaleType: "CENTER_CROP",
   showSpinner: true,
   androidSpinnerStyle: "large",
   iosSpinnerStyle: "small",
   spinnerColor: "#999999",
   splashFullScreen: true,
   splashImmersive: true,
   layoutName: "launch_screen",
   useDialog: true,
  }
 }
};

export default config;
