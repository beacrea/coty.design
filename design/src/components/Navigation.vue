<template>
  <nav id="navigation">
    <router-link to="intro" v-on:click.native="changeBg">Intro</router-link>
<!--    <router-link to="work" v-on:click.native="changeBg">Work</router-link>-->
    <router-link to="stats" v-on:click.native="changeBg">Stats</router-link>
    <router-link to="contact" v-on:click.native="changeBg">Contact</router-link>
<!--    <a href="https://labs.coty.design" target="_blank">Labs</a>-->
    <a href="https://coty.blog" target="_blank">Blog</a>
  </nav>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: 'This is a message'
    }
  },
  methods: {
    changeBg: function () {
      this.$emit('pageChange')
      this.$emit('introStatus', 0)
    }
  }
}
</script>

<style scoped lang="scss">
// Imports
@import "../globalStyles/global";

#navigation {
  $height: $navHeight;

  background: black;
  color: $color_light;
  padding: 1.2rem $padding_side;
  max-height: $height;
  min-height: $height;
  height: $height;
  display: flex;
  align-items: center;
  z-index: 3;
  * {
    box-sizing: border-box;
  }
}
a {
  $inactiveColor: rgba(white, 0.4);

  display: inline-block;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  flex: 1 auto;
  font-size: 1.4rem;
  text-align: center;
  margin-right: $padding_side/3;
  border-radius: 1.2rem;
  border: 1px solid $inactiveColor;
  color: $inactiveColor !important;
  cursor: pointer;
  transition-duration: 1s;
  &.icon {
    $size: 4.8rem;
    text-align: center;
    width: $size;
    max-width: $size;
    max-height: 2.4rem;
    height: $size/2;
  }
  &.router-link-active {
    color: white !important;
    background: $color_accent1;
    border-color: rgba(255,255,255,0.23);
    box-shadow: 0 0 4px 0 rgba(240,96,103,0.62), 0 0 20px 0 rgba(240,96,103,0.20), 0 0 4px 0 rgba(0,0,0,0.50), inset 0 2px 3px 0 rgba(0,0,0,0.03);
  }
}
</style>
