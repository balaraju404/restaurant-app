import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProductsPageRoutingModule } from './create-products-routing.module';

import { CreateProductsPage } from './create-products.page';
import { CustomAlertModule } from 'src/app/utils/custom-componets/alert-component/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateProductsPageRoutingModule,
    CustomAlertModule
  ],
  declarations: [CreateProductsPage]
})
export class CreateProductsPageModule {}
