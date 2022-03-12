import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

//you can either add your firebase config directly like in the tutorial or can also add it as an 
//json string like here https://create-react-app.dev/docs/adding-custom-environment-variables/

// const config = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG)

const firebaseConfig = {
    apiKey: "AIzaSyCUbGVAQYJcv_8QGw6kzfAbKwidSflLeYw",
    authDomain: "chess-51f78.firebaseapp.com",
    projectId: "chess-51f78",
    storageBucket: "chess-51f78.appspot.com",
    messagingSenderId: "216975571956",
    appId: "1:216975571956:web:398e01365fd5d306fc97a1",
    measurementId: "G-XZG8XFG9YX"
  };


// const firebaseConfig = config;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const auth = firebase.auth()
export const firebaseTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
export default firebase