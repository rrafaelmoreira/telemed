import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '@/components/HomepageComponent.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import JitsiMeet from '../components/JitsiMeet.vue';
import ForgotPasswordPage from '../components/ForgotPasswordPage.vue';
import DoctorAgenda from '../components/DoctorAgenda.vue';
import DoctorProfile from '../components/DoctorProfile.vue';
import DoctorList from '../components/DoctorList.vue';
import DoctorPatients from '../components/DoctorPatients.vue';n
import DoctorConsultations from '../components/DoctorConsultations.vue';
import DoctorMeet from '@/components/DoctorMeet.vue';
import PetOwnerProfile from '@/components/PetOwnerProfile.vue';
import DoctorSchedule from '@/components/DoctorSchedule.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  { path: '/', redirect: '/home' },  // Alterando para redirecionar para /home
  { path: '/home', name: 'Home', component: HomeComponent, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/jitsi', name: 'Jitsi', component: JitsiMeet },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordPage },
  { path: '/agenda', name: 'Agenda', component: DoctorAgenda, meta: { requiresAuth: true } },
  { path: '/pacientes', name: 'Patients', component: DoctorPatients },
  { path: '/consultations', name: 'Consultations', component: DoctorConsultations, meta: { requiresAuth: true } },
  { path: '/criar-reuniao', name: 'Jitsi', component: DoctorMeet, meta: { requiresAuth: true } },
  { path: '/perfil-cliente', name: 'OwnerProfile', component: PetOwnerProfile, meta: { requiresAuth: true } },
  { path: '/perfil-medico', name: 'DrProfile', component: DoctorProfile, meta: { requiresAuth: true } },
  { path: '/lista-medico', name: 'DrList', component: DoctorList, meta: { requiresAuth: true } },
  { path: '/medico-agenda/:medicoId', name: 'verAgenda', component: DoctorSchedule, meta: { requiresAuth: true }, props: true },

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
  } else {
    // Caso contrário, permite a navegação
    next();
  }
});

export default router;
