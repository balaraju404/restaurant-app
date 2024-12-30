import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel, AlertType } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-add-categories',
 templateUrl: './add-categories.page.html',
 styleUrls: ['./add-categories.page.scss'],
})
export class AddCategoriesPage implements OnInit {
 resData: any = {}
 catData: any = []
 searchText: string = ''
 selectedCatIds: any = []
 alert_mdl!: AlertModel;
 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }

 async ngOnInit() {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.getCategoriesData()
 }

 async getCategoriesData() {
  await this.loadingService.showLoading()
  const res_id = this.resData['res_id']
  this.apiService.getCategories({ res_id, search_text: this.searchText }).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     await this.loadingService.hideLoading()
     this.catData = res['data']
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 async addResCategories() {
  const res_id = this.resData['res_id']
  this.apiService.assignCategotyToRes(res_id, this.selectedCatIds).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     await this.loadingService.hideLoading()
     this.getCategoriesData()
     this.alert_mdl = new AlertModel(AlertType.Success, '', res['msg'])
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 onSearch() {
  this.getCategoriesData()
 }
 onCheckId(id: any) {
  if (this.selectedCatIds.includes(id)) {
   this.selectedCatIds = this.selectedCatIds.filter((item: any) => item !== id)
  } else {
   this.selectedCatIds.push(id)
  }
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  this.getCategoriesData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
