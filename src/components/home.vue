<template>
    <div class="sidebar">
      <div class="list-group">
        <router-link to="/dashboard" class="list-group-item list-group-item-action">Dashboard</router-link>
        <router-link to="/agenda" class="list-group-item list-group-item-action">Agenda</router-link>
        <router-link to="/pacientes" class="list-group-item list-group-item-action">Pacientes</router-link>
        <router-link to="/consultas" class="list-group-item list-group-item-action">Consultas</router-link>
        <router-link to="/criar-reuniao" class="list-group-item list-group-item-action">Criar Reunião</router-link>
        <router-link to="/configuracoes" class="list-group-item list-group-item-action">Configurações</router-link>
        <router-link to="/perfil-cliente" class="list-group-item list-group-item-action">Meu Perfil</router-link>
        <button @click="handleLogout" class="list-group-item list-group-item-action">Logout</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: 'SidebarMenu',
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
  