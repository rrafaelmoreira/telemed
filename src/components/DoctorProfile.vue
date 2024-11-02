<template>
  <!-- Container principal para o perfil do usuário -->
  <div class="profile-container">
    <!-- Título centralizado -->
    <h1 class="text-center">Meu Perfil</h1>
    <!-- Grupo de botões para alternar entre perfil e pets -->
    <div class="button-group text-center">
      <button class="btn btn-outline-primary" @click="showSection = 'profile'">Perfil</button>
    </div>

   <!-- Seção do perfil do usuário -->
        <div v-if="showSection === 'profile'">
          <h2 class="text-center">Perfil</h2>
          <!-- Visualização do perfil -->
          <div v-if="!editMode" class="profile-view">
            <p><strong>Nome:</strong> {{ userProfile.firstName }}</p>
            <p><strong>Sobrenome:</strong> {{ userProfile.lastName }}</p>
            <p><strong>Nome Social:</strong> {{ userProfile.socialName || 'Não informado' }}</p>
            <p><strong>Gênero:</strong> {{ userProfile.gender }}</p>
            <p><strong>CPF:</strong> {{ userProfile.cpf }}</p>
            <p><strong>CRM:</strong> {{ userProfile.crm }}</p>
            <p><strong>Tipo de Usuário:</strong> {{ userProfile.userType }}</p>
        <button class="btn btn-primary" @click="toggleEditMode">Editar</button>
      </div>
      <!-- Formulário de edição do perfil -->
      <form v-else @submit.prevent="updateUserProfile" class="profile-edit">
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
          <select id="gender" v-model="userProfile.gender">
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Não-Binário</option>
            <option>Prefiro não informar</option>
          </select>
        </div>
        <button class="btn btn-success" type="submit" :disabled="!isFormValid">Salvar Alterações</button>
        <button class="btn btn-secondary" @click="toggleEditMode">Cancelar</button>
        <!-- Mensagem de sucesso após salvar as alterações -->
        <div v-if="saveSuccess" class="alert alert-success">Alterações salvas com sucesso!</div>
      </form>
    </div>

    <!-- Seção para gerenciar pets -->
    <div v-if="showSection === 'pets'" class="pets-section">
      <h2 class="text-center">Gerenciar Pets</h2>
      <ul class="list-group">
        <li class="list-group-item" v-for="pet in pets" :key="pet.id">
          {{ pet.name }} - {{ pet.type }} - {{ pet.breed }} - {{ pet.gender }} - {{ pet.age }}
          <button class="btn btn-sm btn-outline-secondary" @click="editPet(pet)">Editar</button>
        </li>
      </ul>
      <button class="btn btn-primary" @click="showPetProfile = true">Adicionar Pet</button>
      <pet-profile v-if="showPetProfile" @close="showPetProfile = false"></pet-profile>
    </div>
  </div>
</template>



<script>
import { ref, onMounted, reactive,computed  } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import PetProfile from './Petprofile.vue';  // Correção para o caminho correto, se necessário


export default {
  name: 'PetOwnerProfile',
  components: {
    PetProfile
  },
  setup() {
    const auth = getAuth();
    const showSection = ref('profile');  // Controla a seção visível
   const userProfile = reactive({      
       uid: '',
       firstName: '',
       lastName: '',
       socialName: '',
       gender: '',
       cpf: '',
       crm: '',       // Adiciona o campo CRM
       userType: ''   // Adiciona o campo Tipo de Usuário
});

   
    const pets = ref([]);               // Armazena os dados dos pets
    const editMode = ref(false);        // Controla o modo de edição do perfil
    const saveSuccess = ref(false);     // Indica se as alterações foram salvas com sucesso
    const showPetProfile = ref(false);

    // Busca os dados do usuário
    const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        Object.assign(userProfile, userSnap.data());
    } else {
        console.error("No such document!");
    }
};

   // Busca os dados dos pets
   const fetchPets = async (uid) => {
      const petsCollection = collection(db, `users/${uid}/pets`);
      const petSnapshot = await getDocs(petsCollection);
      pets.value = petSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };




    // Carrega os dados do usuário e dos pets ao montar o componente
    onMounted(async () => {
    if (auth.currentUser) {
        userProfile.uid = auth.currentUser.uid;
        await fetchUserData(userProfile.uid);
        await fetchPets(userProfile.uid);
    } else {
        console.error("Usuário não autenticado ou indisponível");
    }
});
    
    // Validação dos campos do formulário
    const errorMessages = reactive({
      firstName: false,
      lastName: false,
      socialName: false,
      cpf: false
    });

 

    // Alterna o modo de edição
    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    // Valida os campos do formulário antes de salvar
    const validateForm = () => {
  const errors = {
    firstName: !userProfile.value.firstName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/),
    lastName: !userProfile.value.lastName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]+$/) || userProfile.value.lastName.trim() === '',
    socialName: userProfile.value.socialName && !userProfile.value.socialName.match(/^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕçÇ\s]*$/),
    cpf: !userProfile.value.cpf.match(/^\d{11}$/)
  };
  // Atualiza os estados de erro no objeto de erros
  Object.keys(errors).forEach(key => {
    errorMessages[key] = errors[key];
  });
  // Retorna false se algum valor de erro for verdadeiro
  return !Object.values(errors).some(Boolean);
};

    // Atualiza os dados do perfil do usuário
    const updateUserProfile = async () => {
      if (!validateForm()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const userRef = doc(db, "users", userProfile.value.uid);
      try {
        await updateDoc(userRef, {
          firstName: userProfile.value.firstName,
          lastName: userProfile.value.lastName,
          socialName: userProfile.value.socialName,
          gender: userProfile.value.gender,
          cpf: userProfile.value.cpf
        });
        saveSuccess.value = true;  // Mostra a mensagem de sucesso
        setTimeout(() => {
          saveSuccess.value = false;  // Esconde a mensagem após um tempo
          editMode.value = false;     // Sai do modo de edição
        }, 1000);
      } catch (error) {
        console.error("Falha ao atualizar o perfil:", error);
      }
    };

    // Retorna dados e métodos para serem usados no template
    return {
      userProfile,
      pets,
      editMode,
      showSection,
      showPetProfile,
      saveSuccess,
      updateUserProfile,
      toggleEditMode,
      fetchUserData,
      fetchPets,
      validateForm,
      errorMessages: reactive({
        firstName: false,
        lastName: false,
        socialName: false,
        cpf: false
      }),
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
.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 0.75rem 1.25rem;
  margin-top: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.error {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
