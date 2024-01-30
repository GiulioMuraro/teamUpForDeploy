<template>
  <div >
    <NavBar/>
    <HomePage/>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import HomePage from '@/components/HomePage.vue'
import store from '@/store/index'
import router from '@/router'

export default {
  name: 'HomeView',
  components: {
    NavBar, 
    HomePage,
  },
  mounted(){
      if(store.state.token){        
      router.replace({name: "DashBoard"})      
      }
    },
}
</script>
