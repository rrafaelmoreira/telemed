<template>
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container">
          <!-- Logotipo -->
          <router-link class="navbar-brand d-flex align-items-center" to="/">
            <img src="@/assets/logo.png" alt="Logo" width="60" height="60" class="banner-image"/>
            Telemed Pet
          </router-link>
  
          <!-- Botão de menu responsivo (hambúrguer) -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
  
          <!-- Menu de Navegação -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto text-start">
              <!-- Exibe nome e foto do usuário na versão colapsada (para telas menores) -->
              <li v-if="user" class="nav-item d-lg-none my-3">
                <div class="d-flex align-items-center">
                  <div>
                    <p class="mb-0 fw-bold">{{ user.displayName || 'Usuário' }}</p>
                    <p class="text-muted small">{{ user.email }}</p>
                  </div>
                </div>
              </li>
              <!-- Links comuns para médico e cliente -->
              <li class="nav-item">
                <router-link to="/agenda" class="nav-link">Agenda</router-link>
              </li>
              <li class="nav-item">
                <router-link :to="userType === 'medico' ? '/perfil-medico' : '/perfil-cliente'"
                  class="nav-link">Perfil</router-link>
              </li>
              <li v-if="userType === 'medico'" class="nav-item">
                <router-link to="/pacientes" class="nav-link">Pacientes</router-link>
              </li>
              <li v-if="userType === 'medico'" class="nav-item">
                <router-link to="/criar-reuniao" class="nav-link">Criar Reunião</router-link>
              </li>
              <li v-if="userType === 'cliente'" class="nav-item">
                <router-link to="/pets" class="nav-link">Pets</router-link>
              </li>
              <li v-if="userType === 'cliente'" class="nav-item">
                <router-link to="/lista-medico" class="nav-link">Médicos Disponíveis</router-link>
              </li>
              <!-- Botão de Logout -->
              <li class="nav-item">
                <button @click="handleLogout" class="btn btn-outline-danger btn-sm mt-1">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script>
  import { getAuth } from "firebase/auth";
  import { doc, getDoc, getFirestore } from "firebase/firestore";
  
  export default {
    name: "HeaderComponent",
    data() {
      return {
        userType: null, // Tipo de usuário para condicional de navegação
        user: null, // Informações do usuário logado
      };
    },
    created() {
      const auth = getAuth();
      const db = getFirestore();
  
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.user = user; // Armazena informações do usuário para exibir nome e foto
          const userRef = doc(db, "users", user.uid);
          getDoc(userRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                this.userType = docSnap.data().userType;
                console.log("User type from Firestore:", this.userType);
              } else {
                console.log("No user data available in Firestore");
              }
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          this.$router.push("/login"); // Redireciona para login se não autenticado
        }
      });
    },
    methods: {
      handleLogout() {
        const auth = getAuth();
        auth
          .signOut()
          .then(() => {
            this.$router.push("/login");
          })
          .catch((error) => {
            console.error("Logout Failed", error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  /* A margem superior no conteúdo principal pode ser necessária para evitar sobreposição */
  body {
    padding-top: 56px;
    /* Altura do cabeçalho fixo */
  }
  
  .navbar {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-brand img {
    margin-right: 8px;
  }
  
  .navbar-nav .nav-item img {
    display: block;
  }
  
  .navbar-nav .nav-item p {
    margin: 0;
  }
  </style>
  