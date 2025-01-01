import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { CustomAlertModule } from './utils/custom-componets/alert-component/custom-alert.module';
import { SocketService } from './utils/socket-io.service';
import { environment } from '../environments/environment';

import { initializeApp } from 'firebase/app';  // Firebase Modular SDK v9+
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';  // Firebase Messaging

@NgModule({
 declarations: [AppComponent],
 imports: [
  BrowserModule,
  IonicModule.forRoot(),
  AppRoutingModule,
  CustomAlertModule,
 ],
 providers: [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideHttpClient(),
  SocketService
 ],
 bootstrap: [AppComponent],
})
export class AppModule {
 constructor() {
  // Initialize Firebase with your config
  const app = initializeApp(environment.firebaseConfig);
  const messaging = getMessaging(app);

  // Handle messaging token (see AppComponent for further details)
 }
}
