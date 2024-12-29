import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantProfilePage } from './restaurant-profile.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantProfilePageRoutingModule {}
