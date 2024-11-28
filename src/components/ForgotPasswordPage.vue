<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <h2>Forgot Password</h2>
      <b-form @submit.prevent="handleForgotPassword">
        <b-form-group id="input-group-email" label="Email:" label-for="forgot-password-email">
          <b-form-input
            id="forgot-password-email"
            type="email"
            v-model="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" block>Reset Password</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: ''
    };
  },
  methods: {
    handleForgotPassword() {
      // Lógica de recuperação de senha
      console.log('Forgot Password:', this.email);
    }
  }
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.forgot-password-form {
  width: 45%;
}
</style>