<template>
  <div id="stats">
    <section class="statsGroup">
      <header>
        <h1>Current Stats</h1>
        <span class="dice" :style="{ backgroundImage: `url('${diceImage}')` }" v-on:click="setRandom" alt="Roll the dice!"></span>
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
    <section>
      <h1>Equipment List</h1>
      <div class="equipGroup">
        <div class="item" v-for="item in items" :key="item.name">
          <div class="itemBox">A</div>
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
      stats: model.stats,
      items: model.items
    }
  },
  methods: {
    // Random Number Generator
    getRandom: function () {
      return Math.floor(Math.random() * 80) + 20
    },
    setRandom: function () {
      this.stats.forEach((stat, index) => {
        stat.value = this.getRandom()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// Imports

@import "../../globalStyles/imports";
@import "../../globalStyles/vars";

#stats {
  background: url('/static/img/stats-bg.jpg') no-repeat top left;
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  section {
    padding: $padding_side;
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
.statsGroup {
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
  transition-duration: 1s;
  cursor: pointer;
  background-repeat: no-repeat;
  &:active {
    transform: rotate(720deg);
    -webkit-transform: rotate(720deg);
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

.equipGroup {
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
