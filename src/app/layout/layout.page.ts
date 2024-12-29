import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';
import { APIservice } from '../utils/api.service';
import { AlertService } from '../utils/alert.service';
import { SocketService } from '../utils/socket-io.service';
import { ModalController } from '@ionic/angular';
import { RestaurantProfilePage } from './pages/restaurant-profile/restaurant-profile.page';

@Component({
 selector: 'app-layout',
 templateUrl: './layout.page.html',
 styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
 cartCount: number = 0
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
  { 'name': 'Create Products', 'img': 'restaurant.png', 'num': 3 },
  { 'name': 'Handle Products', 'img': 'restaurant.png', 'num': 4 },
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
   await this.socketService.createConnection(this.userData['user_id'], this.role_id, this.resData['res_id'] || '')
   if (this.role_id == 1) {
   } else if (this.role_id == 2) {
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
  }
  const modal = await this.modalController.create({
   component: page,
  })
  modal.present()
 }
 closePageListModal() {
  this.pageListStatus = false
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
 async gotoSelectRestaurant() {
  await DBManagerService.removeData(Constants.RES_USER_SELECTED_KEY)
  this.router.navigate(['/select-restaurant'])
 }
}
