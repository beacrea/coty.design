<template>
  <div id="workdetail">
    {{latestData.msg}}
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: 'This is a message',
      latestData: {
        updated: false,
        msg: ''
      }
    }
  },
  created: function () {
    this.$http.get('http://api.coty.design').then(response => {
      this.latestData.updated = true
      this.latestData.msg = response.data.coolguy
    }, response => {
      console.log('Error fetching latest version from Github repo.')
    })
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  // Imports
  @import "../globalStyles/global";

  #workdetail {}
</style>
