<template>
  <div id="app">
    <sidebar-menu v-if="isAuthenticated && $route.path !== '/login'"></sidebar-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from './firebase';
import SidebarMenu from './components/home.vue'; // Importe seu componente de menu

export default {
  name: 'App',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isAuthenticated = ref(false); // Estado para controlar a autenticação

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          isAuthenticated.value = true; // Usuário autenticado
          console.log("Usuário autenticado:", user);
        } else {
          isAuthenticated.value = false; // Usuário não autenticado
          if (route.path !== '/login') {
            console.log("Nenhum usuário autenticado, redirecionando para login...");
            router.push('/login');
          }
        }
      });
    });

    return { isAuthenticated };
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
