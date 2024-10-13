<template>
  <div class="auth-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="login-email">Email:</label>
          <input type="email" v-model="loginEmail" id="login-email" required />
        </div>
        <div>
          <label for="login-password">Password:</label>
          <input type="password" v-model="loginPassword" id="login-password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="register-email">Email:</label>
          <input type="email" v-model="registerEmail" id="register-email" required />
        </div>
        <div>
          <label for="register-password">Password:</label>
          <input type="password" v-model="registerPassword" id="register-password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  data() {
    return {
      loginEmail: '',
      loginPassword: '',
      registerEmail: '',
      registerPassword: ''
    };
  },
  methods: {
    handleLogin() {
      // Lógica de login
      console.log('Login:', this.loginEmail, this.loginPassword);
      
      // Simulação de login bem-sucedido
      if (this.loginEmail && this.loginPassword) {
        this.$router.push({ name: 'Home' });
      }
    },
    handleRegister() {
      // Lógica de registro
      console.log('Register:', this.registerEmail, this.registerPassword);
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
.login-form, .register-form {
  width: 45%;
}
</style>