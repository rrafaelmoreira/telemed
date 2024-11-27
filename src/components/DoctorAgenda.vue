<template>
  <div class="agenda-container">
    <h1>Definir Disponibilidade</h1>
    <!-- Calendário -->
    <FullCalendar :options="calendarOptions" />

    <!-- Modal para criar evento -->
    <div class="modal fade" id="eventModal" tabindex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form v-if="isCreatingEvent" @submit.prevent="addEvent">
              <div class="row mb-3">
                <label for="data" class="col-md-2 form-label">Data:</label>
                <div class="col-md-10">
                  <input type="date" v-model="newEvent.date" class="form-control" required />
                </div>
              </div>
              <div class="row mb-3">
                <label for="inicio" class="col-md-2 form-label">Início:</label>
                <div class="col-md-10">
                  <input type="time" v-model="newEvent.startTime" class="form-control" required />
                </div>
              </div>
              <div class="row mb-3">
                <label for="fim" class="col-md-2 form-label">Término:</label>
                <div class="col-md-10">
                  <input type="time" v-model="newEvent.endTime" class="form-control" required />
                </div>
              </div>
              <button type="submit" class="btn btn-gradient w-100 logcad-button">Salvar</button>
            </form>

            <div v-else>
              <p>Tem certeza de que deseja excluir este evento?</p>
              <button @click="deleteEvent" class="btn btn-danger w-100">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

export default {
  components: { FullCalendar },
  setup() {
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      locales: allLocales,
      locale: "pt-br",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      },
      titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" },
      selectable: true,
      editable: true,
      events: [],
      select: handleDateSelect,
      eventClick: handleEventClick,
    });

    const newEvent = ref({
      date: "",
      startTime: "",
      endTime: "",
    });

    const currentEventId = ref(null);
    const isCreatingEvent = ref(true);
    const modalTitle = ref("");

    // Abrir modal para criar evento
    function handleDateSelect(selectInfo) {
      const start = new Date(selectInfo.start);
      newEvent.value.date = start.toISOString().split("T")[0];
      newEvent.value.startTime = start.toTimeString().split(":").slice(0, 2).join(":");
      newEvent.value.endTime = new Date(selectInfo.end).toTimeString().split(":").slice(0, 2).join(":");

      isCreatingEvent.value = true;
      modalTitle.value = "Adicionar Disponibilidade";

      // Abre o modal
      const modal = new bootstrap.Modal(document.getElementById("eventModal"));
      modal.show();
    }

    // Abrir modal para remover evento
    function handleEventClick(clickInfo) {
      currentEventId.value = clickInfo.event.id;
      isCreatingEvent.value = false;
      modalTitle.value = "Remover Disponibilidade";

      // Abre o modal
      const modal = new bootstrap.Modal(document.getElementById("eventModal"));
      modal.show();
    }

    // Adicionar evento ao calendário
    function addEvent() {
      const { date, startTime, endTime } = newEvent.value;

      const start = `${date}T${startTime}:00`;
      const end = `${date}T${endTime}:00`;

      const event = {
        id: Date.now().toString(), // ID único para identificação
        title: "Disponível",
        start,
        end,
        color: "#88e1ff",
      };

      calendarOptions.value.events.push(event);

      newEvent.value = { date: "", startTime: "", endTime: "" };
      closeModal();
    }

    // Excluir evento do calendário
    function deleteEvent() {
      calendarOptions.value.events = calendarOptions.value.events.filter(
        (event) => event.id !== currentEventId.value
      );
      closeModal();
    }

    // Fechar modal
    function closeModal() {
      const modal = bootstrap.Modal.getInstance(document.getElementById("eventModal"));
      modal.hide();
    }

    return {
      calendarOptions,
      newEvent,
      currentEventId,
      isCreatingEvent,
      modalTitle,
      addEvent,
      deleteEvent,
    };
  },
};
</script>

<style scoped>
.agenda-container {
  width: 100%;
  padding: 2px;
}

.fc .fc-event {
  background-color: #88e1ff !important;
  color: white !important;
  border-radius: 4px;
}
</style>
