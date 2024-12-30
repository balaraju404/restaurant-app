import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
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
  this.apiService.getResCategories(res_id).subscribe({
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
