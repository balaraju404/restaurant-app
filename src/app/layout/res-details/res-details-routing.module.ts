import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResDetailsPage } from './res-details.page';

const routes: Routes = [
  {
    path: '',
    component: ResDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResDetailsPageRoutingModule {}
