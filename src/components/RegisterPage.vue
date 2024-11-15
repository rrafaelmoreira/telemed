
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">Cadastro</div>
          <div class="card-body">
            <div class="mb-3">
              <label for="user-type" class="form-label">Tipo de usuário:</label>
              <select class="form-select" id="user-type" v-model="userType">
                <option value="cliente">Cliente</option>
                <option value="medico">Médico</option>
              </select>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email" v-model="user.email" required placeholder="Digite seu email">
              </div>

              <div class="mb-3">
                <label for="first-name" class="form-label">Nome:</label>
                <input type="text" class="form-control" id="first-name" v-model="user.firstName" required>
              </div>
              
              <div class="mb-3">
                <label for="last-name" class="form-label">Sobrenome:</label>
                <input type="text" class="form-control" id="last-name" v-model="user.lastName" required>
              </div>
              
              <div class="mb-3">
                <label for="social-name" class="form-label">Nome Social (Opcional):</label>
                <input type="text" class="form-control" id="social-name" v-model="user.socialName">
              </div>

              <div class="mb-3">
                <label for="gender" class="form-label">Gênero:</label>
                <select class="form-select" id="gender" v-model="user.gender">
                  <option>Masculino</option>
                  <option>Feminino</option>
                  <option>Não-Binário</option>
                  <option>Prefiro não informar</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="cpf" class="form-label">CPF:</label>
                <input type="text" v-mask="'###.###.###-##'" v-model="user.cpf" class="form-control" required placeholder="xxx.xxx.xxx-xx" @input="validateCPF" />
              </div>

              <div v-if="userType === 'medico'">
                <div class="mb-3">
                  <label for="crm" class="form-label">CRM:</label>
                  <input type="text" class="form-control" id="crm" v-model="user.crm" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Senha:</label>
                <input type="password" class="form-control" id="password" v-model="user.password" required>
              </div>

              <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirmar Senha:</label>
                <input type="password" class="form-control" id="confirm-password" v-model="user.confirmPassword" required>
              </div>

              <button type="submit" class="btn btn-primary w-100">Registrar</button>
            </form>
          </div>
        </div>
      </div>
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
    validateCPF() {
      // Removendo caracteres não numéricos
      this.user.cpf = this.user.cpf.replace(/\D/g, '');
      // Limitando a 11 dígitos
      this.user.cpf = this.user.cpf.slice(0, 11);
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
.pet-management {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pet-management h1 {
  text-align: center;
  color: #333;
}

.pet-management form {
  display: grid;
  grid-gap: 15px;
  padding: 20px;
}

.pet-management label {
  font-weight: bold;
}

.pet-management input[type="text"],
.pet-management select,
.pet-management textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

.pet-management input[type="file"] {
  border: none;
  background-color: #e9ecef;
}

.pet-management button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pet-management button:hover {
  background-color: #0056b3;
}

.pet-management .error {
  color: #dc3545;
  font-size: 0.875em;
}

.pet-management .alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 10px;
  margin-top: 15px;
  border-radius: 4px;
  text-align: center;
}
</style>
