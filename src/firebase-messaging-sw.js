importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

// Initialize Firebase in the Service Worker
const firebaseConfig = {
 apiKey: "AIzaSyDnQfgicHpxVd-gs90t5KmuU06ZklMxyEA",
 authDomain: "gbr-food-app.firebaseapp.com",
 projectId: "gbr-food-app",
 storageBucket: "gbr-food-app.firebasestorage.app",
 messagingSenderId: "845415131742",
 appId: "1:845415131742:web:bf85887517cf9d0b9c22cf",
 measurementId: "G-RB1BBQ658N",
 databaseURL: "https://gbr-food-app.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
 console.log("Received background message ", payload);
 const notificationTitle = payload.notification.title;
 const notificationOptions = {
  body: payload.notification.body,
  icon: '/firebase-logo.png',
 };

 self.registration.showNotification(notificationTitle, notificationOptions);
});
