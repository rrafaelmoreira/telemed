<template>
  <div class="login-page d-flex justify-content-center align-items-center">
    <div class="login-container">
      <div class="icon-container">
        <img src="../assets/logo.png" alt="Logo Icon" />
      </div>
      <h2 class="modal-title w-100 text-center login-header">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input type="email" id="email" class="form-control login-input" placeholder="name@email.com" v-model="email"
            required />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control login-input" placeholder="Password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-success w-100 login-button">Entrar</button>

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

<style scoped>
.login-page {
  background: url('~@/assets/background.jpg') repeat center fixed;
  height: 100vh;
}

.login-container {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.login-header {
  margin-bottom: 20px;
}

.login-input {
  border-radius: 30px;
  padding: 10px 15px;
}

.login-button {
  border-radius: 30px;
  padding: 10px;
  font-weight: bold;
  background-color: #75cfcf;
  color: white;
  border-color: #75cfcf;
  text-decoration: none;
}

.login-button:hover {
  background-color: #5bb6b6;
  border-color: #5bb6b6;
}

.forgot-password,
.create-account {
  text-align: center;
  margin-top: 10px;
  text-decoration: none;

}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.icon-container img {
  width: 100px;
  height: auto;
}
</style>
