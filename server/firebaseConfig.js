import { initializeApp } from "firebase-admin/app";

const firebaseConfig = {
  apiKey: "AIzaSyDsBW82i36jV2QPx4CGq4YC7W03YrJvNDE",
  authDomain: "note-app-727b4.firebaseapp.com",
  projectId: "note-app-727b4",
  storageBucket: "note-app-727b4.firebasestorage.app",
  messagingSenderId: "905993126403",
  appId: "1:905993126403:web:b703cf96a73394f7c98436",
  measurementId: "G-449D3NKYZE",
};

initializeApp(firebaseConfig);

// import { initializeApp } from "firebase-admin/app";
// import "dotenv/config";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

// initializeApp(firebaseConfig);
