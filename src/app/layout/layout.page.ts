import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';
import { APIservice } from '../utils/api.service';
import { AlertService } from '../utils/alert.service';
import { SocketService } from '../utils/socket-io.service';

@Component({
 selector: 'app-layout',
 templateUrl: './layout.page.html',
 styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
 cartCount: number = 0
 userData: any = {}
 curPage: string = ''
 constructor(private readonly router: Router, private readonly apiService: APIservice, private readonly socketService: SocketService) { }

 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  if (this.userData) {
   await this.socketService.createConnection(this.userData['user_id'])
   await this.getCartCount()
   Constants.cartCountSubject.subscribe(() => {
    this.getCartCount()
   })
   this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
     this.curPage = event.urlAfterRedirects.split('/').pop() || '';
    }
   });
   const pageArr = this.router.url.split('/')
   this.curPage = pageArr[pageArr.length - 1]
   if (this.curPage == 'layout') {
    this.router.navigate(['/layout/home'])
   }
  } else {
   this.router.navigate(['/login'])
  }
 }
 isActive(page: string): boolean {
  return this.curPage === page;
 }
 onNavigatePage(page: string) {
  this.router.navigate(['layout/' + page])
 }
 getCartCount() {
  const user_id = this.userData['user_id']
  this.apiService.getCartCount({ user_id }).subscribe({
   next: (res: any) => {
    if (res['status']) {
     this.cartCount = res['count']
    } else {
     AlertService.showAlert('Alert', res['msg'] || JSON.stringify(res))
    }
   },
   error: (error) => {
    AlertService.showAlert('Alert', error?.error['msg'] || JSON.stringify(error))
   }
  })
 }
}
