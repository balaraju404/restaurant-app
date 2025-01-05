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
  const resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  if (resData) {
   this.router.navigate(['/layout'])
  } else {
   this.getUserRestaurants()
  }
 }
 async getUserRestaurants() {
  if (!this.intialLoad) {
   await this.loadingService.showLoading()
  }
  const user_id = this.userData['user_id']
  this.apiService.getUserRestaurants(user_id).subscribe({
   next: (res: any) => {
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
  const device_token = await DBManagerService.getData(Constants.FIREBASE_TOKEN)
  if (device_token) {
   const id = data['res_id']
   const params = { 'id': id, 'device_token': device_token }
   await this.loadingService.showLoading()
   this.apiService.saveDeviceToken(params).subscribe({
    next: async (res: any) => {
     await this.loadingService.hideLoading()
     if (res['status']) {
      await DBManagerService.setData(data, Constants.RES_USER_SELECTED_KEY)
      await DBManagerService.setData(res['insertedId'], Constants.LS_DEVICE_TOKEN_ID)
      this.router.navigate(['/layout'])
     } else {
      AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
     }
    }, error: async err => {
     await this.loadingService.hideLoading()
     AlertService.showAlert('Error', JSON.stringify(err))
    }
   })
  } else {
   await DBManagerService.setData(data, Constants.RES_USER_SELECTED_KEY)
   this.router.navigate(['/layout'])
  }
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
  const device_token_id = await DBManagerService.getData(Constants.LS_DEVICE_TOKEN_ID)
  if (device_token_id) {
   await this.loadingService.showLoading()
   this.apiService.updateDeviceToken({ device_token_id: device_token_id, status: 0 }).subscribe({
    next: async (res: any) => {
     await this.loadingService.hideLoading()
     if (res['status']) {
      await Constants.clearLSonLogout()
      // this.router.navigate(['/login'])
      location.href = '/login'
     } else {
      AlertService.showAlert('Error', JSON.stringify(res['msg'] || res))
     }
    }, error: async err => {
     await this.loadingService.hideLoading()
     AlertService.showAlert('Error', JSON.stringify(err))
    }
   })
  } else {
   await Constants.clearLSonLogout()
   // this.router.navigate(['/login'])
   location.href = '/login'
  }
 }
 async handleRefresh(event: any) {
  this.getUserRestaurants()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
