import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';
import { ResDetailsPage } from '../res-details/res-details.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { Constants } from 'src/app/utils/constants.service';
import { SocketService } from 'src/app/utils/socket-io.service';

@Component({
 selector: 'app-home',
 templateUrl: 'home.page.html',
 styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 userData: any = {}
 skeleton_data: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 isLoading: boolean = true
 showAlertMdl: boolean = false;
 alertMdlData: any = {}
 restaurantsData: any = []
 backUpdata: any = []
 curWeatherImg: string = ''
 fallbackResImg:any = Constants.FALLBACK_RESTAURANT_LOGO
 constructor(private readonly apiService: APIservice, private readonly modalController: ModalController, private readonly socketService: SocketService) { }
 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.getCurrentWeatherImg()
  this.getRestaurantsData()
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

 getRestaurantsData() {
  this.isLoading = true
  this.apiService.getRestaurants().subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     this.restaurantsData = res['data']
     this.backUpdata = res['data']
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
 async openRestaurantModal(item: any) {
  const modal = await this.modalController.create({
   component: ResDetailsPage,
   componentProps: { resData: item }
  })
  modal.present()
 }
 searchQuery: string = '';
 onSearchChange(event: any) {
  let text = event['detail']['value'].toLowerCase();
  if (text.length > 3) {
   this.restaurantsData = this.backUpdata.filter((item: any) => item['restaurant_name'].toLowerCase().includes(text))
  }
  else {
   this.restaurantsData = this.backUpdata;
  }
 }
 dismissAlertModal() {
  this.showAlertMdl = false;
  this.alertMdlData = {}
 }
 async handleRefresh(event: any) {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.restaurantsData = []
  this.isLoading = true
  this.getCurrentWeatherImg()
  this.getRestaurantsData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
