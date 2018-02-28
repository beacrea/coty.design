<template>
  <main-layout>
    <div id="work">
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
        msg: 'This is the stats page.'
      }
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #work {
    padding: $padding_side;
    background: $color_blue-shade;
  }
</style>