<template>
  <main-layout>
    <div id="home">
      <span>{{msg}}</span>
    </div>
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
        msg: 'This is the home page.'
      }
    }
  }
</script>
