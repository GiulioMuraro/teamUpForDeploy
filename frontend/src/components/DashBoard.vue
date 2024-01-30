<template>
  <div class="custom ">
    <div class="container-h  ch">
      <div class="w-full max-w-md p-6 bg-green-500 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-white" style="text-transform: capitalize;">Ciao {{ this.datiUtente.nome }}!</h2>
        
        <div class="mt-6 bg-white rounded-lg p-4 ">
          <router-link to="Prenotazione">
            <button class="w-full my-4 px-4 py-2 text-lg font-bold bg-green-500 text-white hover:text-green-500 hover:bg-white rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Prenota un campo!
            </button>
          </router-link>

          <router-link to="preffettuate">
            <button class="w-full my-4 px-4 py-2 text-lg font-bold bg-green-500 text-white hover:text-green-500 hover:bg-white rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Prenotazioni
            </button>
          </router-link>

          <button @click.prevent="logout" class="w-full my-4 px-4 py-2 text-lg font-bold bg-green-500 text-white hover:text-green-500 hover:bg-white rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datiUtente: {
        nome: this.$store.getters.getUser
      },
    };
  },
  methods: {
    logout() {
      // Chiama la mutazione `clearToken` nello store
      this.$store.commit('clearToken');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
 .container-v {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container-h {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .custom {
    background-image: url("../images/sfondo.webp");
    background-size: cover;
    background-position: center;
    resize: both;
  }
  .ch {
    min-height: 90vh;
  }
</style>
