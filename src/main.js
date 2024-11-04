import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VueMaskDirective } from 'v-mask';

// Primeiro, crie a aplicação Vue
const app = createApp(App);

// Depois, registre a diretiva de máscara
app.directive('mask', VueMaskDirective);

// Use o roteador
app.use(router);

// E finalmente, monte a aplicação no elemento DOM com id 'app'
app.mount('#app');