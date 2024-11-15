<template>
  <div class="register-page d-flex justify-content-center align-items-center">
    <div class="register-container">
      <div class="icon-container">
        <img src="../assets/logo.png" alt="Logo Icon" />
      </div>
      <h2 class="modal-title w-100 text-center register-header">Cadastro</h2>

      <form @submit.prevent="handleRegister">
        <!-- Seleção do tipo de usuário -->
        <div class="mb-3">
          <select v-model="userType" class="form-select register-input">
            <option value="cliente">Cliente</option>
            <option value="medico">Médico</option>
          </select>
        </div>

        <!-- Email e Nome Completo -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="email" class="form-control register-input" placeholder="name@email.com" v-model="email" required />
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control register-input" placeholder="Nome completo" v-model="fullName"
              required />
          </div>
        </div>

        <!-- Nome Social e Gênero -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="text" class="form-control register-input" placeholder="Nome Social" v-model="socialName" />
          </div>
          <div class="col-md-6">
            <select v-model="gender" class="form-select register-input">
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <!-- CPF e CRMV (caso Médico) -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="text" class="form-control register-input" placeholder="123.456.789-10" v-model.lazy="user.cpf"
              @input="formatCPF" required maxlength="14"/>
          </div>
          <div v-if="user.cpf && !validateCPF(user.cpf)" class="invalid-feedback">
            CPF inválido.
          </div>
          <div class="col-md-6" v-if="userType === 'medico'">
            <input type="text" class="form-control register-input" placeholder="CRMV" v-model="crmv" required />
          </div>
        </div>

        <!-- Senha e Confirmação de Senha -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="password" class="form-control register-input" placeholder="Senha" v-model="password"
              required />
          </div>
          <div class="col-md-6">
            <input type="password" class="form-control register-input" placeholder="Confirmar Senha"
              v-model="confirmPassword" required />
          </div>
        </div>

        <button type="submit" class="btn btn-success w-100 register-button">Cadastrar</button>

        <hr>
        <p class="text-center">Já tem conta? <router-link class="create-account" to="/login">Entrar</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


export default {
  name: 'RegisterPage',
  data() {
    return {
      userType: 'cliente',
      user: {
        firstName: '',
        lastName: '',
        socialName: '',
        gender: '',
        cpf: '',
        crm: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    validateCPF(cpf) {
      // Removendo pontos e traços para validar o CPF puro
      cpf = cpf.replace(/\D/g, "");
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      let Soma = 0, Resto;
      for (let i = 1; i <= 9; i++) Soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
      if (Resto === 10 || Resto === 11) Resto = 0;
      if (Resto !== parseInt(cpf.substring(9, 10))) return false;

      Soma = 0;
      for (let i = 1; i <= 10; i++) Soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;
      if (Resto === 10 || Resto === 11) Resto = 0;
      return Resto === parseInt(cpf.substring(10, 11));
    },
    formatCPF(event) {
      // Obtendo o valor do evento de input
      let value = event.target.value;

      // Removendo caracteres não numéricos e limitando a 11 dígitos
      value = value.replace(/\D/g, '').slice(0, 11);

      // Aplicando formatação automática para CPF: XXX.XXX.XXX-XX
      if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
      }

      // Atualizando o valor formatado no campo
      this.user.cpf = value;
    },

    async handleRegister() {
      if (this.user.password !== this.user.confirmPassword) {
        alert('As senhas não coincidem');
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );

        // Atualizar o perfil (Opcional)
        await updateProfile(userCredential.user, {
          displayName: this.user.firstName + ' ' + this.user.lastName
        });

        // Armazenar detalhes adicionais em Firestore ou em Custom Claims
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          socialName: this.user.socialName,
          gender: this.user.gender,
          cpf: this.user.cpf,
          userType: this.userType,
          crm: this.userType === 'medico' ? this.user.crm : null
        });

        console.log('Usuário registrado com sucesso:', userCredential.user);
        // Redirecionar para a página Home
        this.$router.push('/home');
        // this.$router.push(this.userType === 'medico' ? '/dashboard-medico' : '/dashboard-cliente');
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar: ' + error.message);
      }
    }
  }
};
</script>


<style scoped>
.register-page {
  background: url('~@/assets/background.jpg') repeat center fixed;
  height: 100vh;
}

.register-container {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.register-header {
  margin-bottom: 20px;
}

.register-input {
  border-radius: 30px;
  padding: 10px 15px;
}

.register-button {
  border-radius: 30px;
  padding: 10px;
  font-weight: bold;
  background-color: #75cfcf;
  color: white;
  border-color: #75cfcf;
}

.register-button:hover {
  background-color: #5bb6b6;
  border-color: #5bb6b6;
}
.create-account{
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
