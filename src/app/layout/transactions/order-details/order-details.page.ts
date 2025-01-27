import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-order-details',
 templateUrl: './order-details.page.html',
 styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
 @Input() orderId: any = ''
 ordersData: any = {}
 isResUser: boolean = false
 constructor(private readonly modalController: ModalController, private readonly apiService: APIservice, private readonly loadingService: LoadingService) { }

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
 getTotalItems() {
  return this.ordersData?.products_data?.reduce((acc: any, product: any) => acc + product.product_qty, 0);
 }
 getTotalAmount() {
  return this.ordersData?.products_data?.reduce((acc: any, product: any) => acc + (product.price * product.product_qty), 0);
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  this.getOrderData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
