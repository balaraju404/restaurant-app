import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { DBManagerService } from './utils/db-manager.service';
import { Constants } from './utils/constants.service';
import { AlertService } from './utils/alert.service';
import { HandleOrderPage } from './layout/res-orders/handle-order/handle-order.page';
import { OrderDetailsPage } from './layout/transactions/order-details/order-details.page';

@Component({
 selector: 'app-root',
 templateUrl: 'app.component.html',
 styleUrls: ['app.component.scss'],
})
export class AppComponent {
 constructor(
  private readonly platform: Platform,
  private readonly modalController: ModalController
 ) {
  this.initializeApp();
 }

 initializeApp() {
  this.platform.ready().then(async () => {
   console.log('App Loaded');
   await SplashScreen.hide();
   if ((this.platform.is("ios") || this.platform.is("android")) && !this.platform.is("mobileweb")) {
    this.setUpPushNotifications();
   } else {
    AlertService.showAlert('Error', 'Push notifications not supported on this platform');
   }
  });
 }

 setUpPushNotifications() {
  console.log('Initializing Push Notifications');
//   AlertService.showAlert(
//    'Push Notifications Permission',
//    'We need your permission to send you push notifications about updates.'
//   ).then(() => {
   PushNotifications.requestPermissions().then(result => {
    if (result.receive === 'granted') {
     PushNotifications.register();
    } else {
     AlertService.showAlert('Permission Denied', 'Push notifications permission denied.');
    }
   });
//   });

  // On success, handle token registration
  PushNotifications.addListener('registration', async (token: Token) => {
   console.log('Push registration success, token: ', token.value);
//    AlertService.showAlert('Alert', 'Token: ' + JSON.stringify(token))
   if (token['value'] && token['value'].length > 0) {
    Constants.FIREBASE_TOKEN = token['value'];
    await DBManagerService.setData(token.value, Constants.LS_FIREBASE_TOKEN_KEY);
   }
  });

  // On error, display a message
  PushNotifications.addListener('registrationError', (error: any) => {
   AlertService.showAlert('Push Notification Error', `Failed to register push notifications: ${JSON.stringify(error)}`);
  });

  // On push notification received
  PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
//    AlertService.showAlert('Push received', JSON.stringify(notification));
  });

  // On push notification action performed
  PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
//    AlertService.showAlert('Push action performed', JSON.stringify(notification));
   const id = notification.notification.data['id']
   if (id) {
    if (await Constants.isUser()) {
     this.openUserOrderModal(id)
    } else if (await Constants.isRestaurantUsers()) {
     this.openResOrderModal(id)
    }
   }
  });
 }
 async openUserOrderModal(id: any) {
  const modal = await this.modalController.create({
   component: OrderDetailsPage,
   componentProps: {
    orderId: id
   }
  })
  await modal.present()
 }
 async openResOrderModal(id: any) {
  const modal = await this.modalController.create({
   component: HandleOrderPage,
   componentProps: {
    orderId: id
   }
  })
  await modal.present()
 }
}
