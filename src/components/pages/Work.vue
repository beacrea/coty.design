<template>
  <div id="work">
    <header>
      <h1>Here's a bit of my work.</h1>
      <p>Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.</p>
      <p>A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.</p>
    </header>
    <section>
      <div class="item" v-for="item in workItems" :key="item.id">
        <div class="preview" :style="{ backgroundImage: 'url(' + item.assets.thumbnail + ')'}"></div>
        <div class="content">
          <h1>{{item.project.title}}</h1>
          <div class="text">{{item.project.shortDesc}}</div>
          <div class="cta">
            <span>COMING SOON</span>
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
  color: $color_light;
  h1 {
    color: $color_light;
  }
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
    background: grey center bottom;
    background-size: cover;
    max-height: 400px;
  }
  .content {
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      transform: scale(1.02);
    }
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1.6rem;
    grid-column-start: 2;
    grid-column-end: 14;
    grid-row-start: 6;
    grid-row-end: 10;
    background: $denim;
    * {
      user-select: none;
    }
    h1 {
      font-size: $h3_size;
    }
    .text {
      opacity: 0.75;
      line-height: 1.2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      max-height: 15.5rem;
    }
    .cta {
      margin-top: 1.6rem;
      text-align: right;
      font-weight: bold;
      color: $strawberry;
    }
  }
}

/* Tablets+ */
@media screen and (min-width: 35rem) {
  #work {
    section {
      padding: 6.4rem $padding_side*2 0;
    }
    .item {
      height: 500px;
      margin: 3.2rem auto;
    }
    .content {
      max-height: 17rem;
      // Limited to 240 characters
      .text {
        -webkit-line-clamp: 3 !important;
      }
    }
  }
}
</style>
