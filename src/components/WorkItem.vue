<template>
  <nav id="workitem">
    {{projectData.id}}
  </nav>
</template>

<script>
export default {
  components: {},
  props: ['projectData'],
  data () {
    return {
      msg: 'This is a message'
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  // Imports
  @import "../globalStyles/global";

  #workitem {
    overflow: scroll;
    font-size: 1.6rem;
    padding-bottom: 6.4rem;
    color: $color_dark;
  }
</style>
