<template>
    <div>
        <!-- Header -->
        <HeaderComponent />

        <!-- Banner Principal -->
        <section class="banner-section">
            <img src="@/assets/banner.jpg" alt="Veterinarians caring for pets" class="banner-image" />
        </section>


        <!-- Seção de Destaques -->
        <section class="highlights-section py-5 bg-light text-center">
            <div class="container">
                <h2 class="fw-bold mb-4">Por que escolher a nossa plataforma?</h2>
                <div class="row">
                    <div class="col-md-3 mb-3" v-for="benefit in benefits" :key="benefit.title">
                        <div class="card h-100">
                            <div class="card-body">
                                <i :class="benefit.icon" class="display-4 text-primary mb-3"></i>
                                <h5 class="card-title">{{ benefit.title }}</h5>
                                <p class="card-text">{{ benefit.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Serviços Oferecidos -->
        <section class="services-section py-5 text-center">
            <div class="container">
                <h2 class="fw-bold mb-4">Serviços Oferecidos</h2>
                <div class="row">
                    <div class="col-md-3 mb-3" v-for="service in services" :key="service.title">
                        <div class="card h-100">
                            <div class="card-body">
                                <i :class="service.icon" class="display-4 text-success mb-3"></i>
                                <h5 class="card-title">{{ service.title }}</h5>
                                <p class="card-text">{{ service.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";

export default {
    components: {
        HeaderComponent,
    },
    data() {
        return {
            benefits: [
                {
                    title: "Atendimento Rápido",
                    description: "Serviço rápido por veterinários especialistas.",
                    icon: "fas fa-clock",
                },
                {
                    title: "Conforto da sua Casa",
                    description: "Consultas no conforto da sua casa.",
                    icon: "fas fa-home",
                },
                {
                    title: "Disponível 24/7",
                    description: "Atendimento disponível a qualquer hora.",
                    icon: "fas fa-calendar-alt",
                },
                {
                    title: "Conecte-se Rápido",
                    description: "Conecte-se em poucos cliques.",
                    icon: "fas fa-mouse-pointer",
                },
            ],
            services: [
                {
                    title: "Consultas Gerais",
                    description: "Atendimento para diversas necessidades de saúde animal.",
                    icon: "fas fa-stethoscope",
                },
                {
                    title: "Atendimento Emergencial",
                    description: "Suporte para emergências.",
                    icon: "fas fa-ambulance",
                },
                {
                    title: "Nutrição Animal",
                    description: "Orientação nutricional para seu pet.",
                    icon: "fas fa-apple-alt",
                },
                {
                    title: "Comportamento e Treinamento",
                    description: "Ajudamos no comportamento do seu animal.",
                    icon: "fas fa-paw",
                },
            ],
        };
    },
};
</script>

<style scoped>
/* Estilos para o banner */
.banner-section {
    position: relative;
    width: 100vw;
    overflow: hidden;
}

.banner-image {
    width: 100%;
    max-height: 560px;
}

/* Estilos para seções */
.highlights-section,
.services-section {
    background-color: #f9f9f9;
}

.card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 1.25rem;
    color: #333;
}
</style>