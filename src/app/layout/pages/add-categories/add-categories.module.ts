import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCategoriesPageRoutingModule } from './add-categories-routing.module';

import { AddCategoriesPage } from './add-categories.page';
import { CustomAlertModule } from 'src/app/utils/custom-componets/alert-component/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCategoriesPageRoutingModule,
    CustomAlertModule
  ],
  declarations: [AddCategoriesPage]
})
export class AddCategoriesPageModule {}
