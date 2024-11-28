<template>
  <div class="medicos-container">
    <h1>Médicos Disponíveis</h1>
    <ul class="medicos-list">
      <li v-for="medico in medicos" :key="medico.id" class="medico-item">
        <h2>{{ medico.fullName }}</h2>
        <p>Especialidade: {{ medico.specialty }}</p> 
        <button @click="agendar(medico)">Agendar Consulta</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { db } from '@/firebase'; // Ajuste o caminho conforme seu arquivo de configuração
import { collection, query, where, getDocs } from 'firebase/firestore'; 

export default {
  name: 'ListaMedicos',
  setup() {
    const medicos = ref([]);
    const router = useRouter();

    // Função para buscar todos os médicos
    const fetchMedicos = async () => {
      try {
        // Referência para a coleção 'users'
        const medicosRef = collection(db, 'users');
        // Consulta para buscar usuários com tipo 'medico'
        const q = query(medicosRef, where('userType', '==', 'medico'));
        const querySnapshot = await getDocs(q);
        
        // Mapeando os dados para uma estrutura mais fácil de usar
        medicos.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(medicos.value); // Verifique no console se os dados estão sendo carregados corretamente
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      }
    };

    // Função para agendar consulta
    const agendar = (medico) => {
      if (confirm(`Deseja agendar uma consulta com ${medico.fullName}?`)) {
        router.push({ name: 'verAgenda', params: { medicoId: medico.id } });
      }
    };

    // Chama a função para buscar médicos ao montar o componente
    onMounted(fetchMedicos);

    return { medicos, agendar };
  }
};
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
