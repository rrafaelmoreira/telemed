<template>
  <div class="profile-container">
    <h1 class="text-center">Meu Perfil</h1>
    <div class="button-group text-center">
      <button class="btn btn-outline-primary" @click="showSection = 'profile'">Perfil</button>
      <button class="btn btn-outline-info" @click="showSection = 'pets'">Meus Pets</button>
    </div>

    <div v-if="showSection === 'profile'">
      <h2 class="text-center">Perfil</h2>
      <div v-if="!editMode" class="profile-view">
        <p><strong>Nome:</strong> {{ userProfile.firstName }}</p>
        <p><strong>Sobrenome:</strong> {{ userProfile.lastName }}</p>
        <p><strong>Nome Social:</strong> {{ userProfile.socialName }}</p>
        <p><strong>Gênero:</strong> {{ userProfile.gender }}</p>
        <p><strong>CPF:</strong> {{ userProfile.cpf }}</p>
        <button class="btn btn-primary" @click="toggleEditMode">Editar</button>
      </div>
      <form v-else @submit.prevent="updateUserProfile" class="profile-edit">
        <div>
          <label for="firstName">Nome:</label>
          <input id="firstName" v-model="userProfile.firstName" type="text">
        </div>
        <div>
          <label for="socialName">Nome Social:</label>
          <input id="socialName" v-model="userProfile.socialName" type="text">
        </div>
        <div>
          <label for="lastName">Sobrenome:</label>
          <input id="lastName" v-model="userProfile.lastName" type="text">
        </div>
        <div>
          <label for="gender">Gênero:</label>
          <select id="gender" v-model="userProfile.gender">
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Não-Binário</option>
            <option>Prefiro não informar</option>
          </select>
        </div>
        <button class="btn btn-success" type="submit">Salvar Alterações</button>
        <button class="btn btn-secondary" @click="toggleEditMode">Cancelar</button>
      </form>
    </div>

    <div v-if="showSection === 'pets'" class="pets-section">
      <h2 class="text-center">Gerenciar Pets</h2>
      <ul class="list-group">
        <li class="list-group-item" v-for="pet in pets" :key="pet.id">
          {{ pet.name }} - {{ pet.type }} - {{ pet.breed }} - {{ pet.gender }} - {{ pet.age }}
          <button class="btn btn-sm btn-outline-secondary" @click="editPet(pet)">Editar</button>
        </li>
      </ul>
      <button class="btn btn-primary" @click="addPet">Adicionar Pet</button>
    </div>
  </div>
</template>




<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'PetOwnerProfile',
  setup() {
    const showSection = ref('profile');
    const editMode = ref(false);  // Assegura que editMode é reativo e bem definido
    const userProfile = ref({
      uid: null,
      firstName: '',
      lastName: '',
      socialName: '',
      gender: '',
      cpf: ''
    });
    const pets = ref([]);
    const auth = getAuth();

    onMounted(async () => {
      if (auth.currentUser) {
        userProfile.value.uid = auth.currentUser.uid;
        await fetchUserData();
        await fetchPets();
      }
    });

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const fetchUserData = async () => {
      const userRef = doc(db, "users", userProfile.value.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userProfile.value = { ...userSnap.data(), uid: userProfile.value.uid };
      } else {
        console.error("No such document!");
      }
    };

    const updateUserProfile = async () => {
      const userRef = doc(db, "users", userProfile.value.uid);
      await updateDoc(userRef, {
        firstName: userProfile.value.firstName,
        lastName: userProfile.value.lastName,
        socialName: userProfile.value.socialName,
        gender: userProfile.value.gender
      });
      editMode.value = false;  // Corrige a gestão do estado após a atualização
    };

    const fetchPets = async () => {
      const petsCollection = collection(db, `users/${userProfile.value.uid}/pets`);
      const petSnapshot = await getDocs(petsCollection);
      pets.value = petSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    return {
      showSection,
      userProfile,
      pets,
      editMode,  // Não esqueça de retornar editMode aqui
      toggleEditMode,
      updateUserProfile,
      fetchPets
    };
  }
};
</script>





<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.text-center {
  text-align: center;
}

.button-group {
  margin-bottom: 1rem;
}

.profile-view p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.profile-edit input,
.profile-edit select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pets-section {
  margin-top: 1rem;
}

.btn-outline-primary, .btn-outline-info {
  margin-right: 0.5rem;
}

.btn-primary, .btn-success, .btn-secondary {
  margin-top: 1rem;
}
</style>
