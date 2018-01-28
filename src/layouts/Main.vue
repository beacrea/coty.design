<template>
  <div id="app">
    <Nav></Nav>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
  import Nav from '../components/Navigation.vue'

  export default {
    components: {
      Nav
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #app {
    display: flex;
    flex-direction: column;
  }

  main {
    padding: $padding_side;
    background: #f9f7f5;
  }
</style>
