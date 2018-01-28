<template>
  <main-layout>
    <span>{{msg}}</span>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'

  export default {
    components: {
      MainLayout
    },
    data() {
      return {
        msg: 'This is the about page.'
      }
    }
  }
</script>
