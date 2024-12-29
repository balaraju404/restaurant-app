import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantProfilePageRoutingModule } from './restaurant-profile-routing.module';

import { RestaurantProfilePage } from './restaurant-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantProfilePageRoutingModule
  ],
  declarations: [RestaurantProfilePage]
})
export class RestaurantProfilePageModule {}
