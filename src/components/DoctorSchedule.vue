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
import { collection, getDocs, addDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      selectable: true,
      editable: true,
      slotDuration: '00:30:00',
      slotLabelInterval: '01:00:00',
      allDaySlot: true,
      select: handleDateSelect,
      events: [],
    });

    const disponibilidade = ref([]);
    const consultas = ref([]);
    const currentEvents = ref([]);
    const auth = getAuth();
    const clientId = ref(auth.currentUser ? auth.currentUser.uid : null); // Obtém o ID do usuário autenticado

    // Função para carregar os eventos do Firestore
    async function fetchEvents() {
      currentEvents.value = [];
      disponibilidade.value = [];
      consultas.value = [];

      const eventsRef = collection(db, `users/${props.medicoId}/events`);
      const querySnapshot = await getDocs(eventsRef);

      querySnapshot.forEach((docSnapshot) => {
        const eventData = docSnapshot.data();
        eventData.id = docSnapshot.id;

        if (eventData.available) {
          disponibilidade.value.push(eventData);
        } else {
          consultas.value.push(eventData);
        }

        currentEvents.value.push(eventData);
      });

      calendarOptions.value.events = [...currentEvents.value];
    }

    // Função para obter os animais do cliente logado
    async function fetchClientPets() {
      if (!clientId.value) return [];
      
      const petsRef = collection(db, 'pets');
      const petsQuery = query(petsRef, where('ownerId', '==', clientId.value));
      const petsSnapshot = await getDocs(petsQuery);
      return petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Função para lidar com a seleção de data e horário para agendamento de consulta
    async function handleDateSelect(selectInfo) {
      const start = selectInfo.startStr;
      const end = selectInfo.endStr;

      // Verifica se o horário selecionado já está ocupado por uma consulta
      const isOccupied = consultas.value.some(event =>
        event.start < end && event.end > start
      );

      if (isOccupied) {
        alert('Este horário já está ocupado por uma consulta.');
        selectInfo.view.calendar.unselect();
        return;
      }

      // Encontra todos os blocos de disponibilidade que sobrepõem o horário selecionado
      const overlappingAvailabilities = disponibilidade.value.filter(event =>
        event.start < end && event.end > start
      );

      if (overlappingAvailabilities.length === 0) {
        alert('Somente horários marcados como "Disponível" podem ser agendados.');
        selectInfo.view.calendar.unselect();
        return;
      }

      // Ajusta os blocos de disponibilidade afetados
      for (const availability of overlappingAvailabilities) {
        await deleteDoc(doc(db, `users/${props.medicoId}/events`, availability.id));
        disponibilidade.value = disponibilidade.value.filter(event => event.id !== availability.id);
        currentEvents.value = currentEvents.value.filter(event => event.id !== availability.id);

        if (availability.start < start) {
          const newAvailabilityBefore = {
            title: 'Disponível',
            start: availability.start,
            end: start,
            color: '#88e1ff',
            available: true,
          };
          const docRefBefore = await addDoc(collection(db, `users/${props.medicoId}/events`), newAvailabilityBefore);
          newAvailabilityBefore.id = docRefBefore.id;
          disponibilidade.value.push(newAvailabilityBefore);
          currentEvents.value.push(newAvailabilityBefore);
        }

        if (availability.end > end) {
          const newAvailabilityAfter = {
            title: 'Disponível',
            start: end,
            end: availability.end,
            color: '#88e1ff',
            available: true,
          };
          const docRefAfter = await addDoc(collection(db, `users/${props.medicoId}/events`), newAvailabilityAfter);
          newAvailabilityAfter.id = docRefAfter.id;
          disponibilidade.value.push(newAvailabilityAfter);
          currentEvents.value.push(newAvailabilityAfter);
        }
      }

      // Primeiro prompt: Seleção do tipo de consulta
      const consultaOptions = `
1 - Teleconsulta Veterinária
2 - Teletriagem
3 - Teleinterconsulta (ou Teleconsultoria)
4 - Educação e Orientação Remota

Digite o número correspondente à opção de consulta:
      `;
      const selectedOption = prompt(consultaOptions);

      const serviceTypes = {
        '1': 'Teleconsulta Veterinária',
        '2': 'Teletriagem',
        '3': 'Teleinterconsulta (ou Teleconsultoria)',
        '4': 'Educação e Orientação Remota'
      };
      const title = serviceTypes[selectedOption];

      if (!title) {
        alert('Opção inválida. Selecione novamente.');
        selectInfo.view.calendar.unselect();
        return;
      }

      if (!clientId.value) {
        alert('Usuário não autenticado. Por favor, faça login para agendar uma consulta.');
        selectInfo.view.calendar.unselect();
        return;
      }

      // Pega os animais do cliente logado e mostra um prompt para seleção
      const pets = await fetchClientPets();
      if (pets.length === 0) {
        alert('Nenhum animal encontrado para este cliente.');
        selectInfo.view.calendar.unselect();
        return;
      }

      let petOptions = 'Selecione o número correspondente ao animal:\n';
      pets.forEach((pet, index) => {
        petOptions += `${index + 1} - ${pet.name} (${pet.species})\n`;
      });
      const petSelection = prompt(petOptions);
      const selectedPet = pets[parseInt(petSelection) - 1];

      if (!selectedPet) {
        alert('Opção inválida. Agendamento cancelado.');
        selectInfo.view.calendar.unselect();
        return;
      }

      // Cria o novo evento da consulta com o ID do cliente, tipo de serviço e animal selecionado
      const newEvent = {
        title: `${title} - ${selectedPet.name} (${selectedPet.species})`,
        start,
        end,
        color: '#ff9f89',
        available: false,
        clientId: clientId.value, // Salva o ID do cliente autenticado
        service: title, // Salva o nome do serviço selecionado
        petId: selectedPet.id,
        petName: selectedPet.name,
        petSpecies: selectedPet.species,
      };

      const eventsRef = collection(db, `users/${props.medicoId}/events`);
      const docRef = await addDoc(eventsRef, newEvent);

      newEvent.id = docRef.id;
      consultas.value.push(newEvent);
      currentEvents.value.push(newEvent);
      calendarOptions.value.events = [...currentEvents.value];
      
      selectInfo.view.calendar.unselect();
    }

    onMounted(fetchEvents);

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

.fc {
  max-width: 100%;
  margin: 0 auto;
}
</style>
