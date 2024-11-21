import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIservice } from 'src/app/utils/api.service';

@Component({
  selector: 'app-res-details',
  templateUrl: './res-details.page.html',
  styleUrls: ['./res-details.page.scss'],
})
export class ResDetailsPage implements OnInit {
  skeleton_data: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  isCatLoading: boolean = true
  isLoading: boolean = true
  resData: any = []
  categoryData: any = []
  productData: any = []
  selectedCatID: any = ''
  constructor(private readonly apiService: APIservice, private modalController: ModalController) { }

  ngOnInit() {
    this.getCategory();
  }
  getCategory() {
    this.isCatLoading = true
    this.apiService.getResCategories(this.resData['_id']).subscribe({
      next: (res: any) => {
        if (res['status']) {
          this.categoryData = res['data'] || [];
          if (this.categoryData.length > 0) {
            this.selectedCatID = this.categoryData[0]['cat_id']
          }
        }
      }, error: err => {
      }, complete: () => {
        this.isCatLoading = false
        if (this.categoryData.length > 0) {
          this.getProduct()
        } else {
          this.isLoading = false
        }
      }
    })
  }
  getProduct() {
    this.isLoading = true
    const params = { res_id: this.resData['_id'], cat_id: this.selectedCatID }
    this.apiService.getResProducts(params).subscribe({
      next: (res: any) => {
        this.isLoading = false
        console.log(res)
        this.productData = res['data'];
      }, error: err => {
        this.isLoading = false
      }
    })
  }

  onChangeCategory(id: any) {
    this.selectedCatID = id
    this.productData=[]
    this.getProduct()
  }
  onSearchChange(event: any) {

  }

  closeModal() {
    this.modalController.dismiss();
  }
  // afs
  handleRefresh(event: any) {
    this.categoryData = []
    this.productData = []
    this.isLoading = true
    this.getCategory()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


}
