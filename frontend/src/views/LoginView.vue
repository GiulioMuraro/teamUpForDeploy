<template>
    <div >
        <NavBar/>
        <LoginForm/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import LoginForm from '@/components/LoginForm.vue'
  
  export default {
    name: 'LoginView',
    components: {
      NavBar, 
      LoginForm
    }
  }
  </script>