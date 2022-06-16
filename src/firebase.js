import {initializeApp} from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {OAuthProvider} from "firebase/auth";
import 'firebase/firestore';
import env from "react-dotenv";

// Your web app's Firebase configuration
// Put your SDK details
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);

// Initialize Provider & Export
export const microsoftProvider = new OAuthProvider('microsoft.com').setCustomParameters({
    login_hint: process.env.REACT_APP_MICROSOFT_LOGIN_HINT,
    tenant: process.env.REACT_APP_MICROSOFT_TENANT,  // Put Tenant Id from Azure registered app,
    prompt: 'consent' // Get Consent from user to access their basic info (optional - Reommended only during SignUp)
});