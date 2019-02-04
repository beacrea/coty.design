<template>
  <div id="workitem">
    <div class="preview" :style="{ backgroundImage: 'url(' + '../../static/img/' + projectData.assets.assetDir + '/' + projectData.assets.thumbnail.name + ')'}">
      <div class="tags" :class="projectData.assets.thumbnail.color">
        <span v-for="tag in projectData.tags.slice(0,3)" :key="tag.name">{{tag.name}}</span>
      </div>
    </div>
    <div class="content" :class="projectData.assets.thumbnail.color">
      <h1>{{projectData.project.title}}</h1>
      <div class="text">{{projectData.project.shortDesc}}</div>
      <div class="cta">
        <!--<span>COMING SOON</span>-->
      </div>
    </div>
  </div>
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
    }
    &.dark {
      span {
        background: rgba($denim, 0.9);
        color: rgba(white, 0.6);
      }
    }
    &.pink {
      span {
        background: $strawberry;
        color: rgba(white, 0.8);
      }
    }
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
    h1 {
      color: white;
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
  #workitem {
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

/* Tablets+ */
@media screen and (min-width: 35rem) {
  #workitem {
    height: 500px;
    margin: 3.2rem auto 8.4rem;
  }
  .content {
    /* TODO: Reenable cursor hover */
    /*cursor: pointer;*/
    transition: all 0.5s;
    max-height: 20rem;
    &:hover {
      /* TODO: Reenable cursor hover */
      /*transform: scale(1.02);*/
    }
    // Limited to 240 characters
    .text {
      -webkit-line-clamp: 4 !important;
    }
  }
}
/* Tablets- */
@media screen and (max-width: 90rem) {
  .content:hover {
    transform: none;
  }
}
</style>
