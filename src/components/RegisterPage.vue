<template>
  <div class="logcad-page d-flex justify-content-center align-items-center">
    <div class="logcad-container">
      <div class="icon-container">
        <img src="../assets/logo.png" alt="Logo Icon" />
      </div>
      <h2 class="modal-title logcad-header">Criar sua conta</h2>

      <form @submit.prevent="handleRegister">
        <div class="row mb-2">
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Perfil</p>
            <select v-model="userType" class="form-select logcad-input">
              <option value="cliente">Tutor</option>
              <option value="medico">Veterinário</option>
            </select>
          </div>
          <div class="col-md-6">
            <p class="text-start txt_cadlog">E-mail*</p>
            <input type="email" class="form-control logcad-input" placeholder="name@email.com" v-model="email"
              required />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Nome*</p>
            <input type="text" class="form-control logcad-input" placeholder="Nome completo*" v-model="fullName"
              required />
          </div>
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Nome Social (opcional)</p>
            <input type="text" class="form-control logcad-input" placeholder="Nome Social" v-model="socialName" />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Gênero*</p>
            <select v-model="gender" class="form-select logcad-input">
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div class="col-md-6">
            <p class="text-start txt_cadlog">CPF*</p>
            <input type="text" class="form-control logcad-input" placeholder="123.456.789-10" v-model.lazy="user.cpf"
              @input="formatCPF" required maxlength="14" />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Senha*</p>
            <input type="password" class="form-control logcad-input" placeholder="Senha" v-model="password" required />
          </div>
          <div class="col-md-6">
            <p class="text-start txt_cadlog">Confirmar Senha*</p>
            <input type="password" class="form-control logcad-input" placeholder="Confirmar Senha"
              v-model="confirmPassword" required />
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-md" v-if="userType === 'medico'">
            <p class="text-start txt_cadlog">CRMV*</p>
            <input type="text" class="form-control logcad-input" placeholder="CRMV" v-model="crmv" required />
          </div>
        </div>
        <br>
        <button type="submit" class="btn btn-gradient w-100 logcad-button">Cadastrar</button>

        <hr />
        <p class="text-center">Já tem conta? <router-link class="create-account" to="/login">Entrar</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      userType: "cliente",
      email: "",
      fullName: "",
      socialName: "",
      gender: "masculino",
      user: {
        cpf: "",
      },
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    formatCPF(event) {
      let value = event.target.value.replace(/\D/g, "").slice(0, 11);
      if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      else if (value.length > 3) value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
      this.user.cpf = value;
    },
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("As senhas não coincidem");
        return;
      }

      const auth = getAuth();
      const db = getFirestore();

      try {
        // Cria o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

        // Atualiza o perfil do usuário com o nome completo
        await updateProfile(userCredential.user, {
          displayName: this.fullName,
        });

        // Salva os dados adicionais do usuário no Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          fullName: this.fullName,
          socialName: this.socialName || null,
          gender: this.gender,
          cpf: this.user.cpf,
          userType: this.userType,
          email: this.email,
          crmv: this.crmv || null,
        });

        // Redireciona para a homepage
        this.$router.push("/home");
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        alert("Erro ao registrar: " + error.message);
      }
    },
  },
};
</script>

<style scoped>

.logcad-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  width: 28rem;

}
.icon-container img {
  display: block;
  margin: 0 auto 1rem;
  width: 80px;
}
.logcad-header {
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #4A7C59; /* Verde escuro */
}
.logcad-input {
  border-radius: 10px;
  padding: 0.8rem;
  font-size: 1rem;
}
.logcad-input:focus {
  outline: none;
  border-color: #88BDBC; /* Verde suave */
  box-shadow: 0 0 4px rgba(136, 189, 188, 0.4);
}
.btn-gradient {
  background: linear-gradient(135deg, #4A7C59, #375A4C);
  color: #ffffff;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  transition: 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #375A4C, #2C4739);
  cursor: pointer;
  color: #ffffff;
}


.forgot-password,
.create-account {
  color: #4A7C59; /* Verde escuro */
  font-weight: 600;
}

.forgot-password:hover,
.create-account:hover {
  text-decoration: underline;
}

.txt_cadlog {
  font-weight: bold;
  color: #4A7C59;
}
</style>