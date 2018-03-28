<template>
  <div id="work">
    <header>
      <h1>Here's a bit of my work.</h1>
      <p>Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.</p>
      <p>A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.</p>
    </header>
    <section>
      <WorkItem name="Pickles"></WorkItem>
      <!-- TODO: Turn this into a component -->
      <div class="item" v-for="item in workItems" :key="item.id">
        <div class="preview" :style="{ backgroundImage: 'url(' + '../../static/img/' + item.assets.assetDir + '/' + item.assets.thumbnail.name + ')'}">
          <div class="tags" :class="item.assets.thumbnail.color">
            <span v-for="tag in item.tags.slice(0,3)" :key="tag.name">{{tag.name}}</span>
          </div>
        </div>
        <div class="content" :class="item.assets.thumbnail.color">
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
#work .item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  margin: 6.4rem auto 0;
  .tags {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 1.6rem 1.2rem;
    &.light {
      span {
        background: $cerulean;
        color: rgba(white, 0.8);
      }
    },
    &.dark {
      span {
        background: rgba($denim, 0.9);
        color: rgba(white, 0.6);
      }
    },
    &.pink {
      span {
        background: $strawberry;
        color: rgba(white, 0.8);
      }
    },
    &.purple {
      span {
        background: $outrun;
        color: rgba(white, 0.8);
      }
    }
    span {
      padding: 0.4rem 1.2rem;
      margin: 0 0.4rem;
      border-radius: 4rem;
      font-size: 1rem;
      line-height: 1;
      box-shadow: 0 0 4px rgba(black, 0.8);
      font-weight: bold;
    }
  }
  .preview, .content {
    border-radius: 0.25rem;
    box-shadow: 0.25rem 0.25rem 1rem rgba(black, 0.5);
  }
  .preview {
    position: relative;
    grid-column-start: 1;
    grid-column-end: 14;
    grid-row-start: 1;
    grid-row-end: 8;
    background: grey center;
    background-size: cover;
    max-height: 450px;
  }
  .content {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1.6rem;
    grid-column-start: 2;
    grid-column-end: 15;
    grid-row-start: 6;
    grid-row-end: 10;
    &.light {
      background: $cerulean;
      color: white;
      .cta {
        color: white;
      }
    },
    &.dark {
      background: $denim;
      color: white;
      .cta {
        color: $cerulean;
      }
    }
    &.pink {
      background: $strawberry;
      color: white;
      .cta {
        color: white;
      }
    },
    &.purple {
      background: $outrun;
      color: white;
      .cta {
        color: white;
      }
    }
    background: $denim;
    * {
      user-select: none;
    }
    h1 {
      font-size: $h3_size;
    }
    .text {
      opacity: 0.75;
      line-height: 1.3;
      overflow: hidden;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 8;
      max-height: 20rem;
    }
    .cta {
      margin-top: 1.6rem;
      text-align: right;
      font-weight: bold;
      color: $cerulean;
    }
  }
}

/* Tiny Phones */
@media screen and (max-width: 40rem) {
  #work {
    section {
      padding: 0 1.6rem !important;
    }
    .item {
      margin-top: 6.4rem !important;
      height: auto !important;
    }
    .preview {
      grid-row-end: 7 !important;
      max-height: 350px;
    }
    .content {
      max-height: 12rem !important;
      h1 {
        margin-bottom: 0;
        color: white;
      }
    }
    .cta {
      opacity: 0.75;
    }
    .text {
      display: none !important;
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
      margin: 3.2rem auto 8.4rem;
    }
    .content {
      cursor: pointer;
      transition: all 0.5s;
      max-height: 20rem;
      &:hover {
        transform: scale(1.02);
      }
      // Limited to 240 characters
      .text {
        -webkit-line-clamp: 4 !important;
      }
    }
  }
}
/* Tablets- */
@media screen and (max-width: 90rem) {
  #work {
    .content:hover {
      transform: none;
    }
  }
}
</style>
