import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { AlertService } from "src/app/utils/alert.service";
import { APIservice } from "src/app/utils/api.service";
import { Constants } from "src/app/utils/constants.service";
import { DBManagerService } from "src/app/utils/db-manager.service";

@Component({
 selector: 'app-create-restaurant',
 templateUrl: './create-restaurant.page.html',
 styleUrl: './create-restaurant.page.scss'
})
export class CreateRestaurantPage implements OnInit {
 userData: any = {}
 restaurant = { res_name: '', description: '', };
 file: File | null = null;
 constructor(private readonly router: Router,
  private readonly modalController: ModalController,
  private readonly apiService: APIservice) { }
 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
 }
 onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
   if (file.type.startsWith('image/')) {
    this.file = file;
   } else {
    AlertService.showAlert('Error','Please select an image file.');
    this.file = null;
    event.target.value = ''
   }
  }
 }
 createRestaurant() {
  const { res_name, description } = this.restaurant;
  const user_id = this.userData.user_id;
  this.apiService.restaurantCreate(res_name, this.file, description, user_id, 2).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.dismiss()
     AlertService.showAlert('Alert', res['msg'])
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   }, error: err => {
    AlertService.showAlert("Error", JSON.stringify(err['error']?.['errors'] || err))
   }
  })
 }
 dismiss() {
  this.modalController.dismiss();
 }
}