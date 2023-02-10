import firebase from "firebase/compat/app";

import 'firebase/compat/storage';
const firebaseConfig = {
  apiKey: "AIzaSyCSQ8KdSkQoMIkysSYucfKJYdLkupHyFgg",
  authDomain: "user-84c6a.firebaseapp.com",
  projectId: "user-84c6a",
  storageBucket: "user-84c6a.appspot.com",
  messagingSenderId: "1032952045396",
  appId: "1:1032952045396:web:be34d8cc4c2114457c32c1",
  measurementId: "G-DS1SWK7MYT"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;