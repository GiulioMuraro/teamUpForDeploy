<template>
    <div >
        <NavBar/>
        <ReportForm/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import NavBar from '@/components/NavBar.vue'
  import ReportForm from '@/components/ReportForm.vue';
  
  export default {
    name: 'ReportView',
    components: {
      NavBar, 
      ReportForm
    }
  }
  </script>