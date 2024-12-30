import { Component, OnInit } from '@angular/core';
import { ViewWillEnter,ViewDidEnter } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';

@Component({
 selector: 'app-restaurant-home',
 templateUrl: './restaurant-home.page.html',
 styleUrls: ['./restaurant-home.page.scss'],
})
export class RestaurantHomePage implements OnInit {
 skeleton_data: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 resData: any = {}
 curWeatherImg: string = ''
 isLoading: boolean = true
 showAlertMdl: boolean = false;
 alertMdlData: any = {}
 dashboardCount: any = {}
 constructor(private readonly apiService: APIservice) { }

 ngOnInit() {
  console.log('oninit');
  
 }
 async ionViewDidEnter() {
  console.log('ionViewWillEnter');
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.getCurrentWeatherImg()
  this.getDashboardCount()
 }
 getCurrentWeatherImg() {
  const curHour = new Date().getHours();
  if (curHour >= 6 && curHour < 12) {
   this.curWeatherImg = 'morning';
  } else if (curHour >= 12 && curHour < 16) {
   this.curWeatherImg = 'afternoon';
  } else if (curHour >= 16 && curHour <= 18) {
   this.curWeatherImg = 'evening';
  } else {
   this.curWeatherImg = 'night';
  }
 }
 getDashboardCount() {
  this.isLoading = true
  const params = { 'res_id': this.resData['res_id'] }
  this.apiService.getRestaurantDashboardCount(params).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     this.dashboardCount = res['data']
    } else {
     this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': res['msg'] || JSON.stringify(res), 'btn_text': 'Ok', 'btn_cls': 'danger' }
     this.showAlertMdl = true
    }
   }, error: err => {
    this.isLoading = false
    this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': err['error']?.['msg'] || err['message'] || JSON.stringify(err), 'btn_text': 'Ok', 'btn_cls': 'danger' }
    this.showAlertMdl = true
   }
  })
 }
 dismissAlertModal() {
  this.showAlertMdl = false;
  this.alertMdlData = {}
 }
 async handleRefresh(event: any) {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
  this.getCurrentWeatherImg()
  this.getDashboardCount()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
