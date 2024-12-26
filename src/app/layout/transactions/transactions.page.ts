import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { OrderDetailsPage } from './order-details/order-details.page';

@Component({
 selector: 'app-transactions',
 templateUrl: './transactions.page.html',
 styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
 isLoading: boolean = false
 skeleton_data: any = [1, 2, 3, 4, 5, 6]
 orders_data: any[] = []
 userData: any = {}
 roleId: any;
 params: any = {}
 constructor(private readonly apiService: APIservice, private readonly modalController: ModalController) { }
 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.roleId = this.userData['role_id']
  this.getOrdersData()
 }

 async getOrdersData() {
  if (this.roleId == 3) {
   this.params['user_id'] = this.userData['user_id']
  } else if (this.roleId == 2 || this.roleId == 4) {
   const resData: any = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
   this.params['res_id'] = resData['res_id']
  }
  this.isLoading = true
  this.apiService.getResOrders(this.params).subscribe((res: any) => {
   this.isLoading = false
   if (res['status']) {
    this.orders_data = res['data']
   }
  }, error => {
   this.isLoading = false
   AlertService.showAlert('Alert', JSON.stringify(error))
  })
 }
 handleOrder(params: any, status: boolean) {
  params['status'] = status
  this.isLoading = true
  this.apiService.handleOrder(params).subscribe((res: any) => {
   this.isLoading = false
   if (res['status']) {
    AlertService.showAlert('Alert', res['msg'])
    this.getOrdersData()
   } else {
    AlertService.showAlert('Alert', res['msg'] || JSON.parse(res))
   }
  }, error => {
   this.isLoading = false
   AlertService.showAlert('Alert', JSON.stringify(error))
  })
 }
 async openOrderDetailsModal(item: any) {
  const modal = await this.modalController.create({
   component: OrderDetailsPage,
   componentProps: {
    ordersData: item
   }
  })
  await modal.present()
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
  this.getOrdersData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
