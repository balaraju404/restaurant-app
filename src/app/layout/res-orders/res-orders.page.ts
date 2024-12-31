import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { OrderDetailsPage } from '../transactions/order-details/order-details.page';
import { HandleOrderPage } from './handle-order/handle-order.page';

@Component({
 selector: 'app-res-orders',
 templateUrl: './res-orders.page.html',
 styleUrls: ['./res-orders.page.scss'],
})
export class ResOrdersPage implements OnInit {
 isLoading: boolean = false
 skeleton_data: any = [1, 2, 3, 4, 5, 6]
 orders_data: any[] = []
 count: number = 0
 userData: any = {}
 resData: any = {}
 isResUser: boolean = false
 params: any = {}
 constructor(private readonly apiService: APIservice, private readonly modalController: ModalController) { }

 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.params['page_num'] = 0
  this.params['page_limit'] = 10
  this.getOrdersData()
 }
 async getOrdersData() {  
  this.isLoading = true
  this.params['res_id'] = this.resData['res_id']
  this.params['status'] = [1, 2, 5, 6]
  this.apiService.getResOrders(this.params).subscribe((res: any) => {
   this.isLoading = false
   if (res['status']) {
    this.orders_data = [...this.orders_data, ...res['data']]
    this.count = res['count']
   } else {
    AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
   }
  }, error => {
   this.isLoading = false
   AlertService.showAlert('Error', JSON.stringify(error))
  })
 }
 loadMoreOrders() {
  this.params['page_num'] = this.params['page_num'] + 1
  this.getOrdersData()
 }
 async openOrderDetailsModal(id: any) {
  const modal = await this.modalController.create({
   component: HandleOrderPage,
   componentProps: {
    orderId: id
   }
  })
  await modal.present()
  await modal.onDidDismiss().then((data: any) => {
   const status = data.data?.['status']
   if (status) {
    this.orders_data = []
    this.getOrdersData()
   }
  })
 }
 // Function to determine button color based on the status
 getButtonColor(status: number): string {
  switch (status) {
   case 1: return 'warning'; // Pending: Yellow/Orange
   case 2: return 'success'; // Accepted: Green
   case 3: return 'danger';  // Rejected: Red
   case 4: return 'dark';    // Canceled: Dark Red
   case 5: return 'primary'; // Packed: Blue
   case 6: return 'tertiary'; // Out of Delivery: Orange
   case 7: return 'success'; // Delivered: Green
   case 8: return 'medium';  // Refunded: Purple
   default: return 'light';
  }
 }

 // Function to determine button label based on the status
 getButtonLabel(status: number): string {
  switch (status) {
   case 1: return 'Pending';
   case 2: return 'Accepted';
   case 3: return 'Rejected';
   case 4: return 'Canceled';
   case 5: return 'Packed';
   case 6: return 'Out of Delivery';
   case 7: return 'Delivered';
   case 8: return 'Refunded';
   default: return 'Unknown';
  }
 }
 handleRefresh(event: any) {
  this.orders_data = []
  this.params['page_num'] = 0
  this.count = 0
  this.getOrdersData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
