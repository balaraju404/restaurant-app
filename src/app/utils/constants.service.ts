import { Injectable } from "@angular/core";
import { DBManagerService } from "./db-manager.service";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";

@Injectable({
 providedIn: 'root',
})
export class Constants {

 // static NODE_URL = environment.NODE_URL
//  static readonly NODE_URL = 'http://localhost:3099/' //'https://13.51.59.98/' // 'https://restaurant-node-mongo.vercel.app/'
 static readonly NODE_URL = 'https://restaurant-node-mongo.vercel.app/'
//   static readonly NODE_URL = 'https://13.51.59.98/'
 static readonly API_URL = Constants.NODE_URL + 'api/'
 static readonly USER_DATA_KEY = 'login_user_data'
 static readonly RES_USER_SELECTED_KEY = 'restaurant_user_selected_data'
 static readonly APP_ICON = 'assets/images/app-icon.png'
 static readonly FALLBACK_RESTAURANT_LOGO = 'assets/images/restaurant.png'

 static async isRestaurantUsers() {
  const userData: any = await DBManagerService.getData(Constants.USER_DATA_KEY)
  const role_id = userData?.['role_id'] || 0
  return role_id == 2 || role_id == 4
 }
 static async isAdmin() {
  const userData: any = await DBManagerService.getData(Constants.USER_DATA_KEY)
  const role_id = userData?.['role_id'] || 0
  return role_id == 1
 }
 static async isUser() {
  const userData: any = await DBManagerService.getData(Constants.USER_DATA_KEY)
  const role_id = userData?.['role_id'] || 0
  return role_id == 3
 }
 static notificationCountSubject = new Subject()
 static cartCountSubject = new Subject()
 static resCartCountSubject = new Subject()

 static readonly REGEXP_NUMERIC = /^[0-9\s]*$/
 static readonly REGEXP_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}
