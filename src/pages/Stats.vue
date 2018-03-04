<template>
  <main-layout>
    <div id="stats">
      <li v-for="item in stats" :key="item.name">
        {{ item.name }}
      </li>
    </div>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'
  import model from '../../data/stats'

  export default {
    components: {
      MainLayout
    },
    data() {
      return {
        msg: 'This is the stats page.',
        stats: model.items
      }
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #stats {
    padding: $padding_side;
    background: $color_blue-shade;
  }
</style>