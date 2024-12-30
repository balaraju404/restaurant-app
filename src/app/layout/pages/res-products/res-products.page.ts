import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-res-products',
 templateUrl: './res-products.page.html',
 styleUrls: ['./res-products.page.scss'],
})
export class ResProductsPage implements OnInit {
 resData: any = {}
 resCatData: any = []
 productsData: any = []
 alert_mdl!: AlertModel;
 selectedCatId: any = ''
 isIntialPageLoad: boolean = true
 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }
 async ngOnInit() {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.getResCategoriesData()
 }
 async getResCategoriesData() {
  await this.loadingService.showLoading();
  const res_id = this.resData['res_id'];
  this.apiService.getResCategories({ res_id }).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.resCatData = res['data'];
     if (this.resCatData.length > 0 && this.isIntialPageLoad) {
      this.selectedCatId = this.resCatData[0]['cat_id'];
      this.isIntialPageLoad = false;
     }
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res));
    }
   },
   error: (err) => {
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err));
   },
   complete: async () => {
    await this.loadingService.hideLoading();
    if (this.resCatData.length > 0) {
     await this.getResProducts();
    }
   }
  });
 }
 async getResProducts() {
  const res_id = this.resData['res_id']
  const params = { res_id: res_id, cat_id: this.selectedCatId }
  await this.loadingService.showLoading()
  this.apiService.getResProducts(params).subscribe({
   next: async (res: any) => {
    await this.loadingService.hideLoading()
    if (res['status']) {
     this.productsData = res['data']
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async (err) => {
    await this.loadingService.hideLoading()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 onClickCategory(cat_id: any) {
  this.selectedCatId = cat_id
  this.getResProducts()
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
