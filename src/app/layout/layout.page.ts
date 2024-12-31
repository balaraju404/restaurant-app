import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';
import { APIservice } from '../utils/api.service';
import { AlertService } from '../utils/alert.service';
import { SocketService } from '../utils/socket-io.service';
import { ModalController } from '@ionic/angular';
import { RestaurantProfilePage } from './pages/restaurant-profile/restaurant-profile.page';
import { AddCategoriesPage } from './pages/add-categories/add-categories.page';
import { ResCategoriesPage } from './pages/res-categories/res-categories.page';
import { CreateProductsPage } from './pages/create-products/create-products.page';
import { ResProductsPage } from './pages/res-products/res-products.page';
import { NotificationsPage } from './notifications/notifications.page';

@Component({
 selector: 'app-layout',
 templateUrl: './layout.page.html',
 styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
 notificationsCount: number = 0
 cartCount: number = 0
 resActiveCartCount: number = 0
 userData: any = {}
 resData: any = {}
 role_id: number = 0
 curPage: string = ''
 appIcon: string = Constants.APP_ICON
 fallbackResImg: string = Constants.FALLBACK_RESTAURANT_LOGO
 isResUser: boolean = false
 pageListStatus: boolean = false
 pagesList: any = [
  { 'name': 'Restaurant Profile', 'img': 'restaurant.png', 'num': 1 },
  { 'name': 'Add Categories', 'img': 'restaurant.png', 'num': 2 },
  { 'name': 'Restaurant Categories', 'img': 'restaurant.png', 'num': 3 },
  { 'name': 'Create Products', 'img': 'restaurant.png', 'num': 4 },
  { 'name': 'Products Page', 'img': 'restaurant.png', 'num': 5 },
 ]
 constructor(private readonly router: Router,
  private readonly apiService: APIservice,
  private readonly socketService: SocketService,
  private readonly modalController: ModalController) { }

 async ngOnInit() {
  this.isResUser = await Constants.isRestaurantUsers()
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  if (this.userData) {
   this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
     this.curPage = event.urlAfterRedirects.split('/').pop() || '';
    }
   });
   const pageArr = this.router.url.split('/')
   this.curPage = pageArr[pageArr.length - 1]
   this.role_id = Number(this.userData['role_id'])
   await this.socketService.createConnection(this.userData['user_id'], this.role_id, this.resData?.['res_id'] || '')
   await this.getNotificationsCount()
   Constants.notificationCountSubject.subscribe(() => {
    this.getNotificationsCount()
   })
   if (this.role_id == 1) {
   } else if (this.role_id == 2) {
    await this.getResActiveOrdersCount()
    Constants.resCartCountSubject.subscribe(() => {
     this.getResActiveOrdersCount()
    })
    if (this.curPage == 'layout') {
     this.router.navigate(['/layout/restaurant-home'])
    }
   } else if (this.role_id == 3) {
    await this.getCartCount()
    Constants.cartCountSubject.subscribe(() => {
     this.getCartCount()
    })
    if (this.curPage == 'layout') {
     this.router.navigate(['/layout/home'])
    }
   }
  } else {
   this.router.navigate(['/login'])
  }
 }
 isActive(page: string): boolean {
  return this.curPage === page;
 }
 onNavigatePage(page: string) {
  this.router.navigate(['layout/' + page])
 }
 openPagesList() {
  this.pageListStatus = true
 }
 async openPageModal(num: number) {
  let page: any = ''
  if (num == 1) {
   page = RestaurantProfilePage
  } else if (num == 2) {
   page = AddCategoriesPage
  } else if (num == 3) {
   page = ResCategoriesPage
  } else if (num == 4) {
   page = CreateProductsPage
  } else if (num == 5) {
   page = ResProductsPage
  }
  const modal = await this.modalController.create({
   component: page,
  })
  modal.present()
 }
 closePageListModal() {
  this.pageListStatus = false
 }
 getNotificationsCount() {
  let params: any = { status: 1 }
  params['receiver_id'] = this.isResUser ? this.resData['res_id'] : this.userData['user_id']
  this.apiService.getNotificationsCount(params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.notificationsCount = res['count']
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   },
   error: (error) => {
    AlertService.showAlert('Alert', error?.error['msg'] || JSON.stringify(error))
   }
  })
 }
 getCartCount() {
  const user_id = this.userData['user_id']
  this.apiService.getCartCount({ user_id }).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.cartCount = res['count']
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   },
   error: (error) => {
    AlertService.showAlert('Alert', error?.error['msg'] || JSON.stringify(error))
   }
  })
 }
 getResActiveOrdersCount() {
  const res_id = this.resData['res_id']
  this.apiService.getResActiveOrdersCount({ res_id }).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.resActiveCartCount = res['count']
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   },
   error: (error) => {
    AlertService.showAlert('Alert', error?.error['msg'] || JSON.stringify(error))
   }
  })
 }
 async openNotificationsPage() {
  const modal = await this.modalController.create({
   component: NotificationsPage,
  })
  modal.present()
 }
 async gotoSelectRestaurant() {
  await DBManagerService.removeData(Constants.RES_USER_SELECTED_KEY)
  //   this.router.navigate(['/select-restaurant'])
  location.href = '/select-restaurant'
 }
}
