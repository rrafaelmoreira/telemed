<template>
  <div class="patient-details-container">
    <h1>Pacientes com Consultas Agendadas</h1>
    <div v-if="Object.keys(groupedPatients).length">
      <div v-for="(group, clientId) in groupedPatients" :key="clientId" class="client-group">
        <button @click="toggleExpand(clientId)" class="client-group-header">
          <strong>Cliente:</strong> {{ group.data.firstName }} {{ group.data.lastName }} ({{ group.animals.length }} animais)
        </button>
        <div v-if="group.expanded" class="client-group-body">
          <p><strong>CPF:</strong> {{ group.data.cpf }}</p>
          <p><strong>Gênero:</strong> {{ group.data.gender }}</p>
          <p><strong>Tipo de Usuário:</strong> {{ group.data.userType }}</p>
          <h3>Animais</h3>
          <ul>
            <li v-for="pet in group.animals" :key="pet.id">
              <p><strong>Nome:</strong> {{ pet.name }}</p>
              <p><strong>Espécie:</strong> {{ pet.species }}</p>
              <p><strong>Raça:</strong> {{ pet.breed || "Não disponível" }}</p>
              <p><strong>Condições:</strong> {{ pet.conditions || "Não especificado" }}</p>
              <p><strong>Peso:</strong> {{ pet.weight || "Não especificado" }} kg</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Nenhum paciente com consulta agendada no momento.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: "DoctorPatients",
  setup() {
    const groupedPatients = ref({});
    const auth = getAuth();
    const currentMedicoId = ref(auth.currentUser ? auth.currentUser.uid : null);

    // Função para buscar e agrupar pacientes e animais com base nos eventos de consulta do médico logado
    async function fetchPatientsData() {
      if (currentMedicoId.value) {
        const eventsRef = collection(db, `users/${currentMedicoId.value}/events`);
        const eventsQuery = query(eventsRef, where("available", "==", false));

        onSnapshot(eventsQuery, async (snapshot) => {
          const clients = {}; // Objeto para agrupar os dados dos clientes

          for (const eventDoc of snapshot.docs) {
            const eventData = eventDoc.data();
            if (eventData.service && eventData.clientId) {
              // Verifica se o cliente já está no objeto 'clients' para evitar duplicação de buscas
              if (!clients[eventData.clientId]) {
                const clientData = await fetchClientData(eventData.clientId);
                const animals = await fetchPetsData(eventData.clientId);

                if (clientData) {
                  clients[eventData.clientId] = {
                    clientId: eventData.clientId,
                    data: clientData,
                    animals: animals,
                    expanded: false,
                  };
                }
              }
            }
          }

          groupedPatients.value = clients; // Atualiza os dados agrupados
        });
      } else {
        console.error("Médico não autenticado.");
      }
    }

    // Função para buscar os dados do cliente usando clientId
    async function fetchClientData(clientId) {
      try {
        const clientRef = doc(db, 'users', clientId);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          return clientSnap.data();
        } else {
          console.error("Paciente não encontrado.");
          return null;
        }
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error);
        return null;
      }
    }

    // Função para buscar os dados dos animais do paciente usando clientId como ownerId
    async function fetchPetsData(ownerId) {
      try {
        const petsRef = collection(db, 'pets');
        const petsQuery = query(petsRef, where('ownerId', '==', ownerId));
        const petsSnapshot = await getDocs(petsQuery);

        return petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Erro ao buscar dados dos animais:", error);
        return [];
      }
    }

    // Função para expandir e colapsar o grupo de clientes
    function toggleExpand(clientId) {
      if (groupedPatients.value[clientId]) {
        groupedPatients.value[clientId].expanded = !groupedPatients.value[clientId].expanded;
      }
    }

    onMounted(fetchPatientsData);

    return { groupedPatients, toggleExpand };
  },
};
</script>

<style scoped>
.patient-details-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.client-group {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
  overflow: hidden;
}

.client-group-header {
  width: 100%;
  text-align: left;
  padding: 10px;
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border: none;
  outline: none;
}

.client-group-body {
  padding: 15px;
  background-color: #f1f1f1;
}

.client-group-body p {
  margin: 5px 0;
}

.client-group-body h3 {
  margin-top: 10px;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background: #e9e9e9;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}
</style>