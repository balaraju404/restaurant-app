import { Component } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';  // Firebase Messaging
import { initializeApp } from 'firebase/app';  // Firebase Modular SDK v9+
import { environment } from '../environments/environment';

@Component({
 selector: 'app-root',
 templateUrl: 'app.component.html',
 styleUrls: ['app.component.scss'],
})
export class AppComponent {
 constructor(private platform: Platform) {
  this.platform.ready().then(() => {
   this.setupPushNotifications();
  });
 }

 // Set up push notifications
 private setupPushNotifications() {
  if (this.platform.is('capacitor')) {
   // Setup Push Notifications for Android using Capacitor plugin
   PushNotifications.requestPermissions().then((permission) => {
    if (permission.receive === 'granted') {
     PushNotifications.register();
    } else {
     console.log('Push notifications permission denied');
    }
   });
  } else {
   // Handle Web Push Notifications
   const app = initializeApp(environment.firebaseConfig);
   const messaging = getMessaging(app);
   this.requestFirebasePermission(messaging);
  }
 }

 private async requestFirebasePermission(messaging: Messaging) {
  try {
   console.log(messaging);
   
   // Request the FCM token
   const token = await getToken(messaging, {
    vapidKey: environment.firebaseVapidKey,
   });
console.log(token);

   if (token) {
    console.log('Firebase FCM token:', token);
    // Send this token to your backend for future notifications
   } else {
    console.log('No token available');
   }
  } catch (error) {
   console.error('Error getting Firebase token:', error);
  }

  // Handle foreground notifications
  onMessage(messaging, (payload) => {
   console.log('Message received:', payload);
   // Process the notification payload here
  });
 }

}
