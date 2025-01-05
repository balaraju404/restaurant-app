import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-handle-order',
 templateUrl: './handle-order.page.html',
 styleUrls: ['./handle-order.page.scss'],
})
export class HandleOrderPage implements OnInit {
 @Input() orderId: any = ''
 ordersData: any = {}
 isResUser: boolean = false
 isPageChange: boolean = false
 constructor(private readonly modalController: ModalController,
  private readonly apiService: APIservice,
  private readonly loadingService: LoadingService) { }

 async ngOnInit() {
  this.isResUser = await Constants.isRestaurantUsers()
  if (this.orderId.length > 0) {
   this.getOrderData()
  }
 }
 async getOrderData() {
  await this.loadingService.showLoading()
  const params: any = { trans_id: this.orderId }
  this.apiService.getResOrders(params).subscribe({
   next: async (res: any) => {
    await this.loadingService.hideLoading()
    if (res['status']) {
     this.ordersData = res['data'][0];
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert('Alert', JSON.stringify(err))
   }
  })
 }
 handleOrder(obj: any, status: number) {
  let msg = ''
  if (status === 2) {
   msg = 'Do you want to accept this order?'
  } else if (status === 3) {
   msg = 'Do you want to Reject this order?'
  } else if (status === 5) {
   msg = 'Do you want to packed this order?'
  } else if (status === 6) {
   msg = 'Do you want to out for delivery this order?'
  } else if (status === 7) {
   msg = 'Do you want to delivered this order?'
  } else if (status === 8) {
   msg = 'Do you want to refund this order?'
  }
  AlertService.showConfirmAlert("Alert", msg, "OK", async (num: number) => {
   if (num == 1) {
    let params: any = { "trans_id": obj['trans_id'], "res_id": obj['res_id'], "user_id": obj['user_id'], "status": status }
    await this.loadingService.showLoading()
    this.apiService.handleOrder(params).subscribe({
     next: async (res: any) => {
      await this.loadingService.hideLoading()
      if (res['status']) {
       this.isPageChange = true
       if ([3, 4, 7, 8].includes(status)) {
        Constants.resCartCountSubject.next(true)
       }
       AlertService.showAlert('Alert', res['msg'])
       this.getOrderData()
      } else {
       AlertService.showAlert('Alert', res['msg'] || JSON.parse(res))
      }
     }, error:async error => {
      await this.loadingService.hideLoading()
      AlertService.showAlert('Alert', JSON.stringify(error))
     }
    })
   }
  })
 }
 getTotalItems() {
  return this.ordersData.products_data?.reduce((acc: any, product: any) => acc + Number(product.product_qty), 0);
 }
 getTotalAmount() {
  return this.ordersData.products_data?.reduce((acc: any, product: any) => acc + (product.price * product.product_qty), 0);
 }
 getStatusText(status: number): string {
  switch (status) {
   case 1: return 'Order Placed. Waiting for your confirmation.';
   case 2: return 'Order Accepted.';
   case 5: return 'Order Packed.';
   case 6: return 'Order Out of Delivery Area.';
   case 3: return 'Order Rejected by Restaurant';
   case 4: return 'Order Canceled by User';
   case 7: return 'Order Delivered.';
   case 8: return 'Order Refunded';
   default: return 'Unknown Status';
  }
 }

 getStatusColor(status: number): string {
  if (status === 3) return 'danger';
  if (status === 4) return 'secondary';
  if (status === 7 || status === 5) return 'success';
  return 'warning';
 }

 getStatusIcon(status: number): string {
  switch (status) {
   case 1: return 'hourglass';
   case 2: return 'checkmark-circle';
   case 3: return 'close-circle-outline';
   case 4: return 'close-circle-outline';
   case 5: return 'cube';
   case 6: return 'remove-circle';
   case 7: return 'checkmark-circle';
   case 8: return 'cash';
   default: return 'help-circle';
  }
 }

 getStatusIconColor(status: number): string {
  switch (status) {
   case 1: return 'warning';
   case 2: return 'success';
   case 5: return 'primary';
   case 6: return 'danger';
   case 7: return 'success';
   case 8: return 'secondary';
   default: return 'dark';
  }
 }
 getStatusDate(status: number) {
  switch (status) {
   case 1: return 'Order Placed on ' + this.ordersData?.['display_order_date'];
   case 2: return 'Order Accepted on ' + this.ordersData?.['accepted_date'];
   case 3: return 'Order Rejected on ' + this.ordersData?.['rejected_date'];
   case 4: return 'Order Cancelled on ' + this.ordersData?.['cancelled_date'];
   case 5: return 'Order Packed on ' + this.ordersData?.['shipped_date'];
   case 6: return 'Order Out of Delivery Area on ' + this.ordersData?.['out_of_delivery_date']
   case 7: return 'Order Delivered on ' + this.ordersData?.['delivered_date'];
   case 8: return 'Order Refunded on ' + this.ordersData?.['refunded_date'];
   default: return 'Unknown Status';
  }
 }
 dismiss() {
  this.modalController.dismiss({ "status": this.isPageChange })
 }
 handleRefresh(event: any) {
  this.getOrderData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
