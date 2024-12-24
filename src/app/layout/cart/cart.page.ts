import { Component, OnInit } from '@angular/core';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel, AlertPositionType, AlertType } from 'src/app/utils/custom-componets/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';

@Component({
 selector: 'app-cart',
 templateUrl: './cart.page.html',
 styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
 isLoading: boolean = false
 userData: any = {}
 userCartData: any[] = []
 alert_mdl!: AlertModel;

 constructor(private readonly apiService: APIservice
  // ,private socketService: SocketService
 ) { }

 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.getUserCartData()
 }

 async getUserCartData() {
  const user_id = this.userData['user_id']
  const params = { 'user_id': user_id, 'status': 1 }
  this.isLoading = true
  this.apiService.getUserCartData(params).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     this.userCartData = res['data'];
    }
   }, error: error => {
    this.isLoading = false
    alert(JSON.stringify(error))
   }
  })
 }
 getTotalPrice() {
  return this.userCartData.reduce((total, item) => total + (item['price'] * item['product_qty']), 0);
 }
 handleQuantity(item: any, value: number) {
  if (value === 0) {
   if (item['product_qty'] <= 1) {
    return alert('The minimum quantity is 1. You cannot decrease it further.');
   }
   item['product_qty'] -= 1;
   this.updateCartData(item)
  }
  else if (value === 1) {
   if (item['product_qty'] >= 5) {
    return alert('The maximum quantity allowed is 5.');
   }
   item['product_qty'] += 1;
   this.updateCartData(item)
  }
 }
 updateCartData(item: any) {
  const user_id = this.userData['user_id'];
  const params = { cart_id: item['cart_id'], user_id: user_id, res_id: item['res_id'], cat_id: item['cat_id'], product_id: item['product_id'], product_qty: item['product_qty'], status: 1 };
  this.isLoading = true
  this.apiService.updateCartData(params).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     this.getUserCartData()
     this.alert_mdl = new AlertModel(AlertType.Success, 'Success!', res['msg']);
    } else {
     this.alert_mdl = new AlertModel(AlertType.Error, 'Success!', res['msg'] || JSON.stringify(res));
    }
   }, error: error => {
    this.isLoading = false
    this.alert_mdl = new AlertModel(AlertType.Error, 'Success!', error.error['message'] || JSON.stringify(error));
   }
  })
 }
 deleteItem(cart_id: any) {
  if (!confirm('Are you sure , you want to delete item ?')) {
   return
  }
  this.isLoading = true
  this.apiService.deleteCartItem(cart_id).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     this.getUserCartData()
     alert(res['msg'])
    } else {
     alert(res['msg'] || JSON.stringify(res))
    }
   }, error: error => {
    this.isLoading = false
    alert(JSON.stringify(error))
   }
  })
 }
 placeOrder() {
  const user_id = this.userData['user_id'];
  const res_id = this.userCartData[0]['res_id'];
  const total_price = this.userCartData.reduce((total, item) => total + (item['price'] * item['product_qty']), 0);

  const products_data = this.userCartData.map((item: any) => {
   return { cart_id: item['cart_id'], product_id: item['product_id'], product_qty: item['product_qty'] };
  });

  const params = { 'user_id': user_id, 'res_id': res_id, 'total_price': total_price, 'products_data': products_data, 'status': 1 };
  this.isLoading = true
  this.apiService.sendOrderRequest(params).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     // this.socketService.sendOrderData(params);
     this.getUserCartData()
     alert(res['msg']);
    } else {
     alert(res['msg'] || JSON.stringify(res));
    }
   }, error: error => {
    this.isLoading = false
    alert(JSON.stringify(error))
   }
  });
 }
 getcurrentLocation() {
  navigator.geolocation.getCurrentPosition(position => {
   console.log(position.coords.latitude, position.coords.longitude)
  })
 }

}
