<template>
    <div class="jitsi-container">
      <iframe
        :src="jitsiUrl"
        allow="camera; microphone; fullscreen; display-capture"
        style="width: 100%; height: 100%; border: 0;"
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JitsiMeet',
    data() {
      return {
        roomName: 'my-custom-room', // Nome da sala de videoconferência
        domain: '35.196.247.119', // Domínio do servidor Jitsi
      };
    },
    computed: {
      jitsiUrl() {
        return `https://${this.domain}/${this.roomName}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .jitsi-container {
    width: 80%; /* Defina a largura desejada */
    height: 80vh; /* Defina a altura desejada */
    margin: 0 auto; /* Centraliza o contêiner horizontalmente */
    border: 1px solid #ccc; /* Adiciona uma borda para visualização */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Adiciona uma sombra para visualização */
  }
  </style>