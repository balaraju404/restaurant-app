import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';

@Component({
 selector: 'app-res-details',
 templateUrl: './res-details.page.html',
 styleUrls: ['./res-details.page.scss'],
})
export class ResDetailsPage implements OnInit {
 skeleton_data: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 isCatLoading: boolean = true
 isLoading: boolean = true
 resData: any = []
 categoryData: any = []
 productData: any = []
 selectedCatID: any = ''
 isViewDetails: boolean = false;
 constructor(private readonly apiService: APIservice, private readonly modalController: ModalController) { }

 ngOnInit() {
  this.getCategory();
 }
 getCategory() {
  this.isCatLoading = true
  this.apiService.getResCategories(this.resData['_id']).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.categoryData = res['data'] || [];
     if (this.categoryData.length > 0) {
      this.selectedCatID = this.categoryData[0]['cat_id']
     }
    }
   }, error: err => {
   }, complete: () => {
    this.isCatLoading = false
    if (this.categoryData.length > 0) {
     this.getProduct()
    } else {
     this.isLoading = false
    }
   }
  })
 }
 getProduct() {
  this.isLoading = true
  const params = { res_id: this.resData['_id'], cat_id: this.selectedCatID }
  this.apiService.getResProducts(params).subscribe({
   next: (res: any) => {
    this.isLoading = false
    this.productData = res['data'].map((item: any) => {
     item['quantity'] = 1;
     return item;
    });

   }, error: err => {
    this.isLoading = false
   }
  })
 }

 onChangeCategory(id: any) {
  this.selectedCatID = id
  this.productData = []
  this.getProduct()
 }
 onSearchChange(event: any) {

 }

 viewDetails(event: any) {
  this.isViewDetails = true;
 }

 closeModal() {
  this.modalController.dismiss();
 }
 // afs
 handleRefresh(event: any) {
  this.categoryData = []
  this.productData = []
  this.isLoading = true
  this.getCategory()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }

 eventHandler(event: any, i: number) {
  if (event['quantity'] > 0 && event['quantity'] < 10) {
   event['quantity'] = event['quantity'] + i;
   event['quantity'] = event['quantity'] == 0 ? 1 : event['quantity'];
  }
 }

 dismissAlertModal() {
  this.isViewDetails = false;
 }
}
