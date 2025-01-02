import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Register the service worker first, before bootstrapping the module
// if ('serviceWorker' in navigator) {
//  navigator.serviceWorker.register('/firebase-messaging-sw.js')
//   .then(function (registration) {
//    console.log('Service Worker registered with scope: ', registration.scope);
//   })
//   .catch(function (error) {
//    console.log('Service Worker registration failed: ', error);
//   });
// }

// Then bootstrap the Angular app
platformBrowserDynamic().bootstrapModule(AppModule)
 .catch(err => console.log(err));
