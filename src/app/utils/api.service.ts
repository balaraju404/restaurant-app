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
 getUsers() {
  return this.http.post(this.apiUrl + 'user/getUsers', {});
 }
}