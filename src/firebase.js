import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyBEyAr-OE0LBwhKF5rfR-khsZtRktg5VRc",        // Chave da API
  authDomain: "telemedicina-5475a.firebaseapp.com",                                                
  projectId: "telemedicina-5475a",                                                                                   
  storageBucket: "telemedicina-5475a.appspot.com",
  messagingSenderId: "531451834315",
  appId: "1:531451834315:web:dda21770e280d275f5904e",                                                           
  measurementId: "G-6VG4HMBC7P"                     
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);      // Inicializa o Firebase

const db = getFirestore(app);
export { db }; // Exporta o objeto db para ser utilizado em outros arquivos