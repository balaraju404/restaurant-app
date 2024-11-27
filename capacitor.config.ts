import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gbr-food.app',
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
    }
  }

};

export default config;
