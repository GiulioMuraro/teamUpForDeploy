<template>
  <div class="custom">
    <div class="flex flex-col items-center justify-center ch">
      <div class="w-full max-w-md p-6 bg-green-500 rounded-lg shadow-md">
        <h2 class="text-4xl font-bold text-center text-white">Registrati</h2>
        <div v-if="error.status" class="mt-2 bg-white rounded-lg p-4 text-red-500 font-bold">
          <h1>{{ error.message }}</h1>
        </div>
        <form class="mt-6 bg-white rounded-lg p-4" @submit.prevent="signin">
          <div>
            <label class="block font-bold mb-2 text-gray-700" for="username">
              Nome utente
            </label>
            <input v-model="user.nomeUtente" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="username" type="text" placeholder="Inserisci il tuo nome utente" />
          </div>
          <div class="mt-4">
            <label class="block font-bold mb-2 text-gray-700" for="email">
              Email
            </label>
            <input v-model="user.email" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="email" type="email" placeholder="Inserisci la tua email" />
          </div>
          <div class="mt-4">
            <label class="block font-bold mb-2 text-gray-700" for="password">
              Password
            </label>
            <input v-model="user.password" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="password" type="password" placeholder="Inserisci la tua password" />
          </div>
          <div class="mt-4">
            <label class="block font-bold mb-2 text-gray-700" for="password-confirm">
              Conferma password
            </label>
            <input v-model="user.password2" class="w-full px-4 py-2 rounded-lg shadow-md border border-gray-400 focus:outline-none focus:border-white" id="password-confirm" type="password" placeholder="Inserisci di nuovo la tua password" />
          </div>
          <div class="mt-6">
            <button class="w-full px-4 py-2 text-lg font-bold bg-green-500 text-white hover:text-green-500 hover:bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Registrati
            </button>
          </div>
        </form>
        <hr class="my-6 border-gray-300 w-full" />
        <router-link to="/login">
          <p class="mt-8 text-center">
            Hai già un account? <a class="text-gray-700 hover:text-white font-semibold">Accedi</a>
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from '@/config'
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SignUp',
  data() {
    return {
      user: {
        email: '',
        password: '',
        password2: '',
        nomeUtente: '',
      },
      error: {
        status: false,
        message: 'default error message',
      },
    }
  },
  methods: {
    async signin() {
      if (this.user.password !== this.user.password2) {
        this.error.status = true
        this.error.message = 'Le password inserite non coincidono!'
        return
      }

      const opzioniRichiesta = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.user),
      }

      try {
        const res = await fetch(`${config.BASE_URL}/auth/signin`, opzioniRichiesta)
        const data = await res.json()

        if (data.success) {
          router.push({ name: 'Login' })
        } else {
          this.error.status = true
          this.error.message = data?.error || data?.message || 'Unexpected error'
        }
      } catch (error) {
        this.error.status = true
        this.error.message = error.message || 'Failed to fetch'
      }
    },
  },
})
</script>

<style scoped>
.custom {
  background-image: url('../images/sfondo.webp');
  background-size: cover;
  background-position: center;
  resize: both;
}

.ch {
  min-height: 90vh;
}
</style>
