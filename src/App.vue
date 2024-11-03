<template>
  <div id="app">
    <FullCalendar
      :plugins="calendarPlugins"
      initialView="dayGridMonth"
      :events="calendarEvents"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

export default {
  name: 'App',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin],
      calendarEvents: [
        { title: 'Test Event 1', date: new Date().toISOString().substr(0, 10) }
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
