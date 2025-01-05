import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';
import { HandleOrderPage } from '../res-orders/handle-order/handle-order.page';
import { OrderDetailsPage } from '../transactions/order-details/order-details.page';

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
 async onOpenNotification(item: any) {
  if (item['status'] == 1) {
   this.updateNotification(item)
  }
  const id = item['ref_id']
  if (id) {
   if (await Constants.isUser()) {
    this.openUserOrderModal(id)
   } else if (await Constants.isRestaurantUsers()) {
    this.openResOrderModal(id)
   }
  }
 }
 updateNotification(item: any) {
  const params: any = { 'notification_id': item['notification_id'], 'status': 2 }
  this.apiService.updateNotification(params).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     item['status'] = 2
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 async openUserOrderModal(id: any) {
  const modal = await this.modalController.create({
   component: OrderDetailsPage,
   componentProps: {
    orderId: id
   }
  })
  await modal.present()
 }
 async openResOrderModal(id: any) {
  const modal = await this.modalController.create({
   component: HandleOrderPage,
   componentProps: {
    orderId: id
   }
  })
  await modal.present()
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
