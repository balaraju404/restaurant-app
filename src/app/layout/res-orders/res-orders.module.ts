import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResOrdersPageRoutingModule } from './res-orders-routing.module';

import { ResOrdersPage } from './res-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResOrdersPageRoutingModule
  ],
  declarations: [ResOrdersPage]
})
export class ResOrdersPageModule {}
