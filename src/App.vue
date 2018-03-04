<template>
  <div id="app">
    <transition name="fade" mode="out-in" v-on:after-enter="afterEnter" appear>
      <router-view/>
    </transition>
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
  background: url('/static/img/stats-bg.jpg') no-repeat top left;
  background-size: cover;
  color: $color_light;
  > div {
    flex: 1 1 auto;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
