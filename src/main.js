import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Opcional, apenas se usar JS do Bootstrap
import { VueMaskDirective } from 'v-mask';
import './styles/auth.css';
import './styles/header.css';

// Primeiro, crie a aplicação Vue
const app = createApp(App);

// Depois, registre a diretiva de máscara
app.directive('mask', VueMaskDirective);

// Use o roteador
app.use(router);

// E finalmente, monte a aplicação no elemento DOM com id 'app'
app.mount('#app');