<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// Imports
@import "globalStyles/global";

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
