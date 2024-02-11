<template>
    <div >
      <NavBar/>
      <ProfileComponent/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import ProfileComponent from '@/components/Profile.vue'
  
  export default {
    name: 'ProfileView',
    components: {
      NavBar, 
      ProfileComponent,
    }
  }
  </script>