// import initializeApp
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { signOut ,onAuthStateChanged ,getAuth, signInWithRedirect ,GoogleAuthProvider } from "firebase/auth";
// setup the configs for your project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initialize the app using your firebaseConfig
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  console.log("you're logged in as: ", user);
  
});
export const signInWithGoogle = () => { return signInWithRedirect(auth, new GoogleAuthProvider()) }


export const db = getFirestore(app);

export const logUserOut = () => {return signOut(auth);}
