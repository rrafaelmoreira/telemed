<template>
  <div>
    <!-- Header -->
    <HeaderComponent />

    <!-- Perfil do Médico -->
    <section class="medico-apresentacao bg-light rounded-4">
      <div class="container-fluid py-5">
        <div class="row">
          <!-- Card Principal: Informações e Apresentação -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0 mx-auto h-100">
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
                    <h3 class="fw-bold text-start">Dr. Renato Capeci</h3>
                    <div class="row">
                      <div class="col">
                        <p class="text-muted mb-1 text-start">
                          Médico Cardiologista
                        </p>
                      </div>
                      <div class="col">
                        <p class="text-muted mb-0 text-start">CRMV: 123456</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                    <h5 class="fw-bold text-start">Apresentação</h5>
                    <p class="text-start">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nulla nec purus feugiat, vestibulum mi nec, ultricies
                      metus. Sed at metus lacinia, aliquet arcu porttitor.
                    </p>
                  </div>
                </div>
                <hr>
                <div class="row">
                <div class="col-12">
                  <h5 class="fw-bold text-start">Formação</h5>
                </div>
              </div>
              </div>
             
              
              <!-- Formação -->
            <div class="card shadow-sm border-0 mx-auto mb-4">
              <div class="card-body">
                <h5 class="fw-bold">Formação</h5>
                <ul class="list-unstyled">
                  <li>
                    <i class="bi bi-circle-fill text-primary me-2"></i>
                    Medicina - USP (2004)
                  </li>
                  <li>
                    <i class="bi bi-circle-fill text-primary me-2"></i>
                    Residência em Cardiologia - Hospital das Clínicas (2008)
                  </li>
                  <li>
                    <i class="bi bi-circle-fill text-primary me-2"></i>
                    Especialização em Arritmias Cardíacas (2012)
                  </li>
                </ul>
              </div>
            </div>
            </div>
          </div>

          <!-- Card Secundário: Horários Disponíveis -->
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
      newSchedule: "", // Campo para o novo horário
      schedules: [], // Lista de horários disponíveis
    };
  },
  methods: {
    addSchedule() {
      if (this.newSchedule) {
        this.schedules.push(this.newSchedule); // Adiciona o novo horário à lista
        this.newSchedule = ""; // Limpa o campo após adicionar
      }
    },
    removeSchedule(index) {
      this.schedules.splice(index, 1); // Remove o horário da lista
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

button {
  font-size: 0.9rem;
}
</style>