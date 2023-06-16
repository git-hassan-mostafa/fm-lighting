import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAuwsEyjMA1XKbKSznnac_WYD_FQGEHImY",
  authDomain: "api2-370202.firebaseapp.com",
  projectId: "youtube-api2-370202",
  storageBucket: "youtube-api2-370202.appspot.com",
  messagingSenderId: "765905066164",
  appId: "1:765905066164:web:0f964a8c401844582c9fe1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)
