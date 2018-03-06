<template>
  <div id="app" v-bind:class="activeBg">
    <span id="overlay" v-bind:style="{ opacity: blurAbout }"></span>
    <transition name="fade" mode="out-in" v-on:after-enter="afterEnter" appear>
      <router-view v-on:introStatus="introBlurred" v-on:pageChange="changeBG" />
    </transition>
    <Navigation v-on:pageChange="changeBG" v-on:introStatus="introBlurred"></Navigation>
  </div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
  components: {Navigation},
  name: 'App',
  data () {
    return {
      activeBg: 'pg-' + this.$route.name,
      blurAbout: 0
    }
  },
  methods: {
    changeBG: function (e) {
      this.activeBg = 'pg-' + this.$route.name
    },
    introBlurred: function (trigger) {
      this.blurAbout = trigger
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
  position: relative;
  z-index: 0;
  > div {
    flex: 1 1 auto;
    z-index: 2;
    -webkit-transform:translateZ(0px);
  }
  &.pg-intro {
    background-image: url('/static/img/bg-about-sm.jpg');
  }
  &.pg-intro-blurred {
    background-image: url('/static/img/bg-about-sm-blurred.jpg');
  }
  &.pg-stats {
    background-image: url('/static/img/bg-stats.jpg');
  }
}

/* Tablets+ */
@media screen and (min-width: 76rem) {
  #app > div:not(#navigation) {
    padding: 0 $padding_side*2 !important;
  }
}

// Overlay
#overlay {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition-duration: 2s;
  z-index: 0 !important;
  background-image: url('/static/img/bg-about-sm-blurred.jpg');
}

// Transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
