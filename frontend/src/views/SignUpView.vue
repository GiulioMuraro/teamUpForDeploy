<template>
    <div >
      <NavBar/>
      <SignUp/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import SignUp from '@/components/SignUp.vue'
  import NavBar from '@/components/NavBar.vue'
  
  export default {
    name: 'SignUpView',
    components: { 
      SignUp,
      NavBar
    }
  }
  </script>