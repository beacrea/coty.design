<template>
  <div id="about">
    <section id="intro">
      <header>
        <h1>Coty Beasley</h1>
        <h2>I'm a product designer based in San Francisco.</h2>
        <h3>I specialize in digital product strategy and interaction.</h3>
      </header>
      <img src="/static/img/arrow-down.png" class="downArrow" alt="">
    </section>
    <section id="qa1">
      <header>
        <h1>Coty Beasley</h1>
        <h2>I'm a product designer based in San Francisco.</h2>
        <h3>I specialize in digital product strategy and interaction.</h3>
      </header>
      <img src="/static/img/arrow-down.png" class="downArrow" alt="">
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      msg: 'This is the about page.'
    }
  }
}
</script>

<style scoped lang="scss">
// Imports
@import "../../globalStyles/global";

#about {
  padding: $padding_side;
  background: url('/static/img/about-bg.png') no-repeat top left;
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
}
section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  align-items: center;
  header {
    text-align: left;
    align-self: flex-start;
    flex-direction: column;
    flex: 100%;
    display: flex;
    justify-content: center;
  }
  &#intro {
    .downArrow {
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
