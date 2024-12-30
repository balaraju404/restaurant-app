import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel, AlertType } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-restaurant-profile',
 templateUrl: './restaurant-profile.page.html',
 styleUrls: ['./restaurant-profile.page.scss'],
})
export class RestaurantProfilePage implements OnInit {
 isLoading: boolean = false;
 resData: any = {}
 alert_mdl!: AlertModel;
 editFlag: boolean = false;
 editParams: any = {};
 imageModal: boolean = false
 selectedFileUrl: any = null;
 selectedFile: any;
 fallbackResImg: string = Constants.FALLBACK_RESTAURANT_LOGO
 resStatusList: any = [
  { id: 0, name: 'Inactive', color: 'danger', icon: 'close-circle-outline' },
  { id: 1, name: 'Active', color: 'success', icon: 'checkmark-circle-outline' },
  { id: 2, name: 'Pending', color: 'warning', icon: 'time-outline' },
  { id: 3, name: 'Rejected', color: 'danger', icon: 'alert-circle-outline' },
 ];
 openStatusList: any = [
  { id: 0, name: 'Closed', color: 'danger', icon: 'close-circle-outline' },
  { id: 1, name: 'Open', color: 'success', icon: 'checkmark-circle-outline' },
 ];

 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }

 async ngOnInit() {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
 }
 getRestaurantData() {
  const res_id = this.resData['res_id']
  this.apiService.getRestaurant(res_id).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     this.resData = res['data']
     await DBManagerService.setData(res['data'], Constants.RES_USER_SELECTED_KEY)
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 async updateResLogo() {
  if (!this.selectedFile) {
   const msgText = 'Please select a profile picture'
   AlertService.showAlert('Alert', msgText)
   return;
  }
  const res_id = this.resData['res_id']
  const formData = new FormData();
  formData.append('res_logo', this.selectedFile);
  formData.append('res_id', res_id)

  await this.loadingService.showLoading()
  this.apiService.updateRestaurant(formData).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     await this.loadingService.hideLoading()
     this.getRestaurantData()
     this.onClear()
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    AlertService.showAlert('Error', JSON.stringify(err['error'] || err))

   }, complete: async () => {
   }
  })
 }
 async updateProfile() {
  let msgText = ''
  if (this.editParams['restaurant_name'].length < 3) {
   msgText = 'Restaurant name should be at least 4 characters long'
  }
  if (msgText.length > 0) {
   this.alert_mdl = new AlertModel(AlertType.Warning, '', msgText)
   return
  }
  await this.loadingService.showLoading()
  this.apiService.updateRestaurant(this.editParams).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.getRestaurantData()
     this.alert_mdl = new AlertModel(AlertType.Success, '', res['msg'])
     this.onCancel()
    } else {
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }, complete: async () => {
    await this.loadingService.hideLoading()
   }
  })
 }
 onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files?.[0]) {
   this.selectedFile = input.files[0];
   const reader = new FileReader();
   reader.onload = (e) => {
    this.selectedFileUrl = e.target?.result;
   };
   reader.readAsDataURL(this.selectedFile);
  }
 }
 triggerFileInput() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
 }
 onEditImage() {
  this.imageModal = true;
 }
 onEditProfile() {
  this.editParams['res_id'] = this.resData['res_id'];
  this.editParams['restaurant_name'] = this.resData['restaurant_name'];
  this.editParams['description'] = this.resData['descrption'];
  this.editFlag = true;
 }
 async onToggleOpenStatus(event: any) {
  const is_open = event['detail']['checked'] ? 1 : 0
  this.resData['is_open'] = is_open
  const params = { res_id: this.resData['res_id'], is_open: is_open }
  await this.loadingService.showLoading()
  this.apiService.updateRestaurant(params).subscribe({
   next: async (res: any) => {
    if (res['status']) {
     await this.loadingService.hideLoading()
     let msg = is_open ? 'Restaurant is now open' : 'Restaurant is now closed'
     this.alert_mdl = new AlertModel(AlertType.Success, '', msg)
    } else {
     this.getRestaurantData()
     AlertService.showAlert("Error", res['msg'] || JSON.stringify(res))
    }
   }, error: async err => {
    await this.loadingService.hideLoading()
    this.getRestaurantData()
    AlertService.showAlert("Error", JSON.stringify(err['error'] || err))
   }
  })
 }
 onCancel() {
  this.editParams = {};
  this.editFlag = false
 }
 closeModal() {
  this.imageModal = false;
  this.onClear()
 }
 onClear() {
  this.selectedFile = null
  this.selectedFileUrl = null
  this.imageModal = false
 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  this.getRestaurantData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
