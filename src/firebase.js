// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEyAr-OE0LBwhKF5rfR-khsZtRktg5VRc",        // Chave da API
  authDomain: "telemedicina-5475a.firebaseapp.com",
  projectId: "telemedicina-5475a",
  storageBucket: "telemedicina-5475a.appspot.com",
  messagingSenderId: "531451834315",
  appId: "1:531451834315:web:dda21770e280d275f5904e",
  measurementId: "G-6VG4HMBC7P"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Cria instâncias do Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Verifica se o usuário está autenticado
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    // Logic to handle authenticated user
  } else {
    console.log("No user is signed in.");
    // Logic to handle unauthenticated user
  }
});






// Exporta as instâncias para serem usadas em outros arquivos
export { auth, db };
