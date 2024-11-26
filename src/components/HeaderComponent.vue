<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
            <div class="container">
                <!-- Logotipo -->
                <router-link class="navbar-brand d-flex align-items-center" to="/">
                    <img src="@/assets/logo.png" alt="Logo" width="50" height="50" class="me-2" />
                    <span class="txt_cadlog fs-4">Telemed Pet</span>
                </router-link>

                <!-- Botão de menu responsivo (hambúrguer) -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Menu de Navegação -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <!-- Exibe nome e email do usuário no menu colapsado -->
                        <li v-if="user" class="nav-item d-lg-none mb-3 text-center">
                            <p class="fw-bold mb-0">{{ user.displayName || 'Usuário' }}</p>
                            <small class="text-muted">{{ user.email }}</small>
                        </li>

                        <li class="nav-item">
                            <router-link :to="userType === 'medico' ? '/perfil-medico' : '/perfil-cliente'"
                                class="nav-link">
                                Perfil
                            </router-link>
                        </li>

                        <!-- Links específicos para Médicos -->
                        <li v-if="userType === 'medico'" class="nav-item">
                            <router-link to="/pacientes" class="nav-link">Pacientes</router-link>
                        </li>
                        <li v-if="userType === 'medico'" class="nav-item">
                            <router-link to="/criar-reuniao" class="nav-link">Criar Reunião</router-link>
                        </li>

                        <!-- Links específicos para Clientes -->
                        <li v-if="userType === 'cliente'" class="nav-item">
                            <router-link to="/pets" class="nav-link">Meus pets</router-link>
                        </li>
                        <li v-if="userType === 'cliente'" class="nav-item">
                            <router-link to="/lista-medico" class="nav-link">Veterinários Disponíveis</router-link>
                        </li>

                        <!-- Botão de Logout -->
                        <li class="nav-item">
                            <button @click="handleLogout" class="btn btn-outline-danger btn-sm ms-lg-3">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>


<script>
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default {
    name: "HeaderComponent",
    data() {
        return {
            userType: null, // Tipo de usuário para condicional de navegação
            user: null, // Informações do usuário logado
        };
    },
    created() {
        const auth = getAuth();
        const db = getFirestore();

        auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user; // Armazena informações do usuário para exibir nome e foto
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            this.userType = docSnap.data().userType;
                            console.log("User type from Firestore:", this.userType);
                        } else {
                            console.log("No user data available in Firestore");
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });
            } else {
                this.$router.push("/login"); // Redireciona para login se não autenticado
            }
        });
    },
    methods: {
        handleLogout() {
            const auth = getAuth();
            auth
                .signOut()
                .then(() => {
                    this.$router.push("/login");
                })
                .catch((error) => {
                    console.error("Logout Failed", error);
                });
        },
    },
};
</script>