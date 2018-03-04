<template>
  <div id="app" v-bind:class="activeBg">
    <transition name="fade" mode="out-in" v-on:after-enter="afterEnter" appear>
      <router-view/>
    </transition>
    <Navigation v-on:pageChange="changeBG"></Navigation>
  </div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
  components: {Navigation},
  name: 'App',
  data () {
    return {
      activeBg: 'pg-' + this.$route.name
    }
  },
  methods: {
    changeBG: function (e) {
      this.activeBg = 'pg-' + this.$route.name
    },
    afterEnter: function (el, done) {
      console.log('Page changed to: ' + this.$route.name)
    }
  }
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
  background: #0B0E1F no-repeat top center;
  background-size: cover;
  color: $color_light;
  transition-duration: 1s;
  > div {
    flex: 1 1 auto;
  }
  &.pg-intro {
    background-image: url('/static/img/bg-about-sm.jpg');
  }
  &.pg-stats {
    background-image: url('/static/img/bg-stats.jpg');
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
