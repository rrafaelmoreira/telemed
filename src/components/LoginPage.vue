<template>
  <div class="logcad-page d-flex justify-content-center align-items-center">
    <div class="logcad-container">
      <div class="icon-container">
        <img src="../assets/logo.png" alt="Logo Icon" />
      </div>
      <h2 class="modal-title w-100 text-center logcad-header">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-2">
          <p class="text-start txt_cadlog">E-mail*</p>
          <input
            type="email"
            id="email"
            class="form-control logcad-input"
            placeholder="Digite seu e-mail"
            v-model="email"
            required
          />
        </div>
        <div class="mb-2">
          <p class="text-start txt_cadlog">Senha*</p>
          <input
            type="password"
            class="form-control logcad-input"
            placeholder="Digite sua senha"
            v-model="password"
            required
          />
        </div>
        <br>
        <button type="submit" class="btn btn-gradient w-100 logcad-button">
          Entrar
        </button>

        <hr />
        <a href="#" class="forgot-password" @click="forgotPassword">
          Esqueceu sua senha?
        </a>
        <p class="text-center">
          Não tem conta?
          <router-link class="create-account" to="/register">Cadastre-se</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((response) => {
          console.log("Login bem-sucedido", response);
          this.$router.push("/home");
        })
        .catch((error) => {
          console.error("Falha no login", error);
          alert("Erro no login: " + error.message);
        });
    },
    forgotPassword() {
      alert("Função de recuperação de senha ainda não implementada.");
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #B2DBD3, #4A7C59);
  height: 110vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>