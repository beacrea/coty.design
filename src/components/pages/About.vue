<template>
  <div id="about" v-on:scroll="reportPosition">
    <section id="intro">
      <header>
        <h1>I’ve seen things you people wouldn’t believe.</h1>
        <p>Overclocked Pentiums on fire in suburban basements.
          <span class="lg">I watched gif text glitter in Netscape before the great browser wars.</span>
        </p>
        <p>All of these moments will be lost, <a href="https://youtu.be/NoAzpa1x7jU?t=1m45s" target="_blank">like tears in rain</a>.</p>
      </header>
      <img src="/static/img/arrow-down.png" id="downArrow" alt="">
    </section>
    <section id="qa1">
      <header>
        <h1>My name is Coty Beasley</h1>
        <h2>I'm a product designer based in San Francisco.</h2>
        <h2>I specialize in digital product strategy and interaction.</h2>
      </header>
    </section>
    <section id="qa2">
      <header>
        <h1>I began designing over ten years ago so I could one day help build the future.</h1>
        <h2>Here are some questions you might be asking:</h2>
      </header>
    </section>
    <section id="qa3">
      <header>
        <h1>"Where do you typically fit into the product cycle?"</h1>
        <h2>I’m an end-to-end product designer.</h2>
        <h3>I'm usually brought into the process while the business team and product managers are coming up with their goals. From there, I'll often guide things from the interface designs to the end of development.</h3>
      </header>
    </section>
    <section id="qa4">
      <header>
        <h1>"Do you see yourself as a manager or an individual contributor?"</h1>
        <h2>I prefer being a senior-level individual contributor, often guiding the product vision of new initiatives or features.</h2>
        <h3>I've managed a handful of small teams in the past, acting as the product manager and/or owner. In the right situations, I'm happy to take on the responsibility.</h3>
      </header>
    </section>
    <section id="qa5">
      <header>
        <h2>Let's chat more over tea.</h2>
        <div class="linkBox">
          <router-link class="aboutCta" to="contact" v-on:click.native="changeBg">Contact me <img src="../../../static/img/rightArrow.svg" alt=""></router-link>
        </div>
      </header>
    </section>
  </div>
</template>

<script>
let offsetEl = 'downArrow'

export default {
  components: {},
  data () {
    return {
      msg: 'This is the about page.',
      initOffset: 0,
      currentOffset: 0
    }
  },
  mounted: function () {
    let el = document.getElementById(offsetEl)
    this.initOffset = this.calcOffset(el).top
    this.currentOffset = this.calcOffset(el).top
  },
  methods: {
    reportPosition: function () {
      let el = document.getElementById(offsetEl)
      let elOffset = this.calcOffset(el).top
      this.currentOffset = elOffset

      let threshold = this.initOffset - (this.currentOffset / 6)
      if (this.currentOffset >= threshold) {
        // console.log('Untriggered')
        this.$emit('introStatus', 0)
      } else if (this.currentOffset < threshold) {
        // console.log('Triggered')
        this.$emit('introStatus', 1)
      }
    },
    calcOffset: function (el) {
      let rect = el.getBoundingClientRect()
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top + scrollTop }
    },
    changeBg: function () {
      this.$emit('pageChange')
      this.$emit('introStatus', 0)
    }
  }
}
</script>

<style scoped lang="scss">
// Imports
@import "../../globalStyles/global";

#about {
  padding: $padding_side;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
}
section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100% + 64px);
  justify-content: center;
  position: relative;
  padding-left: $padding_side;
  padding-right: $padding_side;
  &:last-child {
    padding-bottom: $navHeight/2;
  }
  header {
    text-align: left;
    margin: 0;
    height: 100%;
    h1 {
      margin: 0;
      color: white;
    }
    p, a {
      font-size: 1.8rem;
    }
    p {
      margin-bottom: 0;
    }
  }
  &#intro {
    min-height: calc(100% - 64px);
  }
  #downArrow {
    top: calc(100% - 2.4rem);
    left: calc(50% - 2.9rem);
    position: absolute;
    display: inline-block;
    width: 5.8rem;
    height: 4.1rem;
    animation: bounce ease-in 1s;
    animation-iteration-count: infinite;
    transform-origin: 50% 100%;
    -webkit-animation: bounce ease-in 1s;
    -webkit-animation-iteration-count: infinite;
    -webkit-transform-origin: 50% 100%;
    -moz-animation: bounce ease-in 1s;
    -moz-animation-iteration-count: infinite;
    -moz-transform-origin: 50% 100%;
    -o-animation: bounce ease-in 1s;
    -o-animation-iteration-count: infinite;
    -o-transform-origin: 50% 100%;
    -ms-animation: bounce ease-in 1s;
    -ms-animation-iteration-count: infinite;
    -ms-transform-origin: 50% 100%;
  }
}

/* Tablets+ */
@media screen and (min-width: 76rem) {
  section header {
    p, span {
      font-size: ($p_size * 1.2);
    }
  }
  .lg {
    display: block;
  }
}

#qa5 {
  h2, .linkBox {
    text-align: center;
  }
}
.linkBox {
  display: flex;
  width: 100%;
  margin-top: 2.4rem;
  justify-content: center;
}

.aboutCta {
  font-size: 1.8rem;
  padding: 0.8rem;
  flex: 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 200px;
  text-align: center;
  border: 2px solid rgba(white, 0.5);
  border-radius: 2.4rem;
  color: white;
  &:visited, &:active {
    color: white;
  }
  img {
    margin-left: 1.6rem;
    height: 1.6rem;
  }
}

header {
  margin-bottom: 25%;
}

@keyframes bounce{
  0% {
    transform:  translate(0px,0px)  ;
  }
  50% {
    transform:  translate(0px,-16px)  ;
  }
  100% {
    transform:  translate(0px,0px)  ;
  }
}

@-moz-keyframes bounce{
  0% {
    -moz-transform:  translate(0px,0px)  ;
  }
  50% {
    -moz-transform:  translate(0px,-16px)  ;
  }
  100% {
    -moz-transform:  translate(0px,0px)  ;
  }
}

@-webkit-keyframes bounce {
  0% {
    -webkit-transform:  translate(0px,0px)  ;
  }
  50% {
    -webkit-transform:  translate(0px,-16px)  ;
  }
  100% {
    -webkit-transform:  translate(0px,0px)  ;
  }
}

@-o-keyframes bounce {
  0% {
    -o-transform:  translate(0px,0px)  ;
  }
  50% {
    -o-transform:  translate(0px,-16px)  ;
  }
  100% {
    -o-transform:  translate(0px,0px)  ;
  }
}

@-ms-keyframes bounce {
  0% {
    -ms-transform:  translate(0px,0px)  ;
  }
  50% {
    -ms-transform:  translate(0px,-16px)  ;
  }
  100% {
    -ms-transform:  translate(0px,0px)  ;
  }
}
</style>
