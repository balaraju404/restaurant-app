import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResProductsPageRoutingModule } from './res-products-routing.module';

import { ResProductsPage } from './res-products.page';
import { CustomAlertModule } from 'src/app/utils/custom-componets/alert-component/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResProductsPageRoutingModule,
    CustomAlertModule
  ],
  declarations: [ResProductsPage]
})
export class ResProductsPageModule {}
