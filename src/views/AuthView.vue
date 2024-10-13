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
import AuthController from '../controllers/AuthController';

export default {
  name: 'AuthView',
  data() {
    return {
      loginEmail: '',
      loginPassword: '',
      registerEmail: '',
      registerPassword: ''
    };
  },
  methods: {
    async handleLogin() {
      if (await AuthController.login(this.loginEmail, this.loginPassword)) {
        this.$router.push({ name: 'Home' });
      } else {
        alert('Login failed');
      }
    },
    async handleRegister() {
      if (await AuthController.register(this.registerEmail, this.registerPassword)) {
        alert('Registration successful');
      } else {
        alert('Registration failed: User already exists');
      }
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