<template>
  <main-layout>
    <div id="about">
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
        msg: 'This is the about page.'
      }
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #about {
    padding: $padding_side;
    background: url('/static/img/about-bg.png') no-repeat top center;
    background-size: cover;
  }
</style>