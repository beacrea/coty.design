<template>
  <div id="work">{{msg}}</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: 'This is the work page.'
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
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
</style>
