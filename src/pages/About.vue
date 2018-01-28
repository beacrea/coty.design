<template>
  <main-layout>
    <div id="about">
      <section id="intro">
        <header>
          <h1>Coty Beasley</h1>
          <h2>I'm a product designer based in San Francisco.</h2>
          <h3>I specialize in digital product strategy and interaction.</h3>
        </header>
        <img src="/static/img/arrow-down.png" alt="">
      </section>
      <section id="qa1">
        <header>
          <h1>Coty Beasley</h1>
          <h2>I'm a product designer based in San Francisco.</h2>
          <h3>I specialize in digital product strategy and interaction.</h3>
        </header>
        <img src="/static/img/arrow-down.png" alt="">
      </section>
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
    flex-direction: column;
    overflow-y: scroll;
    height: 100%;
  }
  section {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    align-items: center;
    header {
      text-align: left;
      align-self: flex-start;
      flex-direction: column;
      flex: 100%;
      display: flex;
      justify-content: center;
    }
    &#intro {
      img {
        width: 5.8rem;
        height: 4.1rem;
        display: inline-block;
      }
    }
  }
  header {
    margin-bottom: 25%;
    padding-right: 3.2rem;
  }
</style>