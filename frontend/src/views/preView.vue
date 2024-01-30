<template>
    <div >
        <NavBar/>
        <prePage/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import prePage from '@/components/prePage.vue'
  
  export default {
    name: 'preView',
    components: {
      NavBar, 
      prePage,
    },
    
  }
  </script>