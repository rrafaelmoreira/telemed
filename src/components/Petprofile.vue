<template>
  <div class="pet-management">
    <h1>Gestão de Pets</h1>
    
    <!-- Lista de Pets -->
    <div v-for="pet in pets" :key="pet.id" class="pet-card">
      <h3>{{ pet.name }}</h3>
      <p><strong>Espécie:</strong> {{ pet.species }}</p>
      <p><strong>Raça:</strong> {{ pet.breed }}</p>
      <p><strong>Idade:</strong> {{ pet.age }} anos</p>
      <p><strong>Sexo:</strong> {{ pet.sex }}</p>
      <p><strong>Peso:</strong> {{ pet.weight }} kg</p>
      <p><strong>Cor:</strong> {{ pet.color }}</p>
      <p><strong>Microchip:</strong> {{ pet.microchip || "Não informado" }}</p>
      <p><strong>Vacinas:</strong> {{ pet.vaccinations.length ? pet.vaccinations.join(', ') : "Nenhuma" }}</p>
      <p><strong>Condições Médicas:</strong> {{ pet.conditions || "Nenhuma" }}</p>
      <p><strong>Alergias:</strong> {{ pet.allergies || "Nenhuma" }}</p>
      <p><strong>Contato de Emergência:</strong> {{ pet.emergencyContact || "Não informado" }}</p>
      
      <!-- Botões de editar e remover -->
      <button @click="editPet(pet)" class="btn-edit">Editar</button>
      <button @click="removePet(pet.id)" class="btn-remove">Remover</button>
    </div>

    <!-- Botão para exibir o formulário de adicionar pet -->
    <button class="btn-add-pet" @click="showPetForm()">Adicionar Pet</button>

    <!-- Formulário para adicionar ou editar pet -->
    <form v-if="showPetInfoCard" @submit.prevent="isEditing ? updatePet() : addPet()" class="pet-form">
      <h2>{{ isEditing ? "Editar Pet" : "Adicionar Novo Pet" }}</h2>
      
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
        <label for="weight">Peso (kg):</label>
        <input id="weight" v-model.number="newPet.weight" type="number" min="0">
      </div>

      <div>
        <label for="color">Cor:</label>
        <input id="color" v-model="newPet.color" type="text">
      </div>

      <div>
        <label for="microchip">Microchip:</label>
        <input id="microchip" v-model="newPet.microchip" type="text">
      </div>

      <div>
        <label>Vacinação:</label>
        <input type="checkbox" id="vaccine1" v-model="newPet.vaccinations" value="Vacina X">
        <label for="vaccine1">Vacina X</label>
      </div>

      <div>
        <label for="conditions">Condições Médicas:</label>
        <textarea id="conditions" v-model="newPet.conditions"></textarea>
      </div>

      <div>
        <label for="allergies">Alergias:</label>
        <textarea id="allergies" v-model="newPet.allergies"></textarea>
      </div>

      <div>
        <label for="emergencyContact">Contato de Emergência:</label>
        <input id="emergencyContact" v-model="newPet.emergencyContact" type="text">
      </div>

      <button type="submit" class="btn-submit">{{ isEditing ? "Atualizar Pet" : "Salvar Pet" }}</button>
      <button type="button" @click="cancelEdit" class="btn-cancel">Cancelar</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'PetOwnerProfile',
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
    const showPetInfoCard = ref(false);
    const isEditing = ref(false);
    const editingPetId = ref(null);

    const fetchPets = async (uid) => {
      const petsQuery = query(collection(db, "pets"), where("ownerId", "==", uid));
      const querySnapshot = await getDocs(petsQuery);
      pets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    onMounted(async () => {
      const user = auth.currentUser;
      if (user) {
        await fetchPets(user.uid);
      } else {
        console.error("Usuário não autenticado ou indisponível");
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
        const docRef = await addDoc(collection(db, "pets"), { ...newPet.value });
        pets.value.push({ ...newPet.value, id: docRef.id });
        resetForm();
      } catch (error) {
        console.error("Erro ao adicionar pet:", error);
      }
    };

    const editPet = (pet) => {
      newPet.value = { ...pet };
      editingPetId.value = pet.id;
      isEditing.value = true;
      showPetInfoCard.value = true;
    };

    const updatePet = async () => {
      if (!validatePet()) {
        alert("Verifique os campos e tente novamente.");
        return;
      }

      const petRef = doc(db, "pets", editingPetId.value);
      try {
        await updateDoc(petRef, { ...newPet.value });
        const index = pets.value.findIndex(pet => pet.id === editingPetId.value);
        pets.value[index] = { ...newPet.value, id: editingPetId.value };
        resetForm();
      } catch (error) {
        console.error("Erro ao atualizar pet:", error);
      }
    };

    const removePet = async (petId) => {
      const petRef = doc(db, "pets", petId);
      try {
        await deleteDoc(petRef); // Remove o documento do Firestore
        pets.value = pets.value.filter(pet => pet.id !== petId); // Remove o pet da lista local
      } catch (error) {
        console.error("Erro ao remover pet:", error);
      }
    };

    const showPetForm = () => {
      resetForm();
      showPetInfoCard.value = true;
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      newPet.value = {
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
      };
      isEditing.value = false;
      editingPetId.value = null;
      showPetInfoCard.value = false;
    };

    const validatePet = () => {
      errors.value = {};

      if (!newPet.value.name.trim()) errors.value.name = "Nome do pet é obrigatório.";
      if (!/^[a-zA-Z ]+$/.test(newPet.value.name)) errors.value.name = "Nome do pet deve conter apenas letras.";

      if (!newPet.value.breed.trim()) errors.value.breed = "Raça é obrigatória.";
      if (!/^[a-zA-Z ]+$/.test(newPet.value.breed)) errors.value.breed = "Raça deve conter apenas letras.";

      if (!newPet.value.age) errors.value.age = "Idade é obrigatória.";
      if (isNaN(newPet.value.age) || newPet.value.age < 0) errors.value.age = "Idade deve ser um número válido.";

      return Object.keys(errors.value).length === 0;
    };

    return {
      newPet,
      pets,
      addPet,
      updatePet,
      editPet,
      removePet,
      cancelEdit,
      showPetForm,
      errors,
      showPetInfoCard,
      isEditing
    };
  }
};
</script>

<style scoped>
.pet-management {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pet-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 15px 0;
  border-radius: 8px;
  background-color: #fff;
}

.pet-card h3 {
  color: #007bff;
}

.pet-card p {
  margin: 5px 0;
}

.btn-add-pet, .btn-submit, .btn-cancel, .btn-edit, .btn-remove {
  width: 100%;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px 0;
}

.btn-add-pet, .btn-submit {
  background-color: #007bff;
}

.btn-cancel, .btn-remove {
  background-color: #dc3545;
}
</style>
