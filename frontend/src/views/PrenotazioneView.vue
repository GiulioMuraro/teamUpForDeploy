<template>
    <div >
      <NavBar />
      <PrenotazioneForm />
    </div>
  </template>
  
  <script>
  import PrenotazioneForm from '@/components/PrenotazioneForm.vue';  
  import NavBar from '@/components/NavBar.vue';
  import store from '@/store/index';
  import router from '@/router';
  
  export default {
    components: {
      PrenotazioneForm,      
      NavBar
    },
    mounted(){
      if(!store.state.token){        
      router.replace({name: "Login"})      
      //console.log("utente non autenticato")
      }
    },
  };
  </script>
  