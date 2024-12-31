import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HandleOrderPageRoutingModule } from './handle-order-routing.module';

import { HandleOrderPage } from './handle-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HandleOrderPageRoutingModule
  ],
  declarations: [HandleOrderPage]
})
export class HandleOrderPageModule {}
