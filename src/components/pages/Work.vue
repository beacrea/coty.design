<template>
  <div id="work">
    <header>
      <h1>Here's a bit of my work.</h1>
      <p>Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.</p>
      <p>A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.</p>
    </header>
    <section>
      <WorkItem :projectData='item' v-for="item in workItems" :key="item.id + 0"></WorkItem>
    </section>
  </div>
</template>

<script>
import work from '../../../data/work'
import WorkItem from '../WorkItem'

export default {
  components: {WorkItem},
  data () {
    return {
      workItems: work
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
  padding-bottom: 6.4rem;
  color: $color_light;
  h1 {
    color: $color_light;
  }
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
header {
  padding: 5.6rem $padding_side*2;
  background-image: linear-gradient(-42deg, $color_accent3 0%, $color_blue-base 100%);
  h1 {
    margin: 0;
    font-size: $h2_size;
  }
}
section {
  padding: 0 $padding_side;
}
/* Tiny Phones */
@media screen and (max-width: 40rem) {
  #work {
    section {
      padding: 0 1.6rem !important;
    }
  }
}
/* Tablets+ */
@media screen and (min-width: 35rem) {
  #work {
    section {
      padding: 6.4rem $padding_side*2 0;
    }
  }
}
</style>
