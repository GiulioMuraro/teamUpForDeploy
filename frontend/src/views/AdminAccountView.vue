<template>
    <div >
        <NavBar/>
        <AdminFieldsComponent/>
        <AdminReportsComponent/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import AdminFieldsComponent from '@/components/AdminFieldsComponent.vue';
  import AdminReportsComponent from '@/components/AdminReportsComponent.vue';
  
  export default {
    name: 'AdminAccountView',
    components: {
      NavBar,
      AdminFieldsComponent,
      AdminReportsComponent
    }
  }
  </script>