<template>
  <div class="agenda-container">
    <h1>Definir Disponibilidade</h1>
    <!-- Calendário -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modal para criar evento -->
    <div class="modal fade" id="addEventModal" tabindex="-1" aria-labelledby="addEventModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title" id="addEventModalLabel">Adicionar disponibilidade</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <!-- Formulário para criar evento -->
            <form @submit.prevent="addEvent">
              <div class="row mb-3">
                <div class="col-md-2">
                  <p for="eventDate" class="form-label">Data:</p>
                </div>
                <div class="col-md-10">
                  <input type="date" v-model="newEvent.date" class="form-control" required />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-2">
                  <p for="startTime" class="form-label">Início:</p>
                </div>
                <div class="col-md-10">
                  <input type="time" v-model="newEvent.startTime" class="form-control" required />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-2">
                  <p for="endTime" class="form-label">Término:</p>
                </div>
                <div class="col-md-10">
                  <input type="time" v-model="newEvent.endTime" class="form-control" required />
                </div>
              </div>
              <button type="submit" class="btn btn-gradient w-100 logcad-button">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <br>
    
    <!-- Botão para abrir o modal -->
    <button type="button" class="btn btn-gradient w-100 logcad-button" data-bs-toggle="modal" data-bs-target="#addEventModal">
      Adicionar Disponibilidade
    </button>
  </div>

</template>

<script>
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const calendarOptions = ref({
      themeSystem: "bootstrap5",
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      locales: allLocales,
      locale: "pt-br",
      headerToolbar: {
        left: "prev next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      },
      titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" },
      events: [], // Eventos adicionados aparecerão aqui
      allDaySlot: false, // Remove o campo "dia inteiro"
      weekends: false, // Remove o campo "domingo"
      slotDuration: "01:00:00", // Intervalos de 1 hora
      slotLabelInterval: "01:00:00", // Exibir rótulos a cada 1 hora

    });

    const newEvent = ref({
      date: "",
      startTime: "",
      endTime: "",
    });

    const currentEvents = ref([]);

    // Função para adicionar evento ao calendário
    const addEvent = () => {
      const { date, startTime, endTime } = newEvent.value;

      // Verifica se os dados estão completos
      if (!date || !startTime || !endTime) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      const start = `${date}T${startTime}:00`;
      const end = `${date}T${endTime}:00`;

      // Cria um novo evento
      const event = {
        title: "Disponível",
        start,
        end,
        color: "#88e1ff",
      };

      // Adiciona o evento ao calendário
      calendarOptions.value.events.push(event);
      currentEvents.value.push(event);

      // Limpa os campos do formulário
      newEvent.value = {
        date: "",
        startTime: "",
        endTime: "",
      };

    };

    return {
      calendarOptions,
      newEvent,
      addEvent,
    };
  },
};
</script>

<style scoped>
.agenda-container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
}

.fc .fc-event {
  background-color: #88e1ff !important;
  color: white !important;
  border-radius: 4px;
}
.modal-body form .form-label {
  display: flex;
  align-items: center; /* Alinha o texto verticalmente no meio */
  margin-bottom: 0; /* Remove margens 1extras */
  height: 100%; /* Certifica-se de ocupar toda a altura */
}

.modal-body form .form-control {
  margin-top: 5px; /* Ajusta o espaçamento entre o label e o campo */
}

</style>
