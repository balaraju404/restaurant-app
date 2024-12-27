import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { CustomAlertModule } from './utils/custom-componets/custom-alert.module';
import { SocketService } from './utils/socket-io.service';

@NgModule({
 declarations: [AppComponent],
 imports: [
  BrowserModule,
  IonicModule.forRoot(),
  AppRoutingModule,
  CustomAlertModule
 ],
 providers: [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideHttpClient(),
  SocketService
 ],
 bootstrap: [AppComponent],
})
export class AppModule { }
