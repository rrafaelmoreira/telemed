<template>
  <div class="agenda-container">
    <h1>Definir Disponibilidade</h1>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const calendarOptions = ref({
      themeSystem: 'bootstrap5', // Estilização com Bootstrap 5
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek', // Visualização inicial (semana)
      locales: allLocales, // Suporte para múltiplos idiomas
      locale: 'pt-br', // Define o calendário para Português
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay',
      },
      selectable: true, // Permite selecionar horários
      editable: true, // Permite arrastar e editar eventos
      eventClick: handleEventClick, // Clique nos eventos
      select: handleDateSelect, // Seleção de horários
      events: [], // Inicialmente vazio, será carregado do Firestore
      slotDuration: '01:00:00', // Intervalo entre os horários
      slotLabelInterval: '01:00:00', // Exibição das marcações de horários
      minTime: '08:00:00', // Horário mínimo de exibição (8h)
      maxTime: '18:00:00', // Horário máximo de exibição (18h)
      expandRows: true, // Garante que todas as linhas tenham a mesma altura
    });

    const currentEvents = ref([]); // Eventos carregados no calendário
    const medicoId = ref(getAuth().currentUser ? getAuth().currentUser.uid : null);

    if (!medicoId.value) {
      console.error("Usuário não autenticado");
      return;
    }

    // Função para definir a disponibilidade do médico
    async function handleDateSelect(selectInfo) {
      const start = selectInfo.startStr;
      const end = selectInfo.endStr;

      const formattedStart = new Date(start).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const formattedEnd = new Date(end).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const confirmed = confirm(
        `Deseja definir o horário de ${formattedStart} até ${formattedEnd} como disponível?`
      );

      if (!confirmed) {
        selectInfo.view.calendar.unselect();
        return;
      }

      const newAvailability = {
        title: 'Disponível',
        start,
        end,
        color: '#88e1ff',
        available: true,
      };

      const eventsRef = collection(db, `users/${medicoId.value}/events`);
      const eventDoc = await addDoc(eventsRef, newAvailability);

      newAvailability.id = eventDoc.id;
      currentEvents.value.push(newAvailability);
      calendarOptions.value.events = [...currentEvents.value];

      selectInfo.view.calendar.unselect();
    }

    // Função para exibir informações detalhadas do evento e deletar
    async function handleEventClick(clickInfo) {
      const eventId = clickInfo.event.id;
      const event = currentEvents.value.find((e) => e.id === eventId);

      if (!event) {
        alert('Evento não encontrado.');
        return;
      }

      const deleteConfirmed = confirm(`Deseja excluir o evento ${event.title}?`);
      if (deleteConfirmed) {
        await deleteEvent(eventId, clickInfo);
      }
    }

    // Função para excluir eventos
    async function deleteEvent(eventId, clickInfo) {
      const eventRef = doc(db, `users/${medicoId.value}/events`, eventId);
      try {
        await deleteDoc(eventRef);
        clickInfo.event.remove();
        currentEvents.value = currentEvents.value.filter((event) => event.id !== eventId);
      } catch (error) {
        console.error('Erro ao excluir o evento:', error);
      }
    }

    // Função para carregar eventos do Firestore
    async function fetchAvailability() {
      currentEvents.value = [];

      const eventsRef = collection(db, `users/${medicoId.value}/events`);
      const querySnapshot = await getDocs(eventsRef);

      for (const docSnapshot of querySnapshot.docs) {
        const eventData = docSnapshot.data();
        eventData.id = docSnapshot.id;

        currentEvents.value.push(eventData);
      }

      calendarOptions.value.events = [...currentEvents.value];
    }

    onMounted(fetchAvailability);

    return { calendarOptions };
  },
};
</script>

<style scoped>
/* Container principal do calendário */
.agenda-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Estilização dos eventos no calendário */
.fc .fc-event {
  background-color: #88e1ff !important;
  border: none !important;
  color: #ffffff !important;
  font-size: 0.9em;
  border-radius: 4px;
}

/* Título dos eventos */
.fc .fc-event-title {
  font-weight: bold;
}

/* Customizações gerais do FullCalendar */
.fc-toolbar-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.fc .fc-button {
  background-color: #4a7c59;
  color: white !important;
  border-radius: 4px;
}

.fc .fc-button:hover {
  background-color: #36743a;
  color: white !important;
}
</style>
