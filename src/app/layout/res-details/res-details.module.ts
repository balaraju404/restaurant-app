import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResDetailsPageRoutingModule } from './res-details-routing.module';

import { ResDetailsPage } from './res-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResDetailsPageRoutingModule
  ],
  declarations: [ResDetailsPage]
})
export class ResDetailsPageModule {}
