import { Injectable } from "@angular/core";

@Injectable({
 providedIn: 'root',
})
export class DBManagerService {

 constructor() { }

 static setData(data: any, key: string) {
  localStorage.setItem(key, JSON.stringify(data))
 }
 static getData(key: string) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
 }
 static removeData(key: string) {
  localStorage.removeItem(key)
 }
}