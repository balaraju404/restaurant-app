import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
 selector: 'app-order-details',
 templateUrl: './order-details.page.html',
 styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
 @Input() ordersData: any = {}
 constructor(private readonly modalController: ModalController) { }

 ngOnInit() {
  console.log(this.ordersData);
 }
 getTotalItems() {
  return this.ordersData.products_data.reduce((acc: any, product: any) => acc + product.product_qty, 0);
 }
 getTotalAmount() {
  return this.ordersData.products_data.reduce((acc: any, product: any) => acc + (product.price * product.product_qty), 0);
 }
 dismiss() {
  this.modalController.dismiss()
 }
}
