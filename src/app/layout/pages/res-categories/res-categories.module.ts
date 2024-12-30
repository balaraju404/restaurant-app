import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResCategoriesPageRoutingModule } from './res-categories-routing.module';

import { ResCategoriesPage } from './res-categories.page';
import { CustomAlertModule } from 'src/app/utils/custom-componets/alert-component/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResCategoriesPageRoutingModule,
    CustomAlertModule
  ],
  declarations: [ResCategoriesPage]
})
export class ResCategoriesPageModule {}
