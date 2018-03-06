<template>
  <div id="about">
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto consequuntur debitis deleniti deserunt doloribus eligendi eos impedit iusto magnam nemo neque nobis nostrum perspiciatis quas ratione rem sed, unde vitae.</p>
      </header>
    </section>
    <section id="qa2">
      <header>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto consequuntur debitis deleniti deserunt doloribus eligendi eos impedit iusto magnam nemo neque nobis nostrum perspiciatis quas ratione rem sed, unde vitae.</p>
      </header>
    </section>
    <section id="qa3">
      <header>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto consequuntur debitis deleniti deserunt doloribus eligendi eos impedit iusto magnam nemo neque nobis nostrum perspiciatis quas ratione rem sed, unde vitae.</p>
      </header>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: 'This is the about page.',
      scrollThreshhold: this.calculateThreshold()
    }
  },
  mounted: function () {
    let element = document.getElementById('#about')
    console.log(element.offsetTop)
  },
  methods: {
    calculateThreshold: function () {
      let element = document.getElementById('downArrow')
      this.scrollThreshhold = element.scrollHeight
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
  align-items: center;
  justify-content: center;
  position: relative;
  header {
    text-align: left;
    margin: 0;
    height: 100%;
    h1 {
      margin: 0;
      color: white;
    }
    p {
      font-size: 1.8rem;
      margin-bottom: 0;
    }
  }
<<<<<<< Updated upstream
  &#intro {
    min-height: calc(100% - 64px);
    .downArrow {
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
=======
  #downArrow {
    top: calc(100% - 32px);
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
>>>>>>> Stashed changes
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

header {
  margin-bottom: 25%;
  padding-right: 3.2rem;
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
