<template>
  <div id="work">
    <header>
      <h1>Here's a bit of my work.</h1>
      <p>Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.</p>
      <p>A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.</p>
    </header>
    <section>
      <div class="item" v-for="item in workItems" :key="item.id">
        <div class="preview"></div>
        <div class="content">
          <h1>{{item.project.title}}</h1>
          <div class="text">{{item.project.shortDesc}}</div>
          <div class="cta">
            <span>READ MORE</span>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import work from '../../../data/work'

export default {
  components: {},
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
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    color: $color_light;
  }
}
header {
  padding: (3.2rem + $padding_side) $padding_side*2 3.2rem;
  background-image: linear-gradient(-42deg, $color_accent3 0%, $color_blue-base 100%);
  h1 {
    margin: 0;
    font-size: $h2_size;
  }
}
section {
  padding: 0 $padding_side;
}
#work .item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  cursor: pointer;
  margin: 6.4rem auto 0;
  .preview, .content {
    border-radius: 0.25rem;
    box-shadow: 0.25rem 0.25rem 1rem rgba(black, 0.5);
  }
  .preview {
    grid-column-start: 1;
    grid-column-end: 12;
    grid-row-start: 1;
    grid-row-end: 7;
    background-image: linear-gradient(-20deg, #666 0%, #999 100%);
  }
  .content {
    transition: all 0.5s;
    &:hover {
      transform: scale(1.02);
    }
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1.6rem;
    grid-column-start: 2;
    grid-column-end: 13;
    grid-row-start: 5;
    grid-row-end: 10;
    background: $denim;
    h1 {
      margin-top: 0;
      font-size: $h3_size;
    }
    .text {
      opacity: 0.75;
    }
    .cta {
      margin-top: 1.6rem;
      text-align: right;
      font-weight: bold;
    }
  }
}

/* Tablets+ */
@media screen and (min-width: 35rem) {
  section {
    padding: 6.4rem $padding_side*2 0;
  }
  .item {
    height: 400px;
    margin: 3.2rem auto;
  }
  .content {
    max-height: 15rem;
  }
}
</style>
