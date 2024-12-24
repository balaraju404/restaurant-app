import { Component, Input, OnInit } from '@angular/core';

// Enum for alert types
export enum AlertType {
 Success = 'success',
 Error = 'error',
 Info = 'info',
 Warning = 'warning'
}

// Enum for alert position
export enum AlertPositionType {
 TopLeft = 'top-left',
 TopRight = 'top-right',
 BottomLeft = 'bottom-left',
 BottomRight = 'bottom-right',
 TopCenter = 'top-center',
 BottomCenter = 'bottom-center'
}

// Alert Model
export class AlertModel {
 public isShown: boolean = false;
 public fadeClass: string = 'fade-in';
 public status: AlertType = AlertType.Success;
 public title: string = '';
 public message: string = '';
 public position: AlertPositionType = AlertPositionType.TopCenter;
 public duration: number = 3000;
 public buttons: any[] = [];

 constructor(
  status: AlertType,
  title: string,
  message: string,
  position: AlertPositionType = AlertPositionType.TopCenter,
  duration: number = 3000
 ) {
  this.isShown = true;
  this.fadeClass = 'fade-in';
  this.status = status;
  this.title = title;
  this.message = message;
  this.position = position;
  this.duration = duration;
 }
}

@Component({
 selector: 'app-custom-alert',
 templateUrl: './custom-alert.page.html',
 styleUrls: ['./custom-alert.page.scss']
})
export class CustomAlertComponent implements OnInit {
 @Input() alert_model!: AlertModel;

 constructor() { }

 ngOnInit(): void {
  if (this.alert_model) {
   setTimeout(() => {
    this.closeModal();
   }, this.alert_model.duration || 3000);
  }
 }

 closeModal() {
  if (this.alert_model) {
   this.alert_model.fadeClass = 'fade-out';

   setTimeout(() => {
    this.alert_model.isShown = false;
    this.alert_model.fadeClass = '';
   }, 500);
  }
 }

 // Dynamically get the class based on the alert type
 getAlertClass() {
  switch (this.alert_model.status) {
   case AlertType.Success:
    return 'success';
   case AlertType.Error:
    return 'error';
   case AlertType.Info:
    return 'info';
   case AlertType.Warning:
    return 'warning';
   default:
    return '';
  }
 }

 // Dynamically return the appropriate icon based on alert type
 getAlertIcon() {
  switch (this.alert_model.status) {
   case AlertType.Success:
    return 'checkmark-circle';
   case AlertType.Error:
    return 'close-circle';
   case AlertType.Info:
    return 'information-circle';
   case AlertType.Warning:
    return 'warning';
   default:
    return 'help-circle';
  }
 }

 // Dynamically get the position class for the modal
 getAlertPositionClass() {
  return this.alert_model.position;
 }
}
