import { Injectable } from "@angular/core";
import { DBManagerService } from "./db-manager.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class Constants {

  // static NODE_URL = environment.NODE_URL
  static NODE_URL = 'https://restaurant-node-mongo.vercel.app/'
  static API_URL = Constants.NODE_URL + 'api/'
  static USER_DATA_KEY = 'login_user_data'
  static RES_USER_SELECTED_KEY = 'restaurant_user_selected_data'

  static isRestaurantUsers() {
    const role_id = DBManagerService.getData(Constants.USER_DATA_KEY)['role_id']
    return role_id == 2 || role_id == 4
  }
}