import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResOrdersPage } from './res-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ResOrdersPage
  },  {
    path: 'handle-order',
    loadChildren: () => import('./handle-order/handle-order.module').then( m => m.HandleOrderPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResOrdersPageRoutingModule {}
