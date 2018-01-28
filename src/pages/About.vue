<template>
  <main-layout>
    <div id="about">
      <header>
        <h1>Coty Beasley</h1>
        <h2>I'm a product designer based in San Francisco.</h2>
        <h3>I specialize in digital product strategy and interaction.</h3>
      </header>
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

<style scoped lang="scss">
  // Imports
  @import "../globalStyles/global";

  #about {
    padding: $padding_side;
    background: url('/static/img/about-bg.png') no-repeat top left;
    background-size: cover;
    display: flex;
    align-items: center;
  }
  header {
    margin-bottom: 25%;
    padding-right: 3.2rem;
  }
</style>