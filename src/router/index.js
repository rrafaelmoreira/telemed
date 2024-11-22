import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import { getAuth } from 'firebase/auth';
import DoctorPatients from '@/components/DoctorPatients.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/dashboard', name: 'Dashboard', component: DoctorPatients },
  { path: '/login', name: 'Login', component: LoginPage, meta: { hideHeader: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { hideHeader: true } },

  // Adicionando a rota para Home
];

// Criando a constante auth para verificar se o usuário está logado ou não  
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guarda de navegação global para proteger as rotas
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    // Se a rota requer autenticação e o usuário não está logado
    next("/login");
  } else if (to.matched.some((record) => record.meta.requiresGuest) && user) {
    // Se a rota requer que o usuário seja um convidado (não logado) e o usuário está logado
    next("/dashboard"); // Redireciona para a página principal ou painel
  } else if (to.matched.some((record) => record.meta.hideHeader) && user) {
    next("/home");
  }
  else {
    // Caso contrário, permite a navegação
    next();
  }
});

export default router;
