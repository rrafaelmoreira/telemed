<template>
    <div class="pet-management">
      <h1>Adicionar Pet</h1>
      <form @submit.prevent="addPet">
        <div>
          <label for="petName">Nome do Pet:</label>
          <input id="petName" v-model="newPet.name" type="text" required>
        </div>
        <div>
          <label for="species">Espécie:</label>
          <select id="species" v-model="newPet.species">
            <option value="cão">Cão</option>
            <option value="gato">Gato</option>
            <option value="pássaro">Pássaro</option>
            <!-- Adicione mais opções conforme necessário -->


          </select>
        </div>
        <div>
          <label for="breed">Raça:</label>
          <input id="breed" v-model="newPet.breed" type="text">
        </div>
        <div>
          <label for="age">Idade:</label>
          <input id="age" v-model="newPet.age" type="text">
        </div>
        <div>
          <label for="sex">Sexo:</label>
          <select id="sex" v-model="newPet.sex">
            <option value="macho">Macho</option>
            <option value="fêmea">Fêmea</option>
            <option value="desconhecido">Desconhecido</option>
          </select>
        </div>
        <div>
          <label for="weight">Peso:</label>
          <input id="weight" v-model="newPet.weight" type="text">
        </div>
        <div>
          <label for="color">Cor:</label>
          <input id="color" v-model="newPet.color" type="text">
        </div>
        <div>
          <label for="microchip">Identificação (opcional):</label>
          <input id="microchip" v-model="newPet.microchip" type="text">
        </div>
        <div>
          <label>Vacinação:</label>
          <div>
            <input type="checkbox" id="vaccine1" v-model="newPet.vaccinations">
            <label for="vaccine1">Vacina X</label>
          </div>
          <!-- Repita para outras vacinas -->
        </div>
        <div>
          <label for="conditions">Condições Médicas Preexistentes:</label>
          <textarea id="conditions" v-model="newPet.conditions"></textarea>
        </div>
        <div>
          <label for="allergies">Alergias:</label>
          <textarea id="allergies" v-model="newPet.allergies"></textarea>
        </div>
        <div>
          <label for="photo">Foto do Pet:</label>
          <input id="photo" type="file" @change="onFileChange">
        </div>
        <div>
          <label for="ownerName">Nome do Dono ou Responsável:</label>
          <input id="ownerName" v-model="newPet.ownerName" type="text" disabled value="Nome do Dono">
        </div>
        <div>
          <label for="emergencyContact">Contato de Emergência:</label>
          <input id="emergencyContact" v-model="newPet.emergencyContact" type="text">
        </div>
        <button type="submit">Salvar Pet</button>
      </form>
    </div>
  </template>
<script>
import { ref } from 'vue';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
  name: 'PetManagement',
  setup() {
    const newPet = ref({
      name: '',
      species: '',
      breed: '',
      age: '',
      sex: '',
      weight: '',
      color: '',
      microchip: '',
      vaccinations: [],
      conditions: '',
      allergies: '',
      photo: null,
      ownerName: 'Nome do Dono', // Supondo que você vai buscar isso da autenticação ou de um estado global
      emergencyContact: ''
    });

    const addPet = async () => {
      try {
        await addDoc(collection(db, "pets"), newPet.value);
        alert("Pet adicionado com sucesso!");
        // Limpar o formulário ou redirecionar o usuário
      } catch (error) {
        console.error("Erro ao adicionar pet:", error);
      }
    };

    const onFileChange = (e) => {
      const file = e.target.files[0];
      newPet.value.photo = file; // Supondo que você trate o upload separadamente
    };

    return { newPet, addPet, onFileChange };
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
