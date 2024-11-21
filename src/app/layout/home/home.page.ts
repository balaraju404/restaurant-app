import { Component, OnInit } from '@angular/core';
import { APIservice } from 'src/app/utils/api.service';

@Component({
 selector: 'app-home',
 templateUrl: 'home.page.html',
 styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 isLoading: boolean = false
 showAlertMdl: boolean = false;
 alertMdlData: any = {}
 restaurantsData: any = []
 constructor(private readonly apiService: APIservice) { }
 ngOnInit() {
  console.log('ngOnInit');
  this.getRestaurantsData()
 }
 getRestaurantsData() {
  this.apiService.getRestaurants().subscribe({
   next: (res: any) => {
    console.log(res);
    if (res['status']) {
     this.restaurantsData = res['data']
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
}
