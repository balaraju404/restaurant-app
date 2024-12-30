import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResCategoriesPage } from './res-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ResCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResCategoriesPageRoutingModule {}
