'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, collection, doc, Timestamp, addDoc, deleteDoc, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";      
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import {db, auth, provider} from "./firebase.js";

let me = null;

const $message = $("#message");
const $form = $("form");
const $messages = $("#messages");
const $login = $("#login");
const $logout = $("#logout");
const out_url = "index.html";

(() => {

  onAuthStateChanged(auth, user => {
    if (user) {
      me = user;

      console.log(`${me.displayName} Login!!`);

      // メッセージの多重表示防止
      if ($messages.children().length > 0) { 
        $messages.children().remove();
      }

      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('created'));
      
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const li = $('<li>');
            const d = change.doc.data();
            // li.text(`${d.uid.substr(0, 8)}: ${d.message}`);
            
            let sentreceive = "sent";
            if(d.uid !== me.uid){
              // sentreceive = "received"
              li.html(`
                <li class="msgs">
                <img class="receivedimg" src="${d.photoURL}">
                <div class="receivedoption">${d.displayName}</div>
                <div class="received">${d.message}</div>
                </li>`);
                console.log(d);
            } else {
              li.html(`
                <li class="msgs">
                <div class="sent">${d.message}</div>
                <div class="sentoption">${d.displayName}</div>
                <img class="sentimg" src="${d.photoURL}">
                </li>`);
            }

              console.log(d);
            $messages.append(li);
            // console.log("新規追加:", change.doc.data());
          }
          if (change.type === "modified") {
            console.log("更新:", change.doc.data());
          }
          if (change.type === "removed") {
            console.log("削除:", change.doc.data());
          }


        });
      });

      console.log(user);
      $login.addClass('hidden');
      $logout.add($form).add($messages).removeClass('hidden');

      $message.focus();
      return;
    }

    me = null;
    console.log('Please login!');
    $login.removeClass('hidden');
    $logout.add($form).add($messages).addClass('hidden');
  });
  
  $form.on('submit', function(e) {
    e.preventDefault();

    const val = $message.val().trim();
    if (val === "") {
      console.log('$message.val is null');
      return;
    }

    $message.val('').focus();

    const messagesRef = collection(db, 'messages');
    addDoc(messagesRef, {
      message: val,
      created: new Date(),
      uid: me ? me.uid : 'uid is null',
      displayName: me ? me.displayName : 'name is null',
      photoURL: me ? me.photoURL : 'No Photo',
    });
  });
})();

$logout.on("click", () => {
  logOut(auth);
});

function logOut(auth){
  // signInWithRedirect(auth, provider);
  signOut(auth).then(() => {
      // Sign-out successful.
      _redirect();
  }).catch((error) => {
      // An error happened.
      console.error(error);
  });
}


function _redirect(){
  location.href= out_url;
}