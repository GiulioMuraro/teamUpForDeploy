<!-- <template>
  <router-link to="/">
  <div v-if="$route.name == 'SignUp'" class="bg-gray-800 h-20 flex justify-center items-center">
  <img src="@/images/logoEnlarged.webp" alt="Logo" class="max-h-full max-w-80">
  <h1 class="text-3xl text-white font-bold">Registrati</h1>
</div>
<div v-else class="bg-gray-800 h-20 flex justify-center items-center">
  <img src="@/images/logo.webp" alt="Logo" class="max-h-full max-w-80">
</div>
</router-link>
</template>

<script>

export default {
  name: 'NavBar',
}

</script> -->

<template>
  <div>
    <div v-if="$route.path == '/dashboardView' || $route.path == '/'" class="bg-gray-800 h-20 flex justify-center items-center">
      <img src="../images/logo.webp" alt="Logo" class="max-w-80 mx-auto">
      <OptionsButton v-if = "$route.path == '/dashboardView'" class="mr-5"/>
    </div>
    <div v-else class="bg-gray-800 h-20 flex justify-start items-center">
      <router-link v-if="checkAdmin" to = '/adminAccountView'>
        <img src="../images/logoEnlarged.webp" alt="Logo" class="h-12 w-auto ml-20">
      </router-link>
      <router-link v-else to = '/dashboardView'>
        <img src="../images/logoEnlarged.webp" alt="Logo" class="h-12 w-auto ml-20">
      </router-link>
      <h1 v-if="$route.path == '/loginView'" class="text-3xl text-white ml-3">LogIn</h1>
      <h1 v-else-if="$route.path == '/signUpView'" class="text-3xl text-white ml-3">SignUp</h1>
      <h1 v-else-if="$route.path == '/bookingView'" class="text-3xl text-white ml-3">Booking</h1>
      <h1 v-else-if="$route.path == '/adminAccountView'" class="text-3xl text-white ml-3">Admin Account</h1>
      <h1 v-else-if="$route.path == '/profileView'" class="text-3xl text-white ml-3">Profile</h1>
      <h1 v-else-if="$route.path == '/reportView'" class="text-3xl text-white ml-3">Report</h1>
      <OptionsButton v-if = "showOptionsButton" class="ml-auto mr-5"/>
    </div>
  </div>
</template>

<script>

import OptionsButton from './OptionsButton.vue'
import store from '@/store';

export default {
  name: 'NavBar',
  components:{
    OptionsButton
  },
  computed: {
    checkAdmin(){
      if(store.getters.getRuolo == 'Admin'){
        return true;
      }
      else return false;
    },
    showOptionsButton() {
      // Show the OptionsButton on routes that are not the loginView and SignUpview
      return this.$route.path !== '/loginView' && this.$route.path !== '/signUpView';
    }
  },
}

</script>
