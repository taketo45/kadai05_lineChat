
'use strict';

//###############################################
// 必要なFirebaseライブラリを読み込み
//###############################################
import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import {db, auth, provider, googleAuthLaterProcess} from "./firebase.js";

const $login = $("#login");
const to_url = "chat.html";

//###############################################
//Login処理
//###############################################
$login.on("click",function(){
    googleAuthLaterProcess(auth, provider, to_url);
});
