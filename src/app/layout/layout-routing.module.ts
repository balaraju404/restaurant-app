import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const routes: Routes = [
 {
  path: '',
  component: LayoutPage,
  children: [
   {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
   },
   {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule)
   },
   {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsPageModule)
   },
   {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
   },
   {
    path: 'restaurant-home',
    loadChildren: () => import('./restaurant-home/restaurant-home.module').then( m => m.RestaurantHomePageModule)
  }
  ]
 },
  {
    path: 'res-details',
    loadChildren: () => import('./res-details/res-details.module').then( m => m.ResDetailsPageModule)
  },
  {
    path: 'restaurant-profile',
    loadChildren: () => import('./pages/restaurant-profile/restaurant-profile.module').then( m => m.RestaurantProfilePageModule)
  },
  {
    path: 'add-categories',
    loadChildren: () => import('./pages/add-categories/add-categories.module').then( m => m.AddCategoriesPageModule)
  },

];

@NgModule({
 imports: [RouterModule.forChild(routes)],
 exports: [RouterModule],
})
export class LayoutPageRoutingModule { }
