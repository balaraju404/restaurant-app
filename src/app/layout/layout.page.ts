import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBManagerService } from '../utils/db-manager.service';
import { Constants } from '../utils/constants.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit() {
    const userData = DBManagerService.getData(Constants.USER_DATA_KEY)
    if (userData) {
      const pageArr = this.router.url.split('/')
      const page = pageArr[pageArr.length - 1]
      if (page == 'layout') {
        this.router.navigate(['/layout/home'])
      }
    } else {
      this.router.navigate(['/login'])
    }
  }
  onNavigatePage(page: string) {
    this.router.navigate(['layout/' + page])
  }
}
