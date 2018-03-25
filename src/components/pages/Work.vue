<template>
  <div id="work">
    <header>
      <h1>Here's a bit of my work.</h1>
      <p>Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.</p>
      <p>A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.</p>
    </header>
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
@import "../../globalStyles/typography";

#work {
  overflow: scroll;
  font-size: 1.6rem;
  background-color: $color_dark;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    color: $color_light;
  }
}
header {
  padding: (3.2rem + $padding_side) $padding_side*2 3.2rem;
  /* Rectangle 5: */
  background-image: linear-gradient(-42deg, $color_accent3 0%, $color_blue-base 100%);
  h1 {
    margin: 0;
    font-size: $h2_size;
  }
}
</style>
