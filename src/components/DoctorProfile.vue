<template>
  <div class="doctorProfile-page d-flex justify-content-center align-items-center">
  <div class="profile-container">

    <div v-if="showSection === 'profile'">
      <div v-if="!editMode" class="profile-view">
        <div row d-flex align-items-center>
          <div class="col text-start"><strong>Nome Completo:</strong> {{ userProfile.firstName }} {{ userProfile.lastName }}</div>
          <div v-if="userProfile.socialName" class="row d-inline ms-3"><strong>Nome Social:</strong> {{ userProfile.socialName || 'Não informado' }}</div>
        </div>
        <div class="row d-flex align-items-center justify-content-start gap-3">
          <div class="col-auto"><strong>Gênero:</strong> {{ userProfile.gender }}</div>   
          <div class="col-auto"><strong>CPF:</strong> {{ userProfile.cpf }}</div>
          <div class="col-auto"><strong>CRMV:</strong> {{ userProfile.crm }}</div>
        </div>
        <div>
          <div class="col text-start"><strong>Especialidade:</strong> {{ userProfile.specialty }}</div>
        </div>
        <div class="row d-flex align-items-center justify-content-start gap-2">
          <div class="col-auto"><strong>Contato:</strong> {{ userProfile.contact }}</div>
          <div class="col-auto"><strong>Horários de Atendimento:</strong> {{ userProfile.workingHours }}</div>
        </div>
        <div class="col text-start"><strong>Endereço:</strong> {{ userProfile.officeAddress }}</div>
        <button class="btn edit-button" @click="toggleEditMode">Editar</button>
      </div>

      <!-- Formulário de edição do perfil -->
      <form v-else @submit.prevent="updateUserProfile" class="profile-edit">
        <input-fields />
        <div>
          <label for="specialty">Especialidade:</label>
          <input id="specialty" v-model="userProfile.specialty" type="text" @input="validateForm" placeholder="Especialidade">
        </div>
        <div>
          <label for="contact">Contato:</label>
          <input id="contact" v-model="userProfile.contact" type="text" @input="validateForm" placeholder="Telefone ou email">
        </div>
        <div>
          <label for="workingHours">Horários de Atendimento:</label>
          <input id="workingHours" v-model="userProfile.workingHours" type="text" @input="validateForm" placeholder="Horários disponíveis">
        </div>
        <div>
          <label for="officeAddress">Endereço do Consultório:</label>
          <input id="officeAddress" v-model="userProfile.officeAddress" type="text" @input="validateForm" placeholder="Endereço completo">
        </div>
        <button class="btn btn-success" type="submit" :disabled="!isFormValid">Salvar Alterações</button>
        <button class="btn btn-secondary" @click="toggleEditMode">Cancelar</button>
        <div v-if="saveSuccess" class="alert alert-success">Alterações salvas com sucesso!</div>
      </form>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { getAuth } from 'firebase/auth';

export default {
  name: 'DoctorProfile',
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
      specialty: '',
      contact: '',
      workingHours: '',
      officeAddress: ''
    });

    const editMode = ref(false);
    const saveSuccess = ref(false);

    const errorMessages = reactive({
      firstName: false,
      lastName: false,
      socialName: false,
      cpf: false,
      crm: false,
      gender: false,
      // Adicionar validações para os novos campos aqui conforme necessário
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
      // Adicionar validações para os novos campos aqui
      return !Object.values(errorMessages).some(Boolean);
    };

    const updateUserProfile = async () => {
      if (!validateForm()) {
        alert('Por favor, corrija os erros antes de salvar.');
        return;
      }

      const userRef = doc(db, "users", userProfile.uid);
      try {
        await updateDoc(userRef, userProfile);
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

.doctorProfile-page {
  background: url('~@/assets/background.jpg') repeat center fixed;
  height: 100vh;
}

.profile-container {
  max-width: 800px; /* Ajustado para acomodar mais campos */
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

.profile-edit input[type="text"],
.profile-edit input[type="number"],
.profile-edit select,
.profile-edit textarea {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}

.profile-edit textarea {
  height: 100px; /* Espaço adequado para descrição e qualificações */
}

.error {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}

.btn {
  margin-top: 0.5rem;
  cursor: pointer;
}

.edit-button {
  border-radius: 30px;
  padding: 10px;
  font-weight: bold;
  background-color: #75cfcf;
  color: white;
  border-color: #75cfcf;
  text-decoration: none;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.alert {
  color: green;
  font-size: 0.9em;
  margin-top: 0.5rem;
}
</style>