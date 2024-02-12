<template>
  <div class="custom min-h-screen flex justify-center items-center">
    <div class="form-container bg-green-600 flex flex-col justify-center items-center rounded-xl">
      <h1 class="font-bold text-3xl mb-6 mt-7 white-text">Modifica le informazioni:</h1>
      <form @submit.prevent="submitForm" class="w-5/6">
        <div class="form-group flex flex-col">
          <label for="oldName" class="white-text text-left font-bold mt-1">Old name</label>
          <input type="text" id="oldName" placeholder="Enter old username..." v-model="utente.oldName" class="black-text w-full rounded-lg" required>
        </div>
        <div class="form-group flex flex-col">
          <label for="newName" class="white-text text-left font-bold mt-2">New name</label>
          <input type="text" id="newName" placeholder="Enter new username..." class="black-text w-full rounded-lg">
        </div>
        <div class="form-group flex flex-col">
          <label for="oldEmail" class="white-text text-left font-bold mt-2">Old email</label>
          <input type="email" id="oldEmail" placeholder="Enter old email..."  v-model="utente.oldEmail" class="black-text w-full rounded-lg" required>
        </div>
        <div class="form-group flex flex-col">
          <label for="newEmail" class="white-text text-left font-bold mt-2">New email</label>
          <input type="email" id="newEmail" placeholder="Enter new email..." class="black-text w-full rounded-lg">
        </div>
        <div class="form-group flex flex-col">
          <label for="oldPassword" class="white-text text-left font-bold mt-2">Old password</label>
          <input type="password" id="oldPassword" v-model="utente.oldPassword" placeholder="Enter old password to confirm the modification..." class="black-text w-full rounded-lg" required>
        </div>
        <div class="form-group flex flex-col">
          <label for="newPassword" class="white-text text-left font-bold mt-2">New password</label>
          <input type="password" id="newPassword" placeholder="Enter new password..." class="black-text w-full rounded-lg">
        </div>
        <button type="submit" class="white-text rounded-lg bg-green-800 w-2/5 mr-0 mt-3 mb-3">Save</button>
      </form>
    </div>
  </div>
</template>
  
<script>

import { defineComponent } from 'vue'
import { config } from '@/config';
import store from '@/store/index';
import router from '@/router';

export default defineComponent({
  name: 'ProfileComponent',
  components:{
    
  },
  data() {
    return {
      utente: {
        oldName: "",
        oldEmail: "",
        oldPassword: ""
      }
    };
  },
  methods: {
    // Send the http request to modify user data/info
    async submitForm() {
      // Create the json to send as body for the HTTP request
      const bodyRequest = {
        newName: document.getElementById('newName').value,
        oldEmail: this.utente.oldEmail,
        newEmail: document.getElementById('newEmail').value,
        oldPassword: document.getElementById('oldPassword').value,
        newPassword: document.getElementById('newPassword').value
      }

      // Make HTTP request to fetch fields from the database
      try {
        const res = await fetch(`${config.BASE_URL}/auth/modifyinfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequest)
        });
        const data = await res.json();

        if(res.status === 200){
          // Update the store with the new values
          store.dispatch('updateUser', { user: bodyRequest.newName || this.utente.oldName, email: bodyRequest.newEmail || this.utente.oldEmail });
          
          // Notify the user if the result is 200 - OK
          alert(data.message);
          router.push('/dashboardView');
        }

        if(!data.success){
            console.log("Errore nella ricezione delle prenotazioni: " + res.error);
        }
      } catch (error) {
          console.error("Errore nell'invio della richiesta di modifica dei dati utente: " + error);
      }
    },
    async retrieveOldInfo(){
      // Make HTTP request to fetch fields from the database
      try {
        const res = await fetch(`${config.BASE_URL}/auth/getuserinfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: store.getters.getEmail })
        });
        const data = await res.json();
        if(res.status === 200){
          const oldInfo = data.message;

          this.utente.oldName = oldInfo.nome;
          this.utente.oldEmail = oldInfo.email;
        }
        else{
            console.log("Errore nella ricezione delle info dello user: " + res.error);
        }
      } catch (error) {
          console.error("Errore nell'invio della richiesta di modifica dei dati utente: " + error);
      }
    }
  },
});

</script>

<style>

.white-text {
color: white;
}

.black-text {
color: black;
}

.custom{
  background-image: url("../images/sfondo.webp");
  background-color: gray;
  background-size: cover;
  background-position:center;
  resize: both;

}

.form-container {
  max-width: 1000px; /* Adjust this value as needed */
  width: 100%;  
} 
</style>
