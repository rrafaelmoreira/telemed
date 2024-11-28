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
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
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
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      selectable: true,
      editable: true,
      eventClick: handleEventClick,
      select: handleDateSelect,
      events: [],
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00:00',
      expandRows: true,
    });
    
    const currentEvents = ref([]);
    const medicoId = ref(getAuth().currentUser ? getAuth().currentUser.uid : null);

    if (!medicoId.value) {
      console.error("Usuário não autenticado");
      return;
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
        available: true,
      };

      const eventsRef = collection(db, `users/${medicoId.value}/events`);
      const eventDoc = await addDoc(eventsRef, newAvailability);
      
      newAvailability.id = eventDoc.id;
      currentEvents.value.push(newAvailability);
      calendarOptions.value.events = [...currentEvents.value];

      selectInfo.view.calendar.unselect();
    }

    // Função para exibir informações detalhadas do evento e oferecer opção de deletar
    async function handleEventClick(clickInfo) {
      const eventId = clickInfo.event.id;
      const event = currentEvents.value.find(e => e.id === eventId);

      if (!event) {
        alert("Evento não encontrado.");
        return;
      }

      if (!event.available && event.clientId) {
        const clientData = await fetchClientData(event.clientId);
        const petData = await fetchPetData(event.clientId, event.petId);
        if (clientData && petData) {
          const details = `
Cliente: ${clientData.firstName} ${clientData.lastName}
Animal: ${petData.name} | Espécie: ${petData.species} | Condição: ${petData.conditions || "Não especificado"}
Serviço: ${event.service || event.title}
Horário: ${event.start} até ${event.end}
          `;
          const deleteConfirmed = confirm(`Detalhes da Consulta:\n\n${details}\n\nDeseja excluir este evento?`);
          
          if (deleteConfirmed) {
            await deleteEvent(eventId, clickInfo);
          }
        } else {
          alert("Dados do cliente ou do animal não encontrados.");
        }
      } else if (event.available) {
        const deleteConfirmed = confirm(`Horário de disponibilidade: ${event.start} até ${event.end}\n\nDeseja excluir este evento?`);
        
        if (deleteConfirmed) {
          await deleteEvent(eventId, clickInfo);
        }
      }
    }

    // Função para excluir um evento do Firestore e do calendário
    async function deleteEvent(eventId, clickInfo) {
      const eventRef = doc(db, `users/${medicoId.value}/events`, eventId);
      try {
        await deleteDoc(eventRef);
        clickInfo.event.remove();
        currentEvents.value = currentEvents.value.filter(event => event.id !== eventId);
      } catch (error) {
        console.error("Erro ao excluir o evento:", error);
      }
    }

    // Função para buscar a disponibilidade e consultas do Firestore
    async function fetchAvailability() {
      currentEvents.value = [];

      const eventsRef = collection(db, `users/${medicoId.value}/events`);
      const querySnapshot = await getDocs(eventsRef);
      for (const docSnapshot of querySnapshot.docs) {
        const eventData = docSnapshot.data();
        eventData.id = docSnapshot.id;

        if (!eventData.available && eventData.clientId) {
          const clientData = await fetchClientData(eventData.clientId);
          const petData = await fetchPetData(eventData.clientId, eventData.petId);
          if (clientData && petData) {
            eventData.title = `Cliente: ${clientData.firstName} ${clientData.lastName} | Animal: ${petData.name} | Serviço: ${eventData.service || eventData.title}`;
            eventData.color = '#ff9f89';
          }
        }

        currentEvents.value.push(eventData);
      }

      calendarOptions.value.events = [...currentEvents.value];
    }

    // Função para buscar os dados do cliente no Firestore usando o ID do cliente
    async function fetchClientData(clientId) {
      try {
        const clientRef = doc(db, 'users', clientId);
        const clientSnapshot = await getDoc(clientRef);
        if (clientSnapshot.exists()) {
          const clientData = clientSnapshot.data();
          return {
            firstName: clientData.firstName,
            lastName: clientData.lastName,
          };
        } else {
          console.error(`Cliente com ID ${clientId} não encontrado`);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do cliente:", error);
      }
      return null;
    }

    // Função para buscar os dados do animal na coleção 'pets' usando o ownerId e petId
    async function fetchPetData(ownerId, petId) {
      try {
        const petRef = doc(db, 'pets', petId);
        const petSnapshot = await getDoc(petRef);

        if (petSnapshot.exists() && petSnapshot.data().ownerId === ownerId) {
          return petSnapshot.data();
        } else {
          console.error(`Animal com ownerId ${ownerId} e petId ${petId} não encontrado`);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do animal:", error);
      }
      return null;
    }

    onMounted(fetchAvailability);

    return { calendarOptions };
  },
};
</script>

<style scoped>
.agenda-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fc .fc-event-title {
  white-space: normal;
}

.fc .fc-event {
  font-size: 0.9em;
  padding: 5px;
  border-radius: 5px;
}
</style>
