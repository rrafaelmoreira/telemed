<template>
  <div>
    <HeaderComponent />
    <section class="medico-apresentacao bg-light rounded-4">
      <div class="container-fluid py-5">
        <div class="row">
          <!-- Card Principal: Informações do Médico -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0 mx-auto h-100">
              <div class="card-body">
                <!-- Foto e Informações -->
                <div class="row align-items-center mb-4">
                  <div class="col-md-2 text-center">
                    <img src="@/assets/medico_perfil.jpg" alt="Foto do Médico" class="rounded-circle border" width="100"
                      height="120" />
                  </div>
                  <div class="col-md-8">
                    <h3 class="fw-bold text-start">Dr. {{ userProfile.fullName }}</h3>
                    <p class="text-muted mb-0 text-start">Nome social: {{ userProfile.socialName }}</p>
                    <p class="text-muted mb-0 text-start">Especialidade: {{ userProfile.specialty }}</p>
                    <p class="text-muted mb-0 text-start">CRMV: {{ userProfile.crmv }}</p>
                    <p class="text-muted mb-0 text-start">CPF: {{ userProfile.cpf }}</p>
                    <p class="text-muted mb-0 text-start">{{ userProfile.email }}</p>
                  </div>
                  <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-primary"
                      @click="openEditModal('Informações Pessoais')">Editar</button>
                  </div>
                </div>
                <hr />

                <!-- Biografia -->
                <div>
                  <div class="row">
                    <div class="col-md-10">
                      <h5 class="fw-bold text-start">Biografia</h5>
                      <p class="text-start">{{ userProfile.bio }}</p>
                    </div>
                    <div class="col-md-2 text-center">
                      <button class="btn btn-sm btn-outline-primary" @click="openEditModal('Biografia')">Editar</button>
                    </div>
                  </div>
                </div>
                <hr />

                <!-- Qualificações -->
                <div class="row">
                  <div class="col-md-10">
                    <h5 class="fw-bold text-start">Qualificações</h5>
                    <ul class="list-unstyled">
                      <li v-for="(formacao, index) in userProfile.qualifications" :key="index" class="text-start">
                        <i class="bi bi-circle-fill text-primary me-2"></i>{{ formacao }}
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-primary"
                      @click="openEditModal('Qualificações')">Editar</button>
                  </div>
                </div>
                <hr />

                <!-- Contato -->
                <div class="row">
                  <div class="col-md-10">
                    <h5 class="fw-bold text-start">Contato</h5>
                    <p class="text-start"><i class="bi bi-clock-fill text-primary me-2"></i>Horário de atendimento: {{
                      userProfile.contact.workingHours }}</p>
                    <p class="text-start"><i class="bi bi-geo-fill text-primary me-2"></i>{{
                      userProfile.contact.officeAddress }}</p>
                    <p class="text-start"><i class="bi bi-telephone-fill text-primary me-2"></i>{{
                      userProfile.contact.tel }}</p>
                  </div>
                  <div class="col-md-2">
                    <button class="btn btn-sm btn-outline-primary" @click="openEditModal('Contato')">Editar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Secundário: Agenda -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0 mx-auto h-100">
              <div class="card-body">
                <DoctorAgenda />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h5>{{ modalTitle }}</h5>
          <button @click="closeModal" class="btn-close"></button>
        </div>
        <!--Modal para Informações Pessoais-->
        <div v-if="modalTitle == 'Editar Informações Pessoais'" class="modal-body">
          <div class="mb-3 text-start">
            <label for="Nome" class="form-label">Nome: </label>
            <input v-model="modalContent.fullName" class="form-control" />
          </div>

          <div class="mb-3 text-start">
            <label for="nomeSocial" class="form-label">Nome Social:</label>
            <input v-model="modalContent.socialName" class="form-control" />
          </div>

          <div class="mb-3 text-start">
            <label for="especialidade" class="form-label">Especialidade:</label>
            <input v-model="modalContent.specialty" class="form-control" />
          </div>

          <div class="mb-3 text-start">
            <label for="crmv" class="form-label">CRMV:</label>
            <input v-model="modalContent.crmv" class="form-control" />
          </div>

          <div class="mb-3 text-start">
            <label for="cpf" class="form-label">CPF:</label>
            <input v-model="modalContent.cpf" class="form-control" />
          </div>

          <div class="mb-3 text-start">
            <label for="email" class="form-label">E-mail:</label>
            <input v-model="modalContent.email" class="form-control" />

          </div>
        </div>
        <!-- Modal para Biografia -->
        <div v-if="modalTitle === 'Editar Biografia'" class="modal-body">
          <textarea v-model="modalContent" class="form-control" rows="5"></textarea>
        </div>

        <!-- Modal para Qualificações -->
        <div v-if="modalTitle === 'Editar Qualificações'" class="modal-body">
          <div v-for="(formacao, index) in modalContent" :key="index" class="mb-3">
            <label :for="'formacao-' + index" class="form-label">Qualificação {{ index + 1 }}:</label>
            <input :id="'formacao-' + index" type="text" class="form-control" v-model="modalContent[index]" />
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="addNewFormacao">+ Adicionar
            Qualificação</button>
        </div>

        <!-- Modal para Contato -->
        <div v-if="modalTitle === 'Editar Contato'" class="modal-body">
          <div class="mb-3 text-start">
            <label for="workingHours" class="form-label">Horário de Atendimento:</label>
            <input id="workingHours" type="text" class="form-control" v-model="modalContent.workingHours" />
          </div>
          <div class="mb-3 text-start">
            <label for="officeAddress" class="form-label">Endereço:</label>
            <input id="officeAddress" type="text" class="form-control" v-model="modalContent.officeAddress" />
          </div>
          <div class="mb-3 text-start">
            <label for="tel" class="form-label">Telefone:</label>
            <input id="tel" type="text" class="form-control" v-model="modalContent.tel" />
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-gradient" @click="saveChanges">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import HeaderComponent from "@/components/HeaderComponent.vue";
import DoctorAgenda from "./DoctorAgenda.vue";

export default {
  components: { HeaderComponent, DoctorAgenda },
  setup() {
    const userProfile = reactive({
      uid: "",
      fullName: "",
      socialName: "",
      specialty: "",
      crmv: "",
      cpf: "",
      bio: "",
      qualifications: [],
      email: "",
      contact: {
        workingHours: "",
        officeAddress: "",
        tel: "",
      },
    });

    const isModalOpen = ref(false);
    const modalTitle = ref("");
    const modalContent = ref([]);
    const modalTarget = ref("");

    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        userProfile.uid = user.uid;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          Object.assign(userProfile, userSnap.data());
        }
      }
    };

    const openEditModal = (target) => {
      modalTarget.value = target;
      modalTitle.value = `Editar ${target}`;

      if (target === "Biografia") {
        modalContent.value = userProfile.bio;
      } else if (target === "Qualificações") {
        modalContent.value = [...userProfile.qualifications];
      } else if (target === "Contato") {
        modalContent.value = {
          workingHours: userProfile.contact.workingHours,
          officeAddress: userProfile.contact.officeAddress,
          tel: userProfile.contact.tel,
        };

      } else if (target === "Informações Pessoais") {
        modalContent.value = {
          fullName: userProfile.fullName,
          socialName: userProfile.socialName,
          specialty: userProfile.specialty,
          crmv: userProfile.crmv,
          cpf: userProfile.cpf,
          email: userProfile.email,
        };
      }

      isModalOpen.value = true;
    };

    const saveChanges = async () => {
      const userRef = doc(db, "users", userProfile.uid);

      if (modalTarget.value === "Biografia") {
        userProfile.bio = modalContent.value;
      } else if (modalTarget.value === "Qualificações") {
        userProfile.qualifications = modalContent.value.filter((q) => q.trim() !== "");
      } else if (modalTarget.value === "Contato") {
        Object.assign(userProfile.contact, modalContent.value);

      } else if (modalTarget.value === "Informações Pessoais") {
        Object.assign(userProfile, modalContent.value);
      }

      try {
        await updateDoc(userRef, { ...userProfile });
        closeModal();
      } catch (error) {
        console.error("Erro ao salvar:", error);
      }
    };

    const addNewFormacao = () => {
      modalContent.value.push(""); // Adiciona uma nova qualificação
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    onMounted(fetchUserData);

    return {
      userProfile,
      isModalOpen,
      modalTitle,
      modalContent,
      modalTarget,
      openEditModal,
      saveChanges,
      addNewFormacao,
      closeModal,
    };
  },
};
</script>

<style scoped>
.medico-apresentacao {
  background-color: #f8f9fa;
  width: 100%;
  min-width: 80vw;
  padding: 20px;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 15px;
}

img {
  object-fit: cover;
  border: 3px solid #eaeaea;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}
</style>