<template>
  <main-layout>
    <div id="resume">
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
        msg: 'This is the resume page.'
      }
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #resume {
    padding: $padding_side;
    background: $color_blue-shade;
  }
</style>