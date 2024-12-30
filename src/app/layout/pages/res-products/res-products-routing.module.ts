import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResProductsPage } from './res-products.page';

const routes: Routes = [
  {
    path: '',
    component: ResProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResProductsPageRoutingModule {}
