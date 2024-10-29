'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, collection, doc, Timestamp, addDoc, deleteDoc, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";      
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { firebaseConfig } from "./MyAuthkeys.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

function googleAuthLaterProcess(auth, provider,to_url){
  //Google認証完了後の処理
  signInWithPopup(auth, provider).then((result) => {
      //Login後のページ遷移
      location.href=to_url;  
  }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
  });
}

export {db, auth, provider, googleAuthLaterProcess};