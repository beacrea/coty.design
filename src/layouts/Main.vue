<template>
  <div id="app">
    <slot></slot>
    <Navigation></Navigation>
  </div>
</template>

<script>
  import Navigation from '../components/Navigation.vue'

  export default {
    components: {
      Navigation
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: $color_light;
    > div {
      flex: 1 1 auto;
    }
  }
</style>
