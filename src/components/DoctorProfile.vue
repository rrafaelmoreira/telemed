<template>
  <div>
    <!-- Header -->
    <HeaderComponent />

    <!-- Perfil do Médico -->
    <section class="medico-apresentacao bg-light rounded-4">
      <div class="container-fluid py-5">
        <div class="row g-4">
          <!-- Card Principal: Informações e Apresentação -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body">
                <div class="row align-items-center">
                  <!-- Foto do Médico -->
                  <div class="col-md-3 text-center">
                    <img
                      src="@/assets/medico_perfil.jpg"
                      alt="Foto do Médico"
                      class="rounded-circle border"
                      width="100"
                      height="120"
                    />
                  </div>

                  <!-- Informações do Médico -->
                  <div class="col-md-9">
                    <h3 class="fw-bold text-start">Dr. Nome do Médico</h3>
                    <p class="text-muted mb-0 text-start">CRMV: 123456</p>
                  </div>
                </div>
                <hr />

                <!-- Apresentação -->
                <div class="section-content">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold text-start">Apresentação</h5>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openModal('apresentacao')"
                    >
                      Editar
                    </button>
                  </div>
                  <p class="text-start mt-2">{{ apresentacao }}</p>
                </div>
                <hr />

                <!-- Formação -->
                <div class="section-content">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold text-start">Formação</h5>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openModal('formacao')"
                    >
                      Editar
                    </button>
                  </div>
                  <ul class="list-unstyled mt-2">
                    <li
                      v-for="(formacao, index) in formacoes"
                      :key="index"
                      class="d-flex align-items-center"
                    >
                      <i class="bi bi-circle-fill text-primary me-2"></i>
                      {{ formacao }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Secundário: Horários Disponíveis -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0 h-100">
              <div class="card-body">
                <DoctorAgenda />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <!-- Modal para edição -->
    <div v-if="isModalOpen" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title">
              <h5>{{ modalTitle }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>


   <!-- <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h5>{{ modalTitle }}</h5>
          <button @click="closeModal" class="btn-close">X</button>
        </div>
        <div class="modal-body">
          <textarea v-model="modalContent" class="form-control" rows="5"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="saveChanges">Salvar</button>
        </div>
      </div>
    </div>
    -->
  </div>

</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import DoctorAgenda from "./DoctorAgenda.vue";

export default {
  components: {
    HeaderComponent,
    DoctorAgenda,
  },
  data() {
    return {
      apresentacao:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultricies metus.",
      formacoes: [
        "Medicina - USP (2004)",
        "Residência em Cardiologia - Hospital das Clínicas (2008)",
        "Especialização em Arritmias Cardíacas (2012)",
      ],
      modalTitle: "",
      modalContent: "",
      modalTarget: "",
      isModalOpen: false, // Controle para abrir e fechar o modal
    };
  },
  methods: {
    openModal(target) {
      if (target === "apresentacao") {
        this.modalTitle = "Editar Apresentação";
        this.modalContent = this.apresentacao;
        this.modalTarget = "apresentacao";
      } else if (target === "formacao") {
        this.modalTitle = "Editar Formação";
        this.modalContent = this.formacoes.join("\n");
        this.modalTarget = "formacao";
      }
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    saveChanges() {
      if (this.modalTarget === "apresentacao") {
        this.apresentacao = this.modalContent;
      } else if (this.modalTarget === "formacao") {
        this.formacoes = this.modalContent.split("\n").filter((line) => line);
      }
      this.closeModal();
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #b2dbd3, #4a7c59);
}

.medico-apresentacao {
  background-color: #f8f9fa;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
