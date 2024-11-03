<template>
  <FullCalendar
    :plugins="calendarPlugins"
    initialView="dayGridMonth"
    :events="calendarEvents"
    :headerToolbar="{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }"
    :editable="true"
    :selectable="true"
    @dateClick="handleDateClick"
    @eventClick="handleEventClick"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Para interatividade como cliques

    
export default {
  data() {
    return {
      calendarPlugins: [FullCalendar,dayGridPlugin, timeGridPlugin, interactionPlugin],
      calendarEvents: [
        { title: 'Consulta', start: new Date().toISOString().substr(0, 10) }
      ]
    };
  },
  methods: {
    handleDateClick(arg) {
      alert('Date clicked: ' + arg.dateStr);
    },
    handleEventClick(arg) {
      alert('Event clicked: ' + arg.event.title);
    }
  }
};
</script>
<style>
/* Estilos principais do FullCalendar */
.fc {
    font-family: 'Arial', sans-serif; /* Usa Arial como a fonte principal para um visual limpo */
    color: #333; /* Cor de texto escura para melhor leitura */
}

/* Cabeçalho do calendário */
.fc-header-toolbar {
    background-color: #f8f9fa; /* Um fundo claro para o cabeçalho */
    border-bottom: 2px solid #007bff; /* Uma borda azul para destacar o cabeçalho */
    padding: 10px; /* Padding para dar espaço ao redor dos elementos no cabeçalho */
}

/* Botões no cabeçalho do calendário */
.fc button {
    color: #007bff; /* Cor azul para os botões para se destacar */
    background-color: #fff; /* Fundo branco para os botões */
    border: 1px solid #ddd; /* Borda sutil para os botões */
    padding: 5px 10px; /* Espaçamento interno para fazer os botões maiores e mais fáceis de clicar */
}

.fc button:hover {
    background-color: #e9ecef; /* Cor de fundo ao passar o mouse para interatividade */
}

/* Dias do calendário */
.fc-daygrid-day {
    border: 1px solid #ddd; /* Borda sutil para cada dia no calendário */
}

/* Eventos no calendário */
.fc-event {
    background-color: #007bff; /* Fundo azul para os eventos para destaque */
    color: #fff; /* Texto branco para contraste */
    border: none; /* Sem bordas para um visual mais limpo */
    padding: 5px 10px; /* Espaçamento interno para melhor legibilidade */
    border-radius: 5px; /* Bordas arredondadas para um visual mais suave */
}

/* Titulo do evento */
.fc-event-title {
    font-size: 1em; /* Tamanho da fonte adequado para leitura */
}

/* Adaptação para dispositivos móveis */
@media (max-width: 768px) {
    .fc-header-toolbar {
        flex-direction: column; /* Stack the header items vertically on small screens */
    }

    .fc button {
        width: 100%; /* Full width buttons on small screens for easier access */
        margin-bottom: 5px; /* Add space between buttons */
    }
}
</style>