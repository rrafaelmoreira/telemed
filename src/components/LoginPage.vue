<template> 
  <div class="logcad-page d-flex justify-content-center align-items-center">
    <div class="logcad-container">
      <div class="icon-container">
        <img src="../assets/logo.png" alt="Logo Icon" />
      </div>
      <h2 class="modal-title w-100 text-center logcad-header">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input type="email" id="email" class="form-control logcad-input" placeholder="name@email.com" v-model="email"
            required />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control logcad-input" placeholder="Password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-success w-100 logcad-button">Entrar</button>

        <hr>
        <a href="#" class="forgot-password" @click="forgotPassword">Esqueceu sua senha?</a>
        <p>Não tem conta? <router-link class="create-account" to="/register">Cadastre-se</router-link></p>
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
      email: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((response) => {
          console.log("Login successful", response);
          this.$router.push("/home");
        })
        .catch((error) => {
          console.error("Login failed", error);
          alert("Login falhou: " + error.message);
        });
    }
  }
};

</script>
