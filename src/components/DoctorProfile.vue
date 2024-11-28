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
          <label for="specialty" class="label">Especialidade:</label>
          <input id="specialty" v-model="userProfile.specialty" type="text" @input="validateForm" placeholder="Especialidade">
        </div>
        <div>
          <label for="contact" class="label">Contato:</label>
          <input id="contact" v-model="userProfile.contact" type="text" @input="validateForm" placeholder="Telefone ou email">
        </div>
        <div>
          <label for="workingHours" class="label">Horários de Atendimento:</label>
          <input id="workingHours" v-model="userProfile.workingHours" type="text" @input="validateForm" placeholder="Horários disponíveis">
        </div>
        <div>
          <label for="officeAddress" class="label">Endereço do Consultório:</label>
          <input id="officeAddress" v-model="userProfile.officeAddress" type="text" @input="validateForm" placeholder="Endereço completo">
        </div>
        <div class="button-container">
         <button class="btn btn-success" type="submit" :disabled="!isFormValid">Salvar Alterações</button>
         <button class="btn btn-cancel" @click="toggleEditMode">Cancelar</button>
        </div>
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

   // Funções de formatação
const formatCPF = (cpf) => {
  return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
};

const formatCRMV = (crmv) => {
  return crmv ? crmv.slice(0, 5).padStart(5, '0') : '';  // Garante apenas 5 dígitos
};

const formatContact = (contact) => {
  if (contact && contact.length === 11) {  // Verifica se o contato possui 11 dígitos, comum para celulares no Brasil
    return `(${contact.slice(0, 2)}) ${contact.slice(2, 7)}-${contact.slice(7)}`;
  } else if (contact && contact.length === 10) {  // Formato para telefones fixos
    return `(${contact.slice(0, 2)}) ${contact.slice(2, 6)}-${contact.slice(6)}`;
  }
  return contact;  // Retorna o contato original se não atender aos critérios anteriores
};

    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        userProfile.uid = user.uid;
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          let userData = userSnap.data();
          userData.cpf = formatCPF(userData.cpf);
          userData.crmv = formatCRMV(userData.crmv);
          userData.contact = formatContact(userData.contact);
          Object.assign(userProfile, userData);
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
  background-color: #fafafa;
  border-radius: 20px;
  box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.2);
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
  border: 1px solid #75cfcf;
  border-radius: 1.5rem;
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

.label {
  margin-top: 0.5rem;
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

.edit-button:hover {
  background-color: #5bb6b6;
  border-color: #5bb6b6;
  color:white
}

.button-container {
  display: flex;
  justify-content: center; /* Alinha os itens ao centro horizontalmente */
  padding: 10px; /* Espaçamento dentro do contêiner */
}

.btn-success {
  border-radius: 30px;
  margin: 20px 20px;
  font-weight: bold;
  background-color: #75cfcf;
  color: white;
  border-color: #75cfcf;
  text-decoration: none;
}

.btn-success:hover {
  background-color: #5bb6b6;
  border-color: #5bb6b6;
  color:white
}

.btn-cancel {
  border-radius: 30px;
  margin: 20px 20px;
  font-weight: bold;
  background-color: #adadad;
  border-color: #adadad;
  color: white;
  text-decoration: none;
}

.btn-cancel:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color:white
}

.alert {
  border-radius: 30px;
  color: #358080;
  font-size: 0.9em;
  margin-top: 0.5rem;
}
</style>