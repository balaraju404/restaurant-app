import { Component, OnInit } from '@angular/core';
import { APIservice } from '../utils/api.service';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-login',
 templateUrl: './login.page.html',
 styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 isLoading: boolean = false
 showAlertMdl: boolean = false;
 alertMdlData: any = {}
 loginName: string = ''
 loginPassword: string = ''

 constructor(private readonly apiService: APIservice, private readonly router: Router) { }
 async ngOnInit() {
  const userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  if (userData) {
   this.router.navigate(['/layout/home'])
  }
 }
 doLogin() {
  if (this.loginName.length < 5) {
   this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': 'Login name must be min 6 characters', 'btn_text': 'Ok', 'btn_cls': 'danger' }
   this.showAlertMdl = true
  } else if (this.loginPassword.length < 5) {
   this.alertMdlData = { 'title': '', 'img': 'danger.png', 'msg': 'Password must be min 6 characters', 'btn_text': 'Ok', 'btn_cls': 'danger' }
   this.showAlertMdl = true
  } else {
   this.checkUser()
  }
 }
 async checkUser() {
  this.isLoading = true
  const check = await this.apiService.loginCheck(this.loginName, this.loginPassword)
  check.subscribe({
   next: async (res: any) => {
    this.isLoading = false
    if (res['status']) {
     const data = JSON.parse(JSON.stringify(res['data']))
     await DBManagerService.setData(data, Constants.USER_DATA_KEY)
     if (data && data['role_id'] && data['role_id'] != 0) {
      if (data['role_id'] == 2) {
       this.router.navigate(['/select-restaurant'])
      } else if (data['role_id'] == 3) {
       await DBManagerService.setData(data['device_token_id'], Constants.LS_DEVICE_TOKEN_ID)
       this.router.navigate(['/layout/home'])
      }
     } else {
      this.router.navigate(['/select-role'])
     }
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
