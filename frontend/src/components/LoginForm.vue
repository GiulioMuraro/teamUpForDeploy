<template>
    <div class="custom">
      <div class="flex flex-col items-center justify-center ch">
        <div class="w-full max-w-md p-6 bg-green-500 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-center text-white">Accedi</h2>
          <div v-if="error.status" class="mt-2 bg-white rounded-lg p-4 text-red-500 font-bold"> 
            <h1>
              {{error.message}}
            </h1>
          </div>
          <form class="mt-6 bg-white rounded-lg p-4" @submit.prevent="login">
            <div class="mt-4">
              <label class="block font-bold mb-2 text-gray-700" for="email">
                Email
              </label>
              <input v-model="this.user.email" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="email" type="email" placeholder="Inserisci la tua email" />
            </div>
            <div class="mt-4">
              <label class="block font-bold mb-2 text-gray-700" for="password">
                Password
              </label>
              <input v-model="this.user.password" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="password" type="password" placeholder="Inserisci la tua password" />
            </div>
            <div class="mt-6">
              <button class="w-full px-4 py-2 text-lg font-bold bg-green-500 text-white hover:text-green-500 hover:bg-white rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"  on-click="login()">
                Accedi
              </button>
            </div>
          </form>
          <hr class="my-6 border-white w-full" />
          <router-link to="SignUp">
          <p class="mt-8 text-center">
            Non hai ancora un account? <a class="text-gray-700 hover:text-white font-semibold">Registrati</a>
          </p>
        </router-link>
        </div>
      </div>
    </div>
  </template>
    

<script>
import { config } from "@/config";
import { defineComponent } from "vue";
import store from '@/store/index'
import router from '@/router';

export default defineComponent({
    name:"LoginForm",
    data (){
      return{
        user:{
          email:"",
          password:""
        },
        error: {
          status: false,
          message: "default message"
        }
      }

    },
    methods:{
      async login(){
        //console.log("request received")
        const opzioniRichiesta={
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(this.user)
        }
        //console.log(opzioniRichiesta.body);
        try{
          const res= await fetch(`${config.BASE_URL}/auth/login`, opzioniRichiesta);
          const data= await res.json();

          if(data.success){
            //console.log('user logged in ' + data.nome)
            store.commit('setToken', {user: data.nome, email: data.email, token: data.token})
            router.push({name: "DashBoard"})
          }

          else{
            //console.log("something went wrong")
            this.error.status=true;
            this.error.message= data?.error || data?.message || "Unexpected error"
            console.error(this.error.message)
          }
        }catch(error){
          this.error.status=true;
          this.error.message= error|| "Errore inaspettato"
        }
      }
    }
})
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
