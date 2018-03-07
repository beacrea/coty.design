<template>
  <div id="contact">
   <section>
     <p>{{msg}}</p>
   </section>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      msg: 'This is the contact page.'
    }
  }
}
</script>

<style lang="scss" scoped>
// Imports
@import "../../globalStyles/imports";
@import "../../globalStyles/vars";

#contact {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 100%;
  padding: $padding_side;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
</style>
