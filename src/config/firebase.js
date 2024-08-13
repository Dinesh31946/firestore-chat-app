// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAB_tZ2JInMO_lCJgbTD7SuN_C61jmoMbc",
  authDomain: "chat-app-dg.firebaseapp.com",
  projectId: "chat-app-dg",
  storageBucket: "chat-app-dg.appspot.com",
  messagingSenderId: "717221957873",
  appId: "1:717221957873:web:313abed5eef82957d1d950"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// signup method
const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        setTimeout(async () => {
            await setDoc(doc(db,"user",user.uid),{
                id: user.uid,
                username: username.toLowerCase(),
                email,
                name: "",
                avatar: "",
                bio: "Hey, there i am using chat app",
                lastseen: Date.now()
            })
            await setDoc(doc(db,"chats",user.uid),{
                chatData: []
            });
        },1000);    // Delay heavy operations
    } catch (err) {
        console.error(err);
        toast.error(err.code.split("/")[1].split("-").join(" "));
    }
}

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {   
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {   
        console.error(error);
        toast.error(error.code.split("/")[1].join(" "));
    }
}

export {signup, login, logout, auth, db}