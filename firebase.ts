// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-AiYOmkCgUDbBdqLIk0H6Am2NExAyfG0",
  authDomain: "findash-f690e.firebaseapp.com",
  projectId: "findash-f690e",
  storageBucket: "findash-f690e.firebasestorage.app",
  messagingSenderId: "230809617514",
  appId: "1:230809617514:web:9c65740827e1ad3624b613"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

