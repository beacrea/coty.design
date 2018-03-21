<template>
  <div id="work">
    <h3>Cobblers children and all that.</h3>
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
  color: $color_light;
  font-size: 1.6rem;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  h3 {
    font-size: 1.8rem;
  }
  h4, p {
    color: $color_light;
  }
  p, a {
    font-size: 1.4rem;
  }
}
</style>
