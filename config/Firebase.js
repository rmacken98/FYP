import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbXKFttv9m6omLBC2AQAYHsLm6gRTtg0Y",
  authDomain: "skatespots-960cd.firebaseapp.com",
  databaseURL: "https://skatespots-960cd.firebaseio.com",
  projectId: "skatespots-960cd",
  storageBucket: "skatespots-960cd.appspot.com",
  messagingSenderId: "505174584278",
  appId: "1:505174584278:web:e4ec5a0cc8ea0ec2af5277",
  measurementId: "G-8JSVSV2EZC"
}

let Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase