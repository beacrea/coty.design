<template>
  <div id="stats">
    <section id="statsGroup">
      <header>
        <h1>Current Stats</h1>
        <span class="dice" :style="{ backgroundImage: `url('${diceImage}')` }" v-on:click="setRandom" v-bind:class="{ active: diceSpin }" alt="Roll the dice!"></span>
      </header>
      <div class="gaugeGroup">
        <div class="stat" v-for="stat in stats" :key="stat.name">
          <div class="label">{{stat.name}}</div>
          <div class="guage">
            <div class="fill" v-bind:style="{width: stat.value + '%'}"></div>
          </div>
        </div>
      </div>
    </section>
    <section id="toolGroup">
      <h1>Tool List</h1>
      <div>
        <div class="item" v-for="item in tools" :key="item.name">
          <div class="itemBox"><img :src="getStatImg(item.icon)" alt="item.desc"></div>
          <div class="content">
            <header>{{item.name}}<span>({{item.type}})</span></header>
            <div class="text">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </section>
    <section id="gearGroup">
      <h1>Gear List</h1>
      <div>
        <div class="item" v-for="item in gear" :key="item.name">
          <div class="itemBox"><img :src="getStatImg(item.icon)" alt="item.desc"></div>
          <div class="content">
            <header>{{item.name}}<span>({{item.type}})</span></header>
            <div class="text">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import model from '../../../data/stats'

export default {
  components: {},
  data () {
    return {
      msg: 'This is the stats page.',
      diceImage: '../../static/img/dice.svg',
      itemPath: '../../static/img/statIcons/',
      itemPH: '../../static/img/cube.svg',
      diceSpin: false,
      diceTimer: {},
      stats: model.stats,
      tools: model.tools,
      gear: model.gear
    }
  },
  methods: {
    // Random Number Generator
    getRandom: function () {
      return Math.floor(Math.random() * 80) + 20
    },
    setRandom: function () {
      // Clear previous dice state
      this.diceSpin = false
      clearTimeout(this.diceTimer)

      // Randomizes stat values
      this.stats.forEach((stat, index) => {
        stat.value = this.getRandom()
      })

      // Adds class to make dice spin
      this.diceSpin = true

      // Resets dice class and timer
      this.diceTimer = this.delayDiceClear()
      this.delayDiceClear()
    },
    clearDice: function () {
      this.diceSpin = false
      this.diceTimer = 0
    },
    delayDiceClear: function () {
      let self = this
      setTimeout(function () {
        self.clearDice()
      }, 500)
    },
    getStatImg: function (imgName) {
      return this.itemPath + imgName + '.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
// Imports

@import "../../globalStyles/imports";
@import "../../globalStyles/vars";

#stats {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 100%;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
section {
  padding: $padding_side;
  &:last-child {
    margin-bottom: $navHeight/2;
  }
}

/* Tablets+ */
@media screen and (min-width: 76rem) {
  #statsGroup, #toolGroup, #gearGroup {
    padding: $padding_side $padding_side*3;
  }
  #gearGroup {
    padding-top: 0;
  }
}
h1 {
  font-family: 'Open Sans', Arial, sans-serif;
  font-size: 2.4rem;
  color: $color_light;
  letter-spacing: 0;
  line-height: 1.2;
  text-shadow: 0 0 4px rgba(240, 234, 227, 0.10);
}
#statsGroup {
  border-bottom: 1px solid rgba(255, 255, 255, 0.32);
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

}
.dice {
  opacity: 0.5;
  height: 2.4rem;
  width: 2.4rem;
  cursor: pointer;
  background-repeat: no-repeat;
  &.active {
    transition-duration: 0.5s;
    transform: translate3d(0, 0, 0) rotate(0);
    -webkit-transform: translate3d(0, 0, 0) rotate(0);
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    backface-visibility: hidden;
    perspective: 1000px;
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, -1px, 0) rotate(180deg);
    -webkit-transform: translate3d(-1px, -1px, 0) rotate(180deg);
  }

  20%, 80% {
    transform: translate3d(2px, -1px, 0) rotate(360deg);
    -webkit-transform: translate3d(2px, -1px, 0) rotate(360deg);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 2px, 0) rotate(540deg);
    -webkit-transform: translate3d(-4px, 2px, 0) rotate(540deg);
  }

  40%, 60% {
    transform: translate3d(4px, 0px, 0) rotate(720deg);
    -webkit-transform: translate3d(4px, 0px, 0) rotate(720deg);
  }
}

.label {
  font-size: 16px;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0;
  line-height: 14px;
}
.gaugeGroup {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 16px;
}

.guage {
  margin-top: 8px;
  overflow-x: hidden;
  width: 100%;
  height: 16px;
  background: #0b0e1f;
  border-radius: 8px;
  z-index: 1;
  position: relative;
  .fill {
    position: absolute;
    transition-duration: 0.25s;
    top: 0;
    left: 0;
    height: 100%;
    width: 60%;
    background-color: #f06067;
  }
}

#gearGroup, #toolGroup {
  $itemHeight: 6.4rem;
  .item {
    background: rgba(255, 255, 255, 0.1);
    height: $itemHeight;
    border-radius: 8px;
    display: flex;
    overflow: hidden;
    align-items: center;
    margin-top: 1.6rem;
    color: rgba(255, 255, 255, 0.75);
  }
  .itemBox {
    width: $itemHeight;
    min-width: $itemHeight;
    height: $itemHeight;
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.2rem;
    img {
      max-width: 90%;
      opacity: 0.8;
    }
  }
  .content {
    display: block;
    padding: 8px;
    header, span {
      font-size: 1.4rem;
    }
    header {
      font-weight: bold;
      margin-bottom: 4px;
    }
    span {
      opacity: 0.5;
      font-weight: normal;
      margin-left: 4px;
    }
    .text {
      font-size: 1.2rem;
      line-height: 1.2;
      color: rgba(white, 0.5)
    }
  }
}
</style>
