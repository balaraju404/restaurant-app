import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "./constants.service";

@Injectable({
 providedIn: 'root',
})

export class APIservice {
 private readonly apiUrl = Constants.API_URL;

 constructor(private readonly http: HttpClient) { }

 loginCheck(loginName: string, loginPassword: string) {
  const params = { 'login_name': loginName, 'login_password': loginPassword };
  return this.http.post(this.apiUrl + 'login/check', params);
 }
 userCreate(userName: string, loginName: string, loginPassword: string, roleId: number) {
  const params = { 'user_name': userName, 'login_name': loginName, 'password': loginPassword, 'role_id': roleId };
  return this.http.post(this.apiUrl + 'user/create', params);
 }
 updateUser(params: any) {
  return this.http.put(this.apiUrl + 'user/update', params);
 }
 postUserProfile(params: any) {
  return this.http.post(this.apiUrl + 'user/user_profile', params);
 }
 deleteUserProfile(params: any) {
  return this.http.post(this.apiUrl + 'user/delete_user_profile', params);
 }
 getUsers(params: any = {}) {
  return this.http.post(this.apiUrl + 'user/getUsers', params);
 }

 // dashboard
 getRestaurantDashboardCount(params: any) {
  return this.http.post(this.apiUrl + 'dashboard/resOrdersCount', params);
 }
 getCartCount(params: any) {
  return this.http.post(this.apiUrl + 'dashboard/userCartCount', params)
 }

 // restaurant
 getRestaurant(res_id: any) {
  return this.http.post(this.apiUrl + 'restaurant/' + res_id, {});
 }
 getRestaurants(params = {}) {
  return this.http.post(this.apiUrl + 'restaurant/getAll', params);
 }
 restaurantCreate(res_name: string, files: any, description: string, user_id: any = '', role_id: any = 0) {
  const formData = new FormData;
  formData.append('restaurant_name', res_name)
  formData.append('res_logo', files)
  formData.append('description', description)
  formData.append('user_id', user_id)
  formData.append('role_id', role_id)
  return this.http.post(this.apiUrl + 'restaurant/create', formData);
 }
 updateRestaurant(params: any) {
  return this.http.put(this.apiUrl + 'restaurant/update', params);
 }
 assignuserToRestaurant(res_id: any, user_id: any, role_id: any) {
  const params = { res_id: res_id, user_id: user_id, role_id: role_id }
  return this.http.post(this.apiUrl + 'assign_restaurant_users/add', params);
 }
 getUserRestaurants(user_id: any) {
  const params = { 'user_id': user_id };
  return this.http.post(this.apiUrl + 'assign_restaurant_users/details', params)
 }
 getCategories() {
  return this.http.post(this.apiUrl + 'categories/details', {})
 }
 createCategory(cat_name: string, cat_img: any, description: string) {
  const formData = new FormData;
  formData.append('cat_name', cat_name)
  formData.append('cat_img', cat_img)
  formData.append('description', description)
  return this.http.post(this.apiUrl + 'categories/add', formData);
 }
 assignCategotyToRes(res_id: any, cat_id: any) {
  const params = { res_id: res_id, cat_id: cat_id }
  return this.http.post(this.apiUrl + 'res_categories/add', params);
 }
 getResCategories(res_id: any) {
  const params = { res_id: res_id };
  return this.http.post(this.apiUrl + 'res_categories/details', params);
 }
 getResProducts(data: any) {
  let params: any = {};
  if (data.hasOwnProperty('res_id')) {
   params['res_id'] = data['res_id'];
  }
  if (data.hasOwnProperty('cat_id')) {
   params['cat_id'] = data['cat_id'];
  }
  return this.http.post(this.apiUrl + 'products/details', params)
 }
 createResProduct(res_id: string, cat_id: any, product_name: string, images: any, price: any, description: string) {
  const formData = new FormData;
  formData.append('res_id', res_id)
  formData.append('cat_id', cat_id)
  formData.append('product_name', product_name)
  images.forEach((file: any) => {
   formData.append('images', file);
  });
  // formData.append('images', images)
  formData.append('price', price)
  formData.append('description', description)
  return this.http.post(this.apiUrl + 'products/add', formData);
 }
 getUserCartData(params: any) {
  return this.http.post(this.apiUrl + 'cart/details', params)
 }
 postCartData(params: any) {
  return this.http.post(this.apiUrl + 'cart/add', params)
 }
 updateCartData(params: any) {
  return this.http.put(this.apiUrl + 'cart/update', params)
 }
 deleteCartItem(cart_id: any) {
  return this.http.delete(this.apiUrl + 'cart/delete/' + cart_id)
 }
 sendOrderRequest(params: any) {
  return this.http.post(this.apiUrl + 'order/add', params)
 }
 getResOrders(params: any) {
  return this.http.post(this.apiUrl + 'order/details', params).pipe()
 }
 handleOrder(params: any) {
  return this.http.put(this.apiUrl + 'order/update', params)
 }
}