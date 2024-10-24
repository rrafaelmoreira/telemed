import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import JitsiMeet from '../components/JitsiMeet.vue';
import ForgotPasswordPage from '../components/ForgotPasswordPage.vue';
import DoctorDashboard from '../components/DoctorDashboard.vue';
import DoctorAgenda from '../components/DoctorAgenda.vue';
import DoctorPatients from '../components/DoctorPatients.vue';
import DoctorConsultations from '../components/DoctorConsultations.vue';
import DoctorSettings from '../components/DoctorSettings.vue';
import DoctorMeet from '@/components/DoctorMeet.vue';
import PetOwnerProfile from '@/components/PetOwnerProfile.vue';
import Home from '../components/home.vue'; // Importando o novo componente Home
import { getAuth } from 'firebase/auth';














const routes = [
  { path: '/', redirect: '/Login' },  // Alterando para redirecionar para /home
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/jitsi', name: 'Jitsi', component: JitsiMeet },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordPage },
  { path: '/home', name: 'Home', component: Home,   meta: { requiresAuth: true }   } ,// Adicionando a rota para Home
  { path: '/dashboard', name: 'Dashboard', component: DoctorDashboard,  meta: { requiresAuth: true } },
  { path: '/agenda', name: 'Agenda', component: DoctorAgenda, meta: { requiresAuth: true } },
  { path: '/patients', name: 'Patients', component: DoctorPatients },
  { path: '/consultations', name: 'Consultations', component: DoctorConsultations,meta: { requiresAuth: true }  },
  { path: '/settings', name: 'Settings', component: DoctorSettings,meta: { requiresAuth: true }  },
  { path: '/criar-reuniao', name: 'Jitsi', component: DoctorMeet,meta: { requiresAuth: true }  }, 
  { path: '/perfil-cliente', name: 'OwnerProfile', component: PetOwnerProfile,meta: { requiresAuth: true }  },
  
];

// Criando a constante auth para verificar se o usuário está logado ou não  
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
  
// Guarda de navegação global para proteger as rotas
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    // Se a rota requer autenticação e não há usuário autenticado, redireciona para login
    next('/login');
  } else {
    next();  // Caso contrário, permite a navegação
  }
});




export default router;

