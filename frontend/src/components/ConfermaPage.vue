<template>
    <div class="custom">
      <div class="flex justify-center items-center min-h-screen ch">
        <div class="w-full max-w-lg p-6 bg-green-500 rounded-lg shadow-md">          
        <h2 class="text-4xl font-bold text-white">Prenotazione Confermata!</h2>   
        <div class="mt-6 bg-white rounded-lg p-4 flex justify-center items-center">          
          <img src="@/images/qr-code.webp" alt="qr" class=" max-h-80">
        </div>
        <hr class="my-6 border-whitew-full" />
        <button v-on:click="Home()"
            class="mt-2 hover:bg-green-700 hover:text-white text-green-700 bg-white font-medium rounded-full shadow-md text-base px-5 py-2">
            Home</button>
        </div>
      </div>
    </div>
  </template>
    

<script>
import { defineComponent } from "vue";
import router from '@/router';

export default defineComponent({
    name:"ConfermaPage",    
    methods:{
    async Home(){
      router.push({name: "DashBoard"})
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
  .ch {
    min-height: 90vh;
  }
</style>
