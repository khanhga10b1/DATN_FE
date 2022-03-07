import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBNS9VuJ5-bg-866IZVgjlahlOkLols8u4",
  authDomain: "booking-image.firebaseapp.com",
  databaseURL: "https://booking-image-default-rtdb.firebaseio.com",
  projectId: "booking-image",
  storageBucket: "booking-image.appspot.com",
  messagingSenderId: "278865734246",
  appId: "1:278865734246:web:96b1bb488e460b38ea1ba7",
  measurementId: "G-P278NL0T1Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const storage = firebase.storage()

export  {
  storage, firebase as default
}
