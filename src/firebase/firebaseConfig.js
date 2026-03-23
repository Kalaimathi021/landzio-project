import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXpvoFALQLL2zrlYAiL3wEUK-KfPqIxy4",
  authDomain: "landzio-cc450.firebaseapp.com",
  projectId: "landzio-cc450",
  storageBucket: "landzio-cc450.firebasestorage.app",
  messagingSenderId: "108402468994",
  appId: "1:108402468994:web:35d1bd56d96a4c22612c9b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);