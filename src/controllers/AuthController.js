import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  async login(email, password) {
    // Lógica de login
    console.log('Login:', email, password);
    const q = query(collection(db, 'users'), where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna true se o usuário for encontrado, caso contrário, false
  },
  async register(email, password) {
    // Lógica de registro
    console.log('Register:', email, password);
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(collection(db, 'users'), { email, password });
      return true; // Registro bem-sucedido
    }
    return false; // Usuário já existe
  }
};