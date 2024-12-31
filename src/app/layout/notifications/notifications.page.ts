import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-notifications',
 templateUrl: './notifications.page.html',
 styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
 notificationsData: any = []
 userData: any = {}
 resData: any = {}
 isResUser: boolean = false
 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }

 async ngOnInit() {
  this.isResUser = await Constants.isRestaurantUsers()
  if (this.isResUser) {
   this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  } else {
   this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  }
  this.getNotifications()
 }
 async getNotifications() {
  let params: any = {}
  params['receiver_id'] = this.isResUser ? this.resData['res_id'] : this.userData['user_id']
  await this.loadingService.showLoading()
  this.apiService.getNotifications(params).subscribe({
   next: async (res: any) => {
    await this.loadingService.hideLoading()
    if (res['status']) {
     this.notificationsData = res['data']
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 onOpenNotification(data: any) {
  console.log(data);

  // if (data['link']) {

  // }
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  this.getNotifications()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
