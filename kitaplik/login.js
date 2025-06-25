import { auth, signInWithPopup, GoogleAuthProvider } from "./firebase.js";

const provider = new GoogleAuthProvider();

export const signIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert(`Hoş geldiniz, ${user.displayName}`);
        console.log(user);
    } catch (err) {
        console.log("Giriş başarısız: " + err.message);
        alert("Giriş başarısız!");
    }
}