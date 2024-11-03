<template>
  <div class="medicos-container">
    <h1>Médicos Disponíveis</h1>
    <ul class="medicos-list">
      <li v-for="medico in medicos" :key="medico.id" class="medico-item">
        <h2>{{ medico.firstName }} {{ medico.lastName }}</h2>
        <p>Especialidade: {{ medico.crm }}</p> <!-- Supondo que o CRM seja usado como especialidade -->
        <button @click="agendar(medico)">Agendar Consulta</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';// Ajuste o caminho conforme seu arquivo de configuração
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'ListaMedicos',
  setup() {
    const medicos = ref([]);

    const fetchMedicos = async () => {
      const medicosRef = collection(db, 'users');
      const q = query(medicosRef, where("userType", "==", "medico"));
      const querySnapshot = await getDocs(q);
      medicos.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(medicos.value); // Verificar se os dados estão sendo carregados corretamente
    };

    const agendar = (medico) => {
      // Aqui você pode redirecionar para um componente de agendamento ou abrir um modal
      alert(`Agendamento para ${medico.firstName} ${medico.lastName}`);
      // Implemente a lógica de agendamento aqui
    };

    onMounted(fetchMedicos);

    return { medicos, agendar };
  }
}
</script>

<style scoped>
.medicos-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.medicos-list {
  list-style: none;
  padding: 0;
}

.medico-item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.medico-item:last-child {
  border-bottom: none;
}

.medico-item h2 {
  margin: 0 0 5px 0;
  color: #333;
}

.medico-item p {
  margin: 0;
  color: #666;
}

button {
  padding: 8px 16px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
