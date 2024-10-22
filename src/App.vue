<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from './firebase'; // Importa o Firebase Auth

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const route = useRoute();

    // Lógica de autenticação centralizada
    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("Usuário autenticado:", user);
          // Lógica para usuários autenticados
        } else if (route.path !== '/login') {
          console.log("Nenhum usuário autenticado, redirecionando para login...");
          router.push('/login');
        }
      });
    });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
