<template>
  <div class="profile-container">
    <h1 class="text-center">Meu Perfil</h1>

    <div v-if="showSection === 'profile'">
      <h2 class="text-center">Perfil</h2>
      <div v-if="!editMode" class="profile-view">
        <p><strong>Nome:</strong> {{ userProfile.firstName }}</p>
        <p><strong>Sobrenome:</strong> {{ userProfile.lastName }}</p>
        <p><strong>Nome Social:</strong> {{ userProfile.socialName || 'Não informado' }}</p>
        <p><strong>Gênero:</strong> {{ userProfile.gender }}</p>
        <p><strong>CPF:</strong> {{ userProfile.cpf }}</p>
        <p><strong>CRM:</strong> {{ userProfile.crm }}</p>

        <button class="btn btn-primary" @click="toggleEditMode">Editar</button>
      </div>

      <!-- Formulário de edição do perfil -->
      <form v-else @submit.prevent="updateUserProfile" class="profile-edit">
        <div>
          <label for="firstName">Nome:</label>
          <input
            id="firstName"
            v-model="userProfile.firstName"
            type="text"
            @input="validateForm"
            placeholder="Digite apenas letras"
          >
          <div v-if="errorMessages.firstName" class="error">Nome deve conter apenas letras.</div>
        </div>
        <div>
          <label for="lastName">Sobrenome:</label>
          <input
            id="lastName"
            v-model="userProfile.lastName"
            type="text"
            @input="validateForm"
            placeholder="Digite apenas letras"
          >
          <div v-if="errorMessages.lastName" class="error">Sobrenome deve conter apenas letras.</div>
        </div>
        <div>
          <label for="socialName">Nome Social:</label>
          <input
            id="socialName"
            v-model="userProfile.socialName"
            type="text"
            @input="validateForm"
            placeholder="Digite apenas letras ou deixe em branco"
          >
          <div v-if="errorMessages.socialName" class="error">Nome social deve conter apenas letras.</div>
        </div>
        <div>
          <label for="cpf">CPF:</label>
          <input
            id="cpf"
            v-model="userProfile.cpf"
            type="text"
            @input="validateForm"
            maxlength="11"
            placeholder="Digite exatamente 11 números"
          >
          <div v-if="errorMessages.cpf" class="error">CPF deve conter exatamente 11 dígitos numéricos.</div>
        </div>
        <div>
          <label for="crm">CRM:</label>
          <input
            id="crm"
            v-model="userProfile.crm"
            type="text"
            @input="validateForm"
            placeholder="Digite apenas números"
          >
          <div v-if="errorMessages.crm" class="error">CRM deve conter apenas números.</div>
        </div>
        <div>
          <label for="gender">Gênero:</label>
          <select id="gender" v-model="userProfile.gender" @change="validateForm">
            <option value="">Selecione</option>
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Não-Binário</option>
            <option>Prefiro não informar</option>
          </select>
          <div v-if="errorMessages.gender" class="error">Por favor, selecione uma opção de gênero.</div>
        </div>
        <button class="btn btn-success" type="submit" :disabled="!isFormValid">Salvar Alterações</button>
        <button class="btn btn-secondary" @click="toggleEditMode">Cancelar</button>
        <div v-if="saveSuccess" class="alert alert-success">Alterações salvas com sucesso!</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { getAuth } from 'firebase/auth';

export default {
  name: 'PetOwnerProfile',
  setup() {
    const showSection = ref('profile');
    const userProfile = reactive({
      uid: '',
      firstName: '',
      lastName: '',
      socialName: '',
      gender: '',
      cpf: '',
      crm: '',
      userType: ''
    });

    const editMode = ref(false);
    const saveSuccess = ref(false);

    const errorMessages = reactive({
      firstName: false,
      lastName: false,
      socialName: false,
      cpf: false,
      crm: false,
      gender: false
    });

    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        userProfile.uid = user.uid;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          Object.assign(userProfile, userSnap.data());
        } else {
          console.error('Usuário não encontrado no banco de dados.');
        }
      } else {
        console.error('Usuário não autenticado.');
      }
    };

    onMounted(fetchUserData);

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const validateForm = () => {
      errorMessages.firstName = !userProfile.firstName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/);
      errorMessages.lastName = !userProfile.lastName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/);
      errorMessages.socialName = userProfile.socialName && !userProfile.socialName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]*$/);
      errorMessages.cpf = !userProfile.cpf.match(/^\d{11}$/);
      errorMessages.crm = !userProfile.crm.match(/^\d+$/);
      errorMessages.gender = !userProfile.gender;

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
          cpf: userProfile.cpf,
          crm: userProfile.crm
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
