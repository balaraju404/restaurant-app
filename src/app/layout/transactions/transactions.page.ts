import { Component, OnInit } from '@angular/core';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { DBManagerService } from 'src/app/utils/db-manager.service';

@Component({
 selector: 'app-transactions',
 templateUrl: './transactions.page.html',
 styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
 isLoading: boolean = false
 orders_data: any[] = []
 userData: any = {}
 roleId: any;
 params: any = {}
 constructor(private readonly apiService: APIservice) { }
 async ngOnInit() {
  this.userData = await DBManagerService.getData(Constants.USER_DATA_KEY)
  this.roleId = this.userData['role_id']
  this.getOrdersData()
 }

 async getOrdersData() {
  if (this.roleId == 3) {
   this.params['user_id'] = this.userData['user_id']
  } else if (this.roleId == 2 || this.roleId == 4) {
   const resData: any = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)
   this.params['res_id'] = resData['res_id']
  }
  this.isLoading = true
  this.apiService.getResOrders(this.params).subscribe((res: any) => {
   this.isLoading = false
   if (res['status']) {
    this.orders_data = res['data']
   }
  }, error => {
   this.isLoading = false
   alert(JSON.stringify(error))
  })
 }
 handleOrder(params: any, status: boolean) {
  params['status'] = status
  this.isLoading = true
  this.apiService.handleOrder(params).subscribe((res: any) => {
   this.isLoading = false
   if (res['status']) {
    alert(res['msg'])
    this.getOrdersData()
   } else {
    alert(res['msg'] || JSON.parse(res))
   }
  }, error => {
   this.isLoading = false
   alert(JSON.stringify(error))
  })
 }
 handleRefresh(event: any) {
  this.getOrdersData()
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
