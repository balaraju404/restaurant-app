import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-res-details',
 templateUrl: './res-details.page.html',
 styleUrls: ['./res-details.page.scss'],
})
export class ResDetailsPage implements OnInit {
 showAlertMdl: boolean = false;
 alertMdlData: any = {}
 skeleton_data: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 isCatLoading: boolean = true
 isLoading: boolean = true
 resData: any = []
 categoryData: any = []
 productData: any = []
 selectedCatID: any = ''
 isViewDetails: boolean = false;
 productDetails: any;
 searchFlag: boolean = false
 searchData: any = []
 constructor(private readonly apiService: APIservice, private readonly modalController: ModalController, private readonly loadingService: LoadingService) { }

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
    this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': err.message || JSON.stringify(err), 'btn_text': 'Ok', 'btn_cls': 'danger' }
    this.showAlertMdl = true
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
    if (res['status']) {
     this.productData = res['data'] || []
    } else {
     this.productData = []
     this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': res['msg'] || JSON.stringify(res), 'btn_text': 'Ok', 'btn_cls': 'danger' }
     this.showAlertMdl = true
    }
   }, error: err => {
    this.productData = []
    this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': err.message || JSON.stringify(err), 'btn_text': 'Ok', 'btn_cls': 'danger' }
    this.showAlertMdl = true
   }, complete: () => {
    if (this.productData.length > 0) {
     this.getUserCartData()
    } else {
     this.isLoading = false
    }
   }
  })
 }
 getUserCartData() {
  const user_id = DBManagerService.getData(Constants.USER_DATA_KEY)['user_id'];
  const params = { user_id: user_id, res_id: this.resData['_id'], cat_id: this.selectedCatID }
  this.apiService.getUserCartData(params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.modifyProductsData(res['data'])
    }
   }, error: err => {
    this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': err.message || JSON.stringify(err), 'btn_text': 'Ok', 'btn_cls': 'danger' }
    this.showAlertMdl = true
   }, complete: () => {
    this.isLoading = false
   }
  })
 }
 modifyProductsData(data: any[]) {
  this.productData.map((item: any) => {
   const index = data.findIndex((ele: any) => ele['res_id'] == item['res_id'] && ele['product_id'] == item['product_id'])
   if (index != - 1) {
    item['product_qty'] = data[index]['product_qty'];
   } else {
    item['product_qty'] = 1;
   }
  })
 }
 async postCartData(item: any) {
  const user_id = DBManagerService.getData(Constants.USER_DATA_KEY)['user_id'];
  const params = { user_id: user_id, res_id: item['res_id'], cat_id: item['cat_id'], product_id: item['product_id'], product_qty: item['product_qty'], status: 1 };
  await this.loadingService.showLoading()
  this.apiService.postCartData(params).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.alertMdlData = { 'title': '', 'img': 'success.png', 'msg': res['msg'] || 'Item Added to Cart', 'btn_text': 'Ok', 'btn_cls': 'success' }
     this.showAlertMdl = true
    } else {
     this.getUserCartData()
     this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': res['msg'] || JSON.stringify(res), 'btn_text': 'Ok', 'btn_cls': 'danger' }
     this.showAlertMdl = true
    }
   }, error: err => {
    this.getUserCartData()
    this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': err.message || JSON.stringify(err), 'btn_text': 'Ok', 'btn_cls': 'danger' }
    this.showAlertMdl = true
   }, complete: async () => {
    await this.loadingService.hideLoading()
   }
  })
 }
 onChangeCategory(id: any) {
  this.selectedCatID = id
  this.productData = []
  this.getProduct()
 }
 onSearchChange(event: any) {
  let searchValue = event.target.value.toLowerCase()
  if (searchValue.length >= 3) {
   this.searchData = this.productData.filter((m: any) => m.product_name.toLowerCase().includes(searchValue)) || [];
   this.searchFlag = true
  } else {
   this.searchData = []
   this.searchFlag = false
  }
 }
 eventHandler(event: any, i: number) {
  if (event['product_qty'] > 0 && event['product_qty'] <= 5) {
   event['product_qty'] = event['product_qty'] + i;
   event['product_qty'] = event['product_qty'] == 0 ? 1 : (event['product_qty'] == 6 ? 5 : event['product_qty']);
  }
 }
 viewDetails(event: any) {
  this.productDetails = event;
  this.isViewDetails = true;
  this.imageRotater();

 }
 async imageRotater() {
  if (!Array.isArray(this.productDetails['images']) || this.productDetails['images'].length === 0) {
   console.log("No images to rotate");
   return;
  }
  for (let i = 0; i < this.productDetails['images'].length; i++) {
   this.productDetails['product_img'] = this.productDetails['images'][i]['image'];
   await new Promise(resolve => setTimeout(resolve, 2000));
  }
 }
 dismissProductModal() {
  this.isViewDetails = false;
 }
 dismissAlertModal() {
  this.alertMdlData = {}
  this.showAlertMdl = false
 }
 closeModal() {
  this.modalController.dismiss();
 }
 handleRefresh(event: any) {
  this.categoryData = []
  this.productData = []
  this.isLoading = true
  this.getCategory()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
