<template>
  <div class="agenda-container">
    <h1>Agenda do Médico</h1>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '@/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default {
  props: ['medicoId'],
  components: {
    FullCalendar,
  },
  setup(props) {
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      select: handleDateSelect,
      events: [], // Carregar eventos e disponibilidade do Firestore
    });

    const disponibilidade = ref([]); // Guarda os horários disponíveis
    const currentEvents = ref([]); // Guarda todos os eventos atuais, incluindo consultas

    // Função para buscar e sincronizar os eventos do Firestore
    async function fetchAvailability() {
      currentEvents.value = []; // Limpa o array de eventos para garantir que não há cache

      const eventsRef = collection(db, `users/${props.medicoId}/events`);
      const querySnapshot = await getDocs(eventsRef);
      const events = [];
      disponibilidade.value = []; // Limpa o array de disponibilidade para evitar duplicação

      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        eventData.id = doc.id; // Adiciona o ID do documento para facilitar exclusão e manipulação

        if (eventData.available) {
          disponibilidade.value.push(eventData); // Adiciona apenas os horários disponíveis
        }
        events.push(eventData); // Adiciona todos os eventos, incluindo consultas agendadas
      });

      currentEvents.value = events; // Atualiza o array de eventos atuais
      calendarOptions.value.events = [...currentEvents.value]; // Atualiza o calendário com os dados mais recentes
    }

    // Função para lidar com a seleção de data e horário para agendamento de consulta
    async function handleDateSelect(selectInfo) {
      const start = selectInfo.startStr;
      const end = selectInfo.endStr;

      // Verifica se o horário selecionado está dentro da disponibilidade
      const isAvailable = disponibilidade.value.some(event => 
        event.start <= start && event.end >= end
      );

      if (!isAvailable) {
        alert('Este horário não está disponível para agendamento.');
        selectInfo.view.calendar.unselect();
        return;
      }

      const title = prompt('Confirme o nome para a consulta:');
      if (title) {
        const newEvent = {
          title,
          start,
          end,
          color: '#ff9f89',
          available: false // Marca como indisponível após o agendamento
        };

        // Adiciona o novo evento no Firestore
        const eventsRef = collection(db, `users/${props.medicoId}/events`);
        const docRef = await addDoc(eventsRef, newEvent);

        // Atualiza o ID do evento no array de eventos
        newEvent.id = docRef.id;
        currentEvents.value.push(newEvent); // Adiciona o evento aos eventos atuais
        calendarOptions.value.events = [...currentEvents.value]; // Atualiza o calendário com o novo evento
      }
      selectInfo.view.calendar.unselect();
    }

    onMounted(fetchAvailability); // Carrega e sincroniza os eventos quando o componente é montado

    return { calendarOptions };
  }
};
</script>

<style scoped>
.agenda-container {
  max-width: 800px; /* Define uma largura máxima para a agenda */
  margin: auto; /* Centraliza a agenda na tela */
  padding: 20px;
  background-color: #f9f9f9; /* Cor de fundo opcional para destacar a agenda */
  border-radius: 8px; /* Bordas arredondadas para uma aparência mais elegante */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra leve para destacar a agenda */
}

.fc { /* Aplica o estilo ao FullCalendar */
  max-width: 100%; /* Garante que o calendário respeite a largura do container */
  margin: 0 auto;
}
</style>
