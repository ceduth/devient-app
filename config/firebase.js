// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBb4mhMosVhjuFBiemf5E4I-HRKjCzvn3Q",
  authDomain: "devient-f1f7c.firebaseapp.com",
  projectId: "devient-f1f7c",
  storageBucket: "devient-f1f7c.appspot.com",
  messagingSenderId: "837135072222",
  appId: "1:837135072222:web:4c548e69c6ba941df73b4f",
  measurementId: "G-M0SKBR3Z2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);