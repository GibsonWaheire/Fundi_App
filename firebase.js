// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "1061351049872-kc42olhfm8e7ebf9vb34b1qhndq27o94.apps.googleusercontent.com",
  authDomain: "fundisapp-ec0d6.firebaseapp.com",
  projectId: "fundisapp-ec0d6",
  storageBucket: "fundisapp-ec0d6.appspot.com",
  messagingSenderId: "1061351049872",
  appId: "1:1061351049872:web:8bcc7d7d9b31acb8bda615"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
