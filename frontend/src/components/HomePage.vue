
<template>
  <div class="custom">
      <div v-if="!authenticated" class="flex flex-col justify-center items-center ch">
        
        <router-link to="Prenotazione">
          <button class="bg-green-600 text-white rounded-lg shadow-2xl my-4 py-2 px-4 w-60">Prenota un campo!</button>
        </router-link>
        
        <router-link to="Login">
          <button class="bg-black rounded-lg shadow-2xl text-white my-4 py-2 px-4 w-44">Accedi</button>
        </router-link>
        
        <router-link to="SignUp">
          <button class="bg-black rounded-lg shadow-2xl text-white my-4 py-2 px-4 w-44">Registrati</button>
        </router-link>
      </div>
      
      <div v-else class="flex flex-col justify-center items-center ch">
        
        <router-link to="Prenotazione">
          <button class="bg-green-600 text-white rounded-lg shadow-2xl my-4 py-2 px-4 w-60">Prenota un campo!</button>
        </router-link>
        
        <router-link to="Dashboard">
          <button class="bg-black rounded-lg shadow-2xl text-white my-4 py-2 px-4 w-44">Dashboard</button>
        </router-link>
        
        <router-link to="SignUp">
          <button class="bg-black rounded-lg shadow-2xl text-white my-4 py-2 px-4 w-44">Registrati</button>
        </router-link>
      </div>
  </div>
</template>
<script>

import store from '@/store/index'

export default {
  data(){
    return{
      authenticated: false
    }
  },
  mounted(){
      if(store.state.token){        
      this.authenticated = true
      }
    },
}
</script>
<style scoped>
  .custom{
    background-image: url("../images/sfondo.webp");
    background-size: cover;
    background-position:center;
    resize: both;
  }
  .ch{
    min-height: 90vh;
  }
</style>
