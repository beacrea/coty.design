<template>
  <div id="work">
    <h3>This page is currently being designed.</h3>
    <h4>Cobblers children and all that.</h4>
    <p>I am literally <a href="https://github.com/beacrea/cotybeasley.name/issues/13" target="_blank">working on this</a> right now.</p>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<style lang="scss" scoped>
// Imports
@import "../../globalStyles/imports";
@import "../../globalStyles/vars";

#work {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  justify-content: center;
  align-items: center;
  padding: $padding_side;
  text-align: center;
  color: $color_dark;
  font-size: 1.6rem;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  h4, p {
    color: rgba(black, 0.6)
  }
  p, a {
    font-size: 1.4rem;
  }
}
</style>
