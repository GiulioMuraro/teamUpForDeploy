<template>
    <div >
        <NavBar/>
        <DashBoard/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import DashBoard from '@/components/DashBoard.vue';  
  import store from '@/store/index';
  import router from '@/router';
  
  export default {
    name: 'DashBoardView',
    components: {
      NavBar, 
      DashBoard,
    },
    mounted(){
      if(!store.state.token){        
      router.replace({name: "Login"})      
      //console.log("utente non autenticato")
      }
    },
  }
  </script>