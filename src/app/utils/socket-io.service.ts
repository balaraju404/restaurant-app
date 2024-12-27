import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { Constants } from './constants.service';

const SOCKET_URL = Constants.NODE_URL
@Injectable({
 providedIn: 'root'
})
export class SocketService {
 private socket: Socket;
 private orderSubject = new BehaviorSubject<any>(null);

 constructor() {
  this.socket = io(SOCKET_URL);
  console.log(this.socket);

  this.socket.on('orderData', (data: any) => {
   console.log('Received order data:', data);
   this.orderSubject.next(data);
  });
 }

 sendOrderData(orderData: any) {
  this.socket.emit('orderData', orderData);
 }

 getOrderUpdates() {
  return this.orderSubject.asObservable();
 }
}