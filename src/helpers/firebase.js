import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseApp = initializeApp(firebaseConfig)
getAnalytics(firebaseApp)
getPerformance(firebaseApp)

export default firebaseApp
export const firebaseAuth = getAuth(firebaseApp)
export const providerGoogle = new GoogleAuthProvider()

