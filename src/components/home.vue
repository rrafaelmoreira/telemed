<template>
    <div class="sidebar">
      <div class="list-group">
        <div v-if="userType === 'medico'" class="list-group">
          <router-link to="/perfil-medico" class="list-group-item list-group-item-action">Meu Perfil</router-link>
          <router-link to="/agenda" class="list-group-item list-group-item-action">Minha Agenda</router-link>
          <router-link to="/pacientes" class="list-group-item list-group-item-action"> Meus Pacientes</router-link>
          <router-link to="/criar-reuniao" class="list-group-item list-group-item-action">Criar Reunião</router-link>

        </div>
        <div v-else-if="userType === 'cliente'" class="list-group">
          <router-link to="/perfil-cliente" class="list-group-item list-group-item-action">Meu Perfil</router-link>
          <router-link to="/lista-medico" class="list-group-item list-group-item-action">Médicos disponiveis</router-link>

        </div>
        
        <router-link to="/configuracoes" class="list-group-item list-group-item-action">Configurações</router-link>
        <button @click="handleLogout" class="list-group-item list-group-item-action">Logout</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth } from 'firebase/auth';
  import { doc, getDoc, getFirestore } from 'firebase/firestore';

  
  export default {
    name: 'SidebarMenu',
    data() {
    return {
      userType: null
    };
  },
  created() {
    const auth = getAuth();
    const db = getFirestore(); // Inicializa Firestore

    auth.onAuthStateChanged(user => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then(docSnap => {
          if (docSnap.exists()) {
            this.userType = docSnap.data().userType; // Pega userType do Firestore
            console.log("User type from Firestore:", this.userType);
          } else {
            console.log("No user data available in Firestore");
          }
        }).catch(error => {
          console.error("Error fetching user data:", error);
        });
      } else {
        // Se não há usuário, redireciona para login
        this.$router.push('/login');
      }
 
    });
  },
    methods: {
      handleLogout() {
        const auth = getAuth();
        auth.signOut().then(() => {
          this.$router.push('/login');
        }).catch((error) => {
          console.error('Logout Failed', error);
        });
      }
      
    }
  };

  
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #f8f9fa;
  }
  </style>
  