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
    background: black;
    color: white;
    padding: ($padding_side/2);
  }
  a {
    margin: 0 ($padding_side/2);
    text-decoration: none;
    &:active, &:visited {
      color: orange;
    }
  }
</style>
