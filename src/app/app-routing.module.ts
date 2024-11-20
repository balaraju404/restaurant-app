import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 {
  path: 'layout',
  loadChildren: () => import('./layout/layout.module').then(m => m.LayoutPageModule)
 },
 {
  path: '',
  redirectTo: 'layout',
  pathMatch: 'full'
 },
 {
  path: 'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
 },
 {
  path: 'signup',
  loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
 }
];

@NgModule({
 imports: [
  RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
 ],
 exports: [RouterModule]
})
export class AppRoutingModule { }
