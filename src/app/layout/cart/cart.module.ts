import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { CustomAlertModule } from 'src/app/utils/custom-componets/alert-component/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    CustomAlertModule
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
