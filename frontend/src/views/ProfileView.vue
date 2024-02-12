<template>
    <div >
      <NavBar/>
      <ProfileComponent ref="profileComponent"/>
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
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$refs.profileComponent.retrieveOldInfo(); // Call retrieveOldInfo() when entering the route
      });
    }
  }
  </script>