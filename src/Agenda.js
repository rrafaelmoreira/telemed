import { db } from './firebase';

// Função para adicionar médico
export function addDoctor(doctorData) {
  return db.collection('users').doc(doctorData.userId).set({
    ...doctorData,
    userType: 'médico'
  });
}

// Função para adicionar cliente
export function addClient(clientData) {
  return db.collection('users').doc(clientData.userId).set({
    ...clientData,
    userType: 'cliente'
  });
}

// Função para adicionar evento à agenda de um médico
export function addEventToDoctorAgenda(userId, eventData) {
  return db.collection('users').doc(userId).collection('agenda').add({
    ...eventData
  });
}
