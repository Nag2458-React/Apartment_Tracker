import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTDY6yYoaf7I_sE1V66gGTgKj9pEQj9-U",
  authDomain: "apartment-tracker-83390.firebaseapp.com",
  projectId: "apartment-tracker-83390",
  storageBucket: "apartment-tracker-83390.firebasestorage.app",
  messagingSenderId: "44307540450",
  appId: "1:44307540450:web:e4496cf9a367f5fbadf1bb",
  measurementId: "G-86J8P1RD42"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
