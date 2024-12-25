import { Component, OnInit } from '@angular/core';
import { AlertService } from '../utils/alert.service';
import { APIservice } from '../utils/api.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-signup',
 templateUrl: './signup.page.html',
 styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
 isLoading: boolean = false
 isdisplay: boolean = true;
 username: string = '';
 loginname: string = '';
 password: string = '';
 constructor(private readonly apiService: APIservice, private readonly router: Router) { }
 ngOnInit() {
  console.log('sign up');
 }
 submit() {
  if (this.username.length < 5)
   AlertService.showAlert('Alert', 'Username should atleast 6 letters');
  else if (this.loginname.length < 5)
   AlertService.showAlert('Alert', 'Loginname should atleast 6 letters');
  else if (this.password.length < 5)
   AlertService.showAlert('Alert', 'Password should atleast 6 characters');
  else {
   this.createUser()
  }
 }

 createUser() {
  this.isLoading = true
  this.apiService.userCreate(this.username, this.loginname, this.password, 3).subscribe({
   next: (res: any) => {
    this.isLoading = false
    if (res['status']) {
     AlertService.showAlert('Alert', res['msg'], 'Ok')
     this.router.navigate(['/login'])
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res), 'Ok')
    }
   }, error: err => {
    this.isLoading = false
    AlertService.showAlert('Alert', JSON.stringify(err), 'Ok')
   }
  })
 }
}
