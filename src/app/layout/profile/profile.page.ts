import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-profile',
 templateUrl: './profile.page.html',
 styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 isLoading: boolean = false;
 userData: any = {};
 editFlag: boolean = false;
 editParams: any = {};
 imageModal: boolean = false
 selectedFileUrl: any = null;
 selectedFile: any;
 constructor(private readonly apiService: APIservice, private readonly router: Router, private readonly loadingService: LoadingService) { }

 ngOnInit() {
  this.userData = DBManagerService.getData(Constants.USER_DATA_KEY)
  console.log(this.userData);
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
  this.editParams['user_id'] = this.userData['user_id'];
  this.editParams['fname'] = this.userData['fname'];
  this.editParams['lname'] = this.userData['lname'];
  this.editParams['email'] = this.userData['email'];
  this.editParams['mobile'] = this.userData['mobile'];
  this.editFlag = true;
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
 onLogout() {
  localStorage.clear()
  this.router.navigate(['/login'])
 }

 async updateProfile() {
  console.log(this.editParams);

  if (this.editParams['fname'].length < 4) {
   AlertService.showAlert('Alert', 'First Name should be at least 4 characters long')
   return;
  }
  if (this.editParams['lname'].length < 4) {
   AlertService.showAlert('Alert', 'Last Name should be at least 4 characters long')
   return;
  }
  if (!Constants.REGEXP_NUMERIC.test(this.editParams['mobile'])) {
   AlertService.showAlert('Alert', 'Enter valid mobile number')
   return;
  }
  if (this.editParams['mobile'].length != 10) {
   AlertService.showAlert('Alert', 'Mobile Number must be 10 digits long')
   return;
  }
  if (this.editParams['email'].length == 0 || !Constants.REGEXP_EMAIL.test(this.editParams['email'])) {
   AlertService.showAlert('Alert', 'Enter valid email address')
   return;
  }
  await this.loadingService.showLoading()
  this.apiService.updateUser(this.editParams).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.getUserInfo()
     AlertService.showAlert('Success', res['msg'])
     this.onCancel()
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert('Error', err.message || JSON.stringify(err))
   }, complete: async () => {
    await this.loadingService.hideLoading()
   }
  })
 }
 async updateUserProfile() {
  if (!this.selectedFile) {
   AlertService.showAlert('Alert', 'Select a profile picture')
   return;
  }
  const user_id = this.userData['user_id']
  const formData = new FormData();
  formData.append('user_profile', this.selectedFile);
  formData.append('user_id', user_id)

  await this.loadingService.showLoading()
  this.apiService.postUserProfile(formData).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.getUserInfo()
     AlertService.showAlert('Success', res['msg'])
     this.onClear()
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert('Error', err.message || JSON.stringify(err))
   }, complete: async () => {
    await this.loadingService.hideLoading()
   }
  })
 }
 deleteUserProfile() {
  AlertService.showConfirmAlert('Alert', 'Do you want to delete your profile picture?', 'Ok', async (num: number) => {
   if (num == 1) {
    await this.loadingService.showLoading()
    const user_id = this.userData['user_id']
    this.apiService.deleteUserProfile({ user_id: user_id }).subscribe({
     next: (res: any) => {
      if (res['status']) {
       this.getUserInfo()
       AlertService.showAlert('Success', res['msg'])
      } else {
       AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
      }
     }, error: err => {
      AlertService.showAlert('Error', err.message || JSON.stringify(err))
     },
     complete: async () => {
      await this.loadingService.hideLoading()
     }
    })
   }
  })
 }
 getUserInfo() {
  const user_id = this.userData['user_id']
  this.apiService.getUsers({ user_id: user_id }).subscribe({
   next: (res: any) => {
    if (res['status']) {
     DBManagerService.setData(res['data'][0], Constants.USER_DATA_KEY)
     this.userData = DBManagerService.getData(Constants.USER_DATA_KEY)
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert('Error', err.message || JSON.stringify(err))
   }
  })
 }

 handleRefresh(event: any) {
  this.getUserInfo()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
