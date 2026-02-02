// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsBW82i36jV2QPx4CGq4YC7W03YrJvNDE",
  authDomain: "note-app-727b4.firebaseapp.com",
  projectId: "note-app-727b4",
  storageBucket: "note-app-727b4.firebasestorage.app",
  messagingSenderId: "905993126403",
  appId: "1:905993126403:web:b703cf96a73394f7c98436",
  measurementId: "G-449D3NKYZE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
