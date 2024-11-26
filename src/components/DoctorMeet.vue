<template>
  <div>
    <HeaderComponent />
    <section class="bg-light rounded-4">
      <div class="container-fluid py-5">
        <div class="row">
          <div class="col-md-12">
            <div class="card shadow-sm border-0 mx-auto h-100">
              <div class="card-body">
                <div class="text-center">
                  <h3 class="fw-bold text-start">Videoconferência</h3>
                  <iframe class="jitsi" :src="jitsiUrl" allow="camera; microphone; fullscreen; display-capture"
                    style="width: 100%; height: 100%; border: 0;"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </section>

  </div>

</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  components: {
    HeaderComponent,
  },
  name: 'JitsiMeet',
  data() {
    return {
      roomName: 'my-custom-room', // Nome da sala de videoconferência
      domain: 'ec2-34-229-236-247.compute-1.amazonaws.com', // Domínio do servidor Jitsi
    };
  },
  computed: {
    jitsiUrl() {
      const url = `https://${this.domain}/${this.roomName}`;
      console.log(url); // Adiciona o console.log aqui para verificar a URL
      return url;
    },
  },
};
</script>

<style scoped>
.container-fluid {
  min-width: 50vw;
  max-width: 80vw;
  min-height: 30vw;
  max-height: 30vw;
}

.jitsi {
  min-width: 45vw;
  max-width: 75vw;
  min-height: 23vw;
  max-height: 25vw;
}

</style>