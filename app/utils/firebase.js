// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyA042q8yparAWrkwyF4QMoj02waixaIpMI",
  authDomain: "tenedores-a6b51.firebaseapp.com",
  projectId: "tenedores-a6b51",
  storageBucket: "tenedores-a6b51.appspot.com",
  messagingSenderId: "322221965502",
  appId: "1:322221965502:web:bc4b03216c9d0ac1e65eef"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
