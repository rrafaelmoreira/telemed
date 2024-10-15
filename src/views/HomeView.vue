<template>
  <div>
    <h1>Home Page</h1>
    <p>Bem-vindo à página inicial!</p>
    <JitsiMeet />
  </div>
</template>

<script>
import JitsiMeet from '../components/JitsiMeet.vue';

export default {
  name: 'HomeView',
  components: {
    JitsiMeet,
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>