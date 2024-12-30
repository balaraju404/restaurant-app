import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel, AlertType } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-create-products',
 templateUrl: './create-products.page.html',
 styleUrls: ['./create-products.page.scss'],
})
export class CreateProductsPage implements OnInit {
 resData: any = {}
 resCatData: any = []
 alert_mdl!: AlertModel;
 showSelectCatModal: boolean = false
 searchText: string = ''
 selectedCatObj: any = {}
 postParams: any = {}
 selectedFile: any = []
 selectedFiles: any = []
 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }

 async ngOnInit() {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.getResCategoriesData()
 }
 async getResCategoriesData() {
  await this.loadingService.showLoading()
  const res_id = this.resData['res_id']
  const params = { res_id, search_text: this.searchText }
  this.apiService.getResCategories(params).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     await this.loadingService.hideLoading()
     this.resCatData = res['data']
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 createProduct() {
  const res_id = this.resData['res_id']
  const cat_id = this.selectedCatObj['cat_id'] || ''
  const product_name = this.postParams['product_name'] || ''
  const price = this.postParams['price'] || 0
  const description = this.postParams['description'] || ''
  const images = [this.selectedFile[0], ...this.selectedFiles]
  let msg = ''
  if (product_name.length < 2) {
   msg = 'Product name should be at least 2 characters long.'
  } else if (!this.selectedFile) {
   msg = 'Please select at product image'
  } else if (price <= 0) {
   msg = 'Price should be greater than 0'
  } else if (cat_id.length < 1) {
   msg = 'Please select a category'
  }
  if (msg.length > 0) {
   this.alert_mdl = new AlertModel(AlertType.Error, '', msg)
   return
  }
  this.apiService.createResProduct(res_id, cat_id, product_name, images, price, description).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     this.alert_mdl = new AlertModel(AlertType.Success, '', res['msg'])
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files?.[0]) {
   this.selectedFile = input.files;
  }
 }

 onSelectMultipleInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files) {
   this.selectedFiles = input.files;
  }
 }

 onSearch() {
  this.searchText = this.searchText.trim()
  this.getResCategoriesData()
 }
 onCheckCategory(item: any) {
  this.selectedCatObj = item
  this.showSelectCatModal = false
 }
 onClear() {
  this.selectedCatObj = {}
  this.showSelectCatModal = false
  this.selectedFile = []
  this.selectedFiles = []
  this.postParams = {}
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  this.getResCategoriesData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
