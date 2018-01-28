<template>
  <div id="navigation">
    <nav>
      <v-link href="/">Home</v-link>
      <v-link href="/about">About</v-link>
    </nav>
  </div>
</template>


<script>
  import VLink from '../components/VLink.vue'

  export default {
    components: {
      VLink
    },
    data() {
      return {
        msg: 'This is a message'
      }
    }
  }
</script>

<style scoped lang="scss">
  // Imports
  @import "../globalStyles/global";

  #navigation {
    background: $color_dark;
    color: $color_light;
    padding: 1.2rem $padding_side;
    * {
      box-sizing: border-box;
    }
  }
  a {
    display: inline-block;
    text-decoration: none;
    padding: 0.4rem 1.6rem;
    margin-right: $padding_side/3;
    border-radius: 1.2rem;
    border: 1px solid $color_grey;
    background: $color_dark;
    color: $color_grey;
    &.active {
      color: $color_light;
      background: $color_blue-base;
      border-color: rgba(255,255,255,0.23);
      box-shadow: 0 0 4px 0 rgba(121,178,235,0.62), 0 0 20px 0 rgba(121,178,235,0.20), 0 0 4px 0 rgba(0,0,0,0.50), inset 0 2px 3px 0 rgba(0,0,0,0.03);
    }
  }
</style>
