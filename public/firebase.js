import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNYDcUqgXKSe7fYCkbfOCNEz0XcIu8yHY",
  authDomain: "outliers-af84b.firebaseapp.com",
  projectId: "outliers-af84b",
  storageBucket: "outliers-af84b.firebasestorage.app",
  messagingSenderId: "205743069018",
  appId: "1:205743069018:web:6a6a8dec5ba60b35c38563"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Login OK"))
    .catch(err => alert(err.message));
};

window.signup = function () {
  const email = document.getElementById("semail").value;
  const password = document.getElementById("spassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signup OK"))
    .catch(err => alert(err.message));
};