<template>
  <div class="pet-management">

    <h1 v-if="!showPetInfoCard">Adicionar Pet</h1>
        <!-- Botão para abrir o formulário de adicionar pet -->

    <form v-if="!showPetInfoCard" @submit.prevent="addPet">
      <div>
        <label for="petName">Nome do Pet:</label>
        <input id="petName" v-model="newPet.name" type="text" required>
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <div>
        <label for="species">Espécie:</label>
        <select id="species" v-model="newPet.species">
          <option value="cão">Cão</option>
          <option value="gato">Gato</option>
          <option value="pássaro">Pássaro</option>
        </select>
      </div>

      <div>
        <label for="breed">Raça:</label>
        <input id="breed" v-model="newPet.breed" type="text" required>
        <span v-if="errors.breed" class="error">{{ errors.breed }}</span>
      </div>

      <div>
        <label for="age">Idade:</label>
        <input id="age" v-model.number="newPet.age" type="number" min="0" required>
        <span v-if="errors.age" class="error">{{ errors.age }}</span>
      </div>

      <div>
        <label for="sex">Sexo:</label>
        <select id="sex" v-model="newPet.sex">
          <option value="macho">Macho</option>
          <option value="fêmea">Fêmea</option>
          <option value="desconhecido">Desconhecido</option>
        </select>
      </div>

      <div>
        <label for="weight">Peso:</label>
        <input id="weight" v-model.number="newPet.weight" type="number" min="0">
      </div>

      <div>
        <label for="color">Cor:</label>
        <input id="color" v-model="newPet.color" type="text">
      </div>

      <div>
        <label for="microchip">Identificação (opcional):</label>
        <input id="microchip" v-model="newPet.microchip" type="text">
      </div>

      <div>
        <label>Vacinação:</label>
        <input type="checkbox" id="vaccine1" v-model="newPet.vaccinations">
        <label for="vaccine1">Vacina X</label>
      </div>

      <div>
        <label for="conditions">Condições Médicas Preexistentes:</label>
        <textarea id="conditions" v-model="newPet.conditions" maxlength="300"></textarea>
      </div>

      <div>
        <label for="allergies">Alergias:</label>
        <textarea id="allergies" v-model="newPet.allergies" maxlength="300"></textarea>
      </div>

      <div>
        <label for="photo">Foto do Pet:</label>
        <input id="photo" type="file" @change="onFileChange">
      </div>

      <div>
        <label for="ownerName">Nome do Dono ou Responsável:</label>
        <input id="ownerName" v-model="newPet.ownerName" type="text" disabled value="Nome do Dono">
      </div>

      <div>
        <label for="emergencyContact">Contato de Emergência:</label>
        <input id="emergencyContact" v-model="newPet.emergencyContact" type="text" required>
        <span v-if="errors.emergencyContact" class="error">{{ errors.emergencyContact }}</span>
      </div>

      <button type="submit">Salvar Pet</button>
      <button type="button" @click="showPetInfoCard = false">Cancelar</button>

    </form>

    
    <!-- Cards de Pets -->
    <div v-for="pet in pets" :key="pet.id" class="pet-card">
      <h3>{{ pet.name }}</h3>
      <p>Espécie: {{ pet.species }}</p>
      <p>Raça: {{ pet.breed }}</p>
      <p>Idade: {{ pet.age }}</p>
     
    </div>

    <!-- Card de Informações do Pet Selecionado -->
    <div v-if="selectedPet" class="pet-info-card">
      <h2>Informações do Pet</h2>
      <p><strong>Nome:</strong> {{ selectedPet.name }}</p>
      <p><strong>Espécie:</strong> {{ selectedPet.species }}</p>
      <p><strong>Raça:</strong> {{ selectedPet.breed }}</p>
      <p><strong>Idade:</strong> {{ selectedPet.age }}</p>
      <button @click="closeCard">Fechar</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted,watch } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'PetManagement',
  setup() {
    const auth = getAuth();
    const pets = ref([]);
    const newPet = ref({
      name: '',
      species: '',
      breed: '',
      age: '',
      sex: '',
      weight: '',
      color: '',
      microchip: '',
      vaccinations: [],
      conditions: '',
      allergies: '',
      photo: null,
      ownerName: '',
      emergencyContact: '',
      ownerId: ''
    });
    const errors = ref({});
    const showPetInfoCard = ref(false);  // Use this to toggle form visibility
    const selectedPet = ref(null);  // Define selectedPet to avoid undefined errors
    const showSection = ref(''); // Adicionado conforme sugerido
    const userProfile = ref(null); // Adicionado conforme sugerido
    

    onMounted(async () => {
      const user = auth.currentUser;
      if (user) {
        await fetchPets(user.uid);
      } else {
        console.error("Usuário não autenticado ou indisponível");
      }
    });

    const fetchPets = async (uid) => {
      const petsQuery = query(collection(db, "pets"), where("ownerId", "==", uid));
      const querySnapshot = await getDocs(petsQuery);
      console.log("Número de pets encontrados:", querySnapshot.size);
      pets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Lista de pets atualizada:", pets.value);
    };



      // Watcher para monitorar a mudança da aba selecionada
      watch(showSection, async (newSection) => {
      if (newSection === 'pets') {      // Se a aba for "pets"
        await fetchPets(userProfile.value.uid); // Carrega os pets do usuário
      }
    });


    const addPet = async () => {
      if (!validatePet()) {
        alert("Verifique os campos e tente novamente.");
        return;
      }

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          newPet.value.ownerName = `${userSnap.data().firstName} ${userSnap.data().lastName}`;
          newPet.value.ownerId = user.uid;
        }
      } else {
        console.error("Usuário não autenticado ou indisponível");
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "pets"), {...newPet.value});
        pets.value.push({ ...newPet.value, id: docRef.id });  // Add to local list
        newPet.value = {};  // Reset newPet object
        showPetInfoCard.value = false;  // Hide the form
      } catch (error) {
        console.error("Erro ao adicionar pet:", error);
      }
    };

    
  const validatePet = () => {
  errors.value = {};

    if (!newPet.value.name.trim()) errors.value.name = "Nome do pet é obrigatório.";
    if (!/^[a-zA-Z ]+$/.test(newPet.value.name)) errors.value.name = "Nome do pet deve conter apenas letras.";

    if (!newPet.value.breed.trim()) errors.value.breed = "Raça é obrigatória.";
    if (!/^[a-zA-Z ]+$/.test(newPet.value.breed)) errors.value.breed = "Raça deve conter apenas letras.";

    if (!newPet.value.age) errors.value.age = "Idade é obrigatória.";
    if (isNaN(newPet.value.age) || newPet.value.age < 0) errors.value.age = "Idade deve ser um número válido.";

    if (newPet.value.emergencyContact && !/^(\(\d{2}\)\s)?(\d{4,5}-\d{4})$/.test(newPet.value.emergencyContact)) {
      errors.value.emergencyContact = "Formato inválido para contato de emergência.";
  }

  return Object.keys(errors.value).length === 0;
};



  
return { newPet, pets, addPet, errors, showPetInfoCard, selectedPet,showSection,userProfile} ;
}
};



</script>

  <style scoped>
.pet-management {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pet-management h1 {
  text-align: center;
  color: #333;
}

.pet-management form {
  display: grid;
  grid-gap: 15px;
  padding: 20px;
}

.pet-management label {
  font-weight: bold;
}

.pet-management input[type="text"],
.pet-management select,
.pet-management textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.pet-management input[type="file"] {
  border: none;
  background-color: #e9ecef;
}

.pet-management button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pet-management button:hover {
  background-color: #0056b3;
}

.pet-management .error {
  color: #dc3545;
  font-size: 0.875em;
}

.pet-management .alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 4px;
  text-align: center;
}



.pet-info-card {
  padding: 20px;
  margin-top: 20px;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.pet-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.pet-management button {
  margin: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
}
</style>
