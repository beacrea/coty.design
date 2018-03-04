<template>
  <main-layout>
    <div id="stats">
      <section class="stats">
        <header>
          <h1>Current Stats</h1>
          <span class="dice" ontouchstart="" alt="Roll the dice!"></span>
        </header>
        <div class="gaugeGroup">
          <div class="stat" v-for="stat in stats" :key="stat.name">
            <div class="label">
              {{stat.name}}
            </div>
            <div class="guage">
              <div class="fill">
                {{statValue(stat.value)}}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h1>Equipment List</h1>
        <div class="equipGroup">
          <div class="item" v-for="item in items" :key="item.name">
            <div class="itemBox">
              A
            </div>
            <div class="content">
              <header>{{item.name}}<span>({{item.type}})</span></header>
              <div class="text">
                {{item.desc}}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'
  import model from '../../data/stats'

  export default {
    components: {
      MainLayout
    },
    data() {
      return {
        msg: 'This is the stats page.',
        stats: model.stats,
        items: model.items
      }
    },
    methods: {
      statValue: function (value) {
        return value + '%'
      }
    }
  }
</script>

<style lang="scss">
  // Imports
  @import "../globalStyles/global";

  #stats {
    padding: $padding_side;
    background: url('/static/img/stats-bg.jpg') no-repeat top left;
    background-size: cover;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 100%;
  }
</style>