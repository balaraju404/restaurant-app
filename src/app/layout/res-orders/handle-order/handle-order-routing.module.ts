import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HandleOrderPage } from './handle-order.page';

const routes: Routes = [
  {
    path: '',
    component: HandleOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HandleOrderPageRoutingModule {}
