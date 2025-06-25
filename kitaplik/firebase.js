import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getDatabase, set, get, ref, child, update, remove, increment, push } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBuGe7SAawE4zS7FinKLdQFgy0QOqYpSCk",
    authDomain: "ikd-web.firebaseapp.com",
    projectId: "ikd-web",
    storageBucket: "ikd-web.firebasestorage.app",
    messagingSenderId: "707260070983",
    appId: "1:707260070983:web:3c137cf068024c62940562",
    measurementId: "G-FSM435JFNQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const auth = getAuth();

export { analytics, db, auth, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, set, get, ref, child, update, remove, increment, push, deleteUser };