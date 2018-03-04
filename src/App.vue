<template>
  <div id="app">
    <router-view/>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
  components: {Navigation},
  name: 'App'
}
</script>

<style lang="scss">
// Imports
@import "globalStyles/global";

#app {
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: $color_light;
  > div {
    flex: 1 1 auto;
  }
}
</style>
