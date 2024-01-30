<template>
    <div >
      <NavBar/>
      <Conferma/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import Conferma from '@/components/ConfermaPage.vue'
  
  export default {
    name: 'ConfermaView',
    components: {
      NavBar, 
      Conferma,
    }
  }
  </script>
  