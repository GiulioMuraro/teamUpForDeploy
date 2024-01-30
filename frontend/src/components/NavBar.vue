<template>
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

</script>
