// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP9DFlAnGeQlITL8O2YLUSDFV0scnFFY8",
    authDomain: "breakingbad-progress.firebaseapp.com",
    projectId: "breakingbad-progress",
    storageBucket: "breakingbad-progress.firebasestorage.app",
    messagingSenderId: "958291194221",
    appId: "1:958291194221:web:b04ce00a432206d6ebaa64",
    measurementId: "G-9YRXMHW7DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
