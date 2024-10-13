import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';

const routes = [
  {
    path: '/',
    redirect: '/auth' // Redireciona a rota raiz para a página de login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'AuthView',
    component: AuthView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;