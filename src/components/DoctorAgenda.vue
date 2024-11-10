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
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      editable: true,
      select: handleDateSelect,
      eventClick: handleEventClick, // Adiciona a função de clique no evento
      events: [], // Carregar eventos de disponibilidade do Firestore
    });
    
    const currentEvents = ref([]);
    const medicoId = ref(null);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      medicoId.value = user.uid;
    } else {
      console.error("Usuário não autenticado");
    }

    // Função para definir a disponibilidade
    async function handleDateSelect(selectInfo) {
      const start = selectInfo.startStr;
      const end = selectInfo.endStr;

      const confirmed = confirm(`Deseja definir este horário como disponível de ${start} até ${end}?`);
      if (!confirmed) {
        selectInfo.view.calendar.unselect();
        return;
      }

      const newAvailability = {
        title: 'Disponível',
        start,
        end,
        color: '#88e1ff',
        available: true, // Marca como horário disponível
      };

      if (medicoId.value) {
        const eventsRef = collection(db, `users/${medicoId.value}/events`);
        const eventDoc = await addDoc(eventsRef, newAvailability);
        
        // Adiciona o ID do documento para facilitar a exclusão posteriormente
        newAvailability.id = eventDoc.id;
        currentEvents.value.push(newAvailability);
        calendarOptions.value.events = [...currentEvents.value];
      }

      selectInfo.view.calendar.unselect();
    }

    // Função para excluir um evento de disponibilidade
    async function handleEventClick(clickInfo) {
      const eventId = clickInfo.event.id;
      const confirmed = confirm(`Tem certeza de que deseja excluir o horário de disponibilidade: '${clickInfo.event.title}'?`);

      if (confirmed && medicoId.value) {
        const eventRef = doc(db, `users/${medicoId.value}/events`, eventId);
        
        try {
          await deleteDoc(eventRef); // Remove o evento do Firestore
          clickInfo.event.remove(); // Remove o evento da interface do calendário
          currentEvents.value = currentEvents.value.filter(event => event.id !== eventId);
        } catch (error) {
          console.error("Erro ao excluir o evento:", error);
        }
      }
    }

    // Função para buscar a disponibilidade do Firestore
    async function fetchAvailability() {
      if (medicoId.value) {
        currentEvents.value = []; // Limpa os eventos anteriores

        const eventsRef = collection(db, `users/${medicoId.value}/events`);
        const querySnapshot = await getDocs(eventsRef);
        querySnapshot.forEach((docSnapshot) => {
          const eventData = docSnapshot.data();
          eventData.id = docSnapshot.id; // Atribui o ID do documento para permitir exclusão
          currentEvents.value.push(eventData); // Adiciona todos os eventos, incluindo consultas
        });

        calendarOptions.value.events = [...currentEvents.value];
      }
    }

    onMounted(fetchAvailability);

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