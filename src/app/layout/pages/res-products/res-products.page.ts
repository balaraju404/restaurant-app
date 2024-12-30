import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';
import { Constants } from 'src/app/utils/constants.service';
import { AlertModel } from 'src/app/utils/custom-componets/alert-component/custom-alert.page';
import { DBManagerService } from 'src/app/utils/db-manager.service';
import { LoadingService } from 'src/app/utils/loading.service';

@Component({
 selector: 'app-res-products',
 templateUrl: './res-products.page.html',
 styleUrls: ['./res-products.page.scss'],
})
export class ResProductsPage implements OnInit {
 resData: any = {}
 resCatData: any = []
 alert_mdl!: AlertModel;

 constructor(private readonly apiService: APIservice,
  private readonly modalController: ModalController,
  private readonly loadingService: LoadingService,
 ) { }
 async ngOnInit() {
  this.resData = await DBManagerService.getData(Constants.RES_USER_SELECTED_KEY)

 }
 dismiss() {
  this.modalController.dismiss()
 }
 handleRefresh(event: any) {
  setTimeout(() => {
   event.target.complete();
  }, 2000);
 }
}
