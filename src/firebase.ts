import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB75UH8MxS48U3sIcHl9sHjGw71UBCBN0Y",
    authDomain: "fat-elephant-web.firebaseapp.com",
    projectId: "fat-elephant-web",
    storageBucket: "fat-elephant-web.firebasestorage.app",
    messagingSenderId: "455787341095",
    appId: "1:455787341095:web:ba573d2c5038bf8f49f502",
    measurementId: "G-XJK9ZSTD0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
