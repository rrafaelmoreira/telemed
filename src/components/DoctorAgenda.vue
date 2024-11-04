<template>
  <div class='demo-app'>
    <!-- Contêiner principal da aplicação -->
    <div class='demo-app-sidebar'>
      <!-- Barra lateral com instruções e controles -->
      <div class='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <!-- Selecionar datas no calendário permite criar novos eventos -->
          <li>Drag, drop, and resize events</li>
          <!-- Eventos podem ser arrastados e redimensionados -->
          <li>Click an event to delete it</li>
          <!-- Clicar em um evento oferece a opção de deletá-lo -->
        </ul>
      </div>
      <div class='demo-app-sidebar-section'>
        <label>
          <input type='checkbox' :checked='calendarOptions.weekends' @change='handleWeekendsToggle' />
          toggle weekends
        </label>
        <!-- Checkbox para habilitar ou desabilitar a visualização de finais de semana -->
      </div>
      <div class='demo-app-sidebar-section'>
        <h2>All Events ({{ currentEvents.length }})</h2>
        <!-- Mostra a contagem de eventos atuais -->
        <ul>
          <li v-for='event in currentEvents' :key='event.id'>
            <!-- Lista todos eventos com seu início e título -->
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div>
    </div>
    <div class='demo-app-main'>
      <!-- Área principal onde o calendário é renderizado -->
      <FullCalendar :options='calendarOptions' />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'  // Importa o componente FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'  // Plugin para visualização em grade de dias
import timeGridPlugin from '@fullcalendar/timegrid'  // Plugin para visualização em grade de tempo
import interactionPlugin from '@fullcalendar/interaction'  // Plugin para interações como seleção e arraste
import { INITIAL_EVENTS, createEventId } from './event-utils.js'  // Utilitários para eventos iniciais e criação de ID

export default defineComponent({
  components: {
    FullCalendar,  // Registra o FullCalendar como componente
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],  // Plugins utilizados no calendário
        headerToolbar: {
          left: 'prev,next today',  // Botões no lado esquerdo do cabeçalho
          center: 'title',  // Título no centro do cabeçalho
          right: 'dayGridMonth,timeGridWeek,timeGridDay'  // Botões para mudar a visualização no lado direito
        },
        initialView: 'dayGridMonth',  // Visualização inicial do calendário
        initialEvents: INITIAL_EVENTS,  // Eventos iniciais definidos no arquivo de utilitários
        editable: true,  // Permite editar eventos (arrastar, soltar, redimensionar)
        selectable: true,  // Permite selecionar períodos no calendário
        selectMirror: true,  // Mostra uma prévia da seleção enquanto seleciona
        dayMaxEvents: true,  // Limita o número de eventos mostrados por dia com um link para expandir
        weekends: true,  // Mostra finais de semana
        select: this.handleDateSelect,  // Método chamado ao selecionar datas
        eventClick: this.handleEventClick,  // Método chamado ao clicar em um evento
        eventsSet: this.handleEvents  // Método chamado ao atualizar a lista de eventos
      },
      currentEvents: []  // Armazena os eventos atuais mostrados no calendário
    };
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends  // Atualiza a propriedade de finais de semana
    },
    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event');
      let calendarApi = selectInfo.view.calendar;

      calendarApi.unselect();  // Limpa a seleção atual

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),  // Cria um novo ID para o evento
          title,
          start: selectInfo.startStr,  // Define a data/hora de início baseado na seleção
          end: selectInfo.endStr,  // Define a data/hora de término baseado na seleção
          allDay: selectInfo.allDay  // Define se o evento ocupa o dia todo
        });
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove();  // Remove o evento se confirmado
      }
    },
    handleEvents(events) {
      this.currentEvents = events;  // Atualiza a lista de eventos atuais
    }
  }
});
</script>

<style lang='css'>
/* Estilos para o aplicativo, barra lateral, e área principal */
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* Estilos específicos para o calendário FullCalendar */
  max-width: 1100px;
  margin: 0 auto;
}
</style>
