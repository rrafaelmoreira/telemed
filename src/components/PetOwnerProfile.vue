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
        <p><strong>Nome:</strong> {{ userProfile?.firstName }}</p>
        <p><strong>Sobrenome:</strong> {{ userProfile?.lastName }}</p>
        <p><strong>Nome Social:</strong> {{ userProfile?.socialName || 'Não informado' }}</p>
        <p><strong>Gênero:</strong> {{ userProfile?.gender }}</p>
        <p><strong>CPF:</strong> {{ userProfile?.cpf }}</p>
        <button class="btn btn-primary" @click="toggleEditMode">Editar</button>
      </div>

      <form v-else @submit.prevent="updateUserProfile" class="profile-edit">
        <div>
          <label for="firstName">Nome:</label>
          <input id="firstName" v-model="userProfile.firstName" type="text" @input="validateForm">
          <div v-if="errorMessages.firstName" class="error">Nome deve conter apenas letras e ser obrigatório.</div>
        </div>
        <div>
          <label for="lastName">Sobrenome:</label>
          <input id="lastName" v-model="userProfile.lastName" type="text" @input="validateForm">
          <div v-if="errorMessages.lastName" class="error">Sobrenome deve conter apenas letras e ser obrigatório.</div>
        </div>
        <div>
          <label for="socialName">Nome Social:</label>
          <input id="socialName" v-model="userProfile.socialName" type="text" @input="validateForm">
          <div v-if="errorMessages.socialName" class="error">Nome social deve conter apenas letras.</div>
        </div>
        <div>
          <label for="cpf">CPF:</label>
          <input id="cpf" v-model="userProfile.cpf" type="text" @input="validateForm">
          <div v-if="errorMessages.cpf" class="error">CPF deve conter exatamente 11 números.</div>
        </div>
        <div>
          <label for="gender">Gênero:</label>
          <select id="gender" v-model="userProfile.gender" @change="validateForm">
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Não-Binário">Não-Binário</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>
        <button class="btn btn-success" type="submit" :disabled="!isFormValid">Salvar Alterações</button>
        <button class="btn btn-secondary" @click="toggleEditMode">Cancelar</button>
        <div v-if="saveSuccess" class="alert alert-success">Alterações salvas com sucesso!</div>
      </form>
    </div>

    <div v-if="showSection === 'pets'" class="pets-section">
      <PetProfile :uid="userProfile.uid" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import PetProfile from './Petprofile.vue';

export default {
  name: 'PetOwnerProfile',
  components: { PetProfile },
  setup() {
    const auth = getAuth();
    const showSection = ref('profile');
    const userProfile = reactive({      
      uid: '',
      firstName: '',
      lastName: '',
      socialName: '',
      gender: '',
      cpf: ''
    });
    const pets = ref([]);
    const editMode = ref(false);  // Controla o modo de edição do perfil
    const saveSuccess = ref(false);

    const fetchUserData = async (uid) => {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        Object.assign(userProfile, userSnap.data());
      } else {
        console.error("No such document!");
      }
    };

    const fetchPets = async (uid) => {
      const petsCollection = collection(db, `users/${uid}/pets`);
      const petSnapshot = await getDocs(petsCollection);
      pets.value = petSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    watch(showSection, async (newSection) => {
      if (newSection === 'pets') {
        await fetchPets(userProfile.uid);
      }
    });

    onMounted(async () => {
      if (auth.currentUser) {
        userProfile.uid = auth.currentUser.uid;
        await fetchUserData(userProfile.uid);
        await fetchPets(userProfile.uid);
      } else {
        console.error("Usuário não autenticado ou indisponível");
      }
    });

    const errorMessages = reactive({
      firstName: false,
      lastName: false,
      socialName: false,
      cpf: false
    });

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const validateForm = () => {
      errorMessages.firstName = !userProfile.firstName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/);
      errorMessages.lastName = !userProfile.lastName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/) || userProfile.lastName.trim() === '';
      errorMessages.socialName = userProfile.socialName && !userProfile.socialName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]*$/);
      errorMessages.cpf = !userProfile.cpf.match(/^\d{11}$/);

      return !Object.values(errorMessages).some(Boolean);
    };

    const updateUserProfile = async () => {
      if (!validateForm()) {
        alert('Por favor, corrija os erros antes de salvar.');
        return;
      }

      const userRef = doc(db, "users", userProfile.uid);
      try {
        await updateDoc(userRef, {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          socialName: userProfile.socialName,
          gender: userProfile.gender,
          cpf: userProfile.cpf
        });
        saveSuccess.value = true;
        setTimeout(() => {
          saveSuccess.value = false;
          editMode.value = false;
        }, 1000);
      } catch (error) {
        console.error("Falha ao atualizar o perfil:", error);
      }
    };

    return {
      userProfile,
      pets,
      editMode,
      showSection,
      saveSuccess,
      updateUserProfile,
      toggleEditMode,
      validateForm,
      errorMessages,
      isFormValid: computed(() => validateForm())
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

.error {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
