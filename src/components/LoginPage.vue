<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-email">Email:</label>
          <input type="email" class="form-control" id="email" v-model="email" required placeholder="Digite seu email">
        </div>
        <div class="form-group">
          <label for="login-password">Senha:</label>
          <input type="password" class="form-control" id="password" v-model="password" required placeholder="Digite sua senha">
        </div>
        <button type="submit" class="btn btn-primary w-100">Entrar</button>
        <div class="mt-3">
          <a href="#" class="forgot-password-link" @click="forgotPassword">Esqueceu sua senha?</a>
          <p>Não tem conta? <router-link to="/register">Cadastre-se</router-link></p>
        </div>
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
.login-container {
  background: url('~@/assets/login-background.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form .btn-primary {
  margin-top: 10px;
}
</style>
