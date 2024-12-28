import { Component, OnInit } from '@angular/core';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';
import { APIservice } from '../utils/api.service';
import { AlertService } from '../utils/alert.service';
import { LoadingService } from '../utils/loading.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateRestaurantPage } from './create-restaurant/create-restaurant.page';

@Component({
 selector: 'app-select-restaurant',
 templateUrl: './select-restaurant.page.html',
 styleUrls: ['./select-restaurant.page.scss'],
})
export class SelectRestaurantPage implements OnInit {
 intialLoad: boolean = true
 userData: any = {}
 userResList: any = []
 fallbackResIcon = 'assets/images/restaurant.png'
 constructor(private readonly apiService: APIservice,
  private readonly loadingService: LoadingService,
  private readonly router: Router,
  private readonly modalController: ModalController) { }

 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  console.log(this.userData);
  this.getUserRestaurants()
 }
 async getUserRestaurants() {
  if (!this.intialLoad) {
   await this.loadingService.showLoading()
  }
  const user_id = this.userData['user_id']
  this.apiService.getUserRestaurants(user_id).subscribe({
   next: (res: any) => {
    console.log(res);
    if (res['status']) {
     this.userResList = res['data']
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert('Error', JSON.stringify(err))
   }, complete: () => {
    if (!this.intialLoad) {
     this.loadingService.hideLoading()
    }
    this.intialLoad = false
   }
  })
 }

 async selectRestaurant(data: any) {
  await DBManagerService.setData(data, Constants.RES_USER_SELECTED_KEY)
  this.router.navigate(['/layout'])
 }

 async openCreateRestaurantModal() {
  const modal = await this.modalController.create({
   component: CreateRestaurantPage,
   cssClass: 'my-modal',
   componentProps: {}
  })
  await modal.present()
 }
 async onLogout() {
  await DBManagerService.clearAll()
  this.router.navigate(['/login'])
 }
}
