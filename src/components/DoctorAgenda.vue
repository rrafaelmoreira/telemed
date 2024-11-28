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
import { ref, onMounted } from "vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // Funções do Firestore
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

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

    const currentEventId = ref([]);
    const isCreatingEvent = ref(true);
    const medicoId = ref(getAuth().currentUser ? getAuth().currentUser.uid : null);
    const modalTitle = ref("");

    if (!medicoId.value) {
      console.error("Usuário não autenticado");
      return;
    }

    // Função para buscar os eventos do Firestore e exibir no calendário
    async function fetchEvents() {
      const eventsRef = collection(db, `users/${medicoId.value}/events`);
      const querySnapshot = await getDocs(eventsRef);
      
      const events = querySnapshot.docs.map(doc => {
        const event = doc.data();
        event.id = doc.id; // Adicionando o ID do documento do Firestore ao evento
        return event;
      });

      // Atualiza os eventos no calendário
      calendarOptions.value.events = events;
    }

    // Chama a função ao montar o componente para carregar os eventos
    onMounted(() => {
      fetchEvents();
    });

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

    // Adicionar evento ao Firestore e ao calendário
    async function addEvent() {
      const { date, startTime, endTime } = newEvent.value;
      const start = `${date}T${startTime}:00`;
      const end = `${date}T${endTime}:00`;

      const event = {
        title: "Disponível",
        start,
        end,
        color: "#88e1ff",
        available: true,
      };

      const eventsRef = collection(db, `users/${medicoId.value}/events`);

      try {
        // Adiciona o evento ao Firestore
        const docRef = await addDoc(eventsRef, event);

        // Atualiza o ID do evento com o ID gerado pelo Firestore
        event.id = docRef.id;

        // Adiciona o evento ao calendário local
        calendarOptions.value.events.push(event);

        // Limpa os campos de entrada do evento
        newEvent.value = { date: "", startTime: "", endTime: "" };

        // Fecha o modal
        closeModal();
      } catch (error) {
        console.error("Erro ao adicionar evento:", error);
      }
    }

    // Excluir evento do Firestore e do calendário
    async function deleteEvent() {
      const eventRef = doc(db, `users/${medicoId.value}/events`, currentEventId.value);
      
      try {
        // Exclui o evento do Firestore
        await deleteDoc(eventRef);

        // Remove o evento do calendário
        calendarOptions.value.events = calendarOptions.value.events.filter(
          (event) => event.id !== currentEventId.value
        );

        // Fecha o modal após excluir
        closeModal();
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
      }
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
