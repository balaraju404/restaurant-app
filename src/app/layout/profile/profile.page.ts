import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/utils/alert.service';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';

@Component({
 selector: 'app-profile',
 templateUrl: './profile.page.html',
 styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 userData: any = {}
 imageModal: boolean = false
 selectedFileUrl: any = null;
 selectedFile: any;
 constructor(private readonly apiService: APIservice) { }

 ngOnInit() {
  this.userData = DBManagerService.getData(Constants.USER_DATA_KEY)
  console.log(this.userData);
 }

 onInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
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

 updateUserProfile() {
  if (!this.selectedFile) {
   AlertService.showAlert('Alert', 'Select a profile picture')
   return;
  }
  const user_id = this.userData['user_id']
  const formData = new FormData();
  formData.append('user_profile', this.selectedFile);
  formData.append('user_id', user_id)

  this.apiService.postUserProfile(formData).subscribe({
   next: (res: any) => {
    console.log(res);
    if (res['status']) {
     this.getUserInfo()
     AlertService.showAlert('Success', res['msg'])
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    console.log(err);
    AlertService.showAlert('Error', err.message || JSON.stringify(err))
   }
  })
 }
 getUserInfo() {
  const user_id = this.userData['user_id']
  this.apiService.getUsers({ user_id: user_id }).subscribe({
   next: (res: any) => {
    console.log(res);
    if (res['status']) {
     DBManagerService.setData(res['data'][0], Constants.USER_DATA_KEY)
     this.userData = DBManagerService.getData(Constants.USER_DATA_KEY)
     this.onClear()
    } else {
     AlertService.showAlert('Error', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    console.log(err);
    AlertService.showAlert('Error', err.message || JSON.stringify(err))
   }
  })
 }
 onEditImage() {
  this.imageModal = true;
 }
 closeModal() {
  this.imageModal = false;
 }
 onClear() {
  this.selectedFile = null
  this.selectedFileUrl = null
  this.imageModal = false
 }
  onLogout(){
    localStorage.clear()
  }
}
