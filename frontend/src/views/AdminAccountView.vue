<template>
  <div>
      <NavBar/>
      <AdminFieldsReportsComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AdminFieldsReportsComponent from '@/components/AdminFieldsReportsComponent.vue';

export default {
  name: 'AdminAccountView',
  components: {
    NavBar,
    AdminFieldsReportsComponent,
  }
}
</script>
