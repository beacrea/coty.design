<template>
  <div id="contact">
   <section>
     <h2>Where I'm Found</h2>
     <div class="grid">
        <div class="icon">
          <a :href="icon.dribbble.link" target="_blank">
            <img :src="setIcon(icon.dribbble.asset)" />
          </a>
          <span>{{icon.dribbble.title}}</span>
        </div>
        <div class="icon">
          <a :href="icon.github.link" target="_blank">
            <img :src="setIcon(icon.github.asset)" />
          </a>
          <span>{{icon.github.title}}</span>
        </div>
        <div class="icon">
          <a :href="icon.linkedin.link" target="_blank">
            <img :src="setIcon(icon.linkedin.asset)" />
          </a>
          <span>{{icon.linkedin.title}}</span>
        </div>
     </div>
   </section>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      msg: 'This is the contact page.',
      iconPath: '../../../static/icons/contact/',
      icon: {
        dribbble: {
          title: 'Dribbble',
          link: 'http://dribbble.com/beacrea',
          asset: 'dribbble.svg'
        },
        twitter: {
          title: 'Twitter',
          link: 'http://twitter.com/beacrea',
          asset: 'twitter.svg'
        },
        github: {
          title: 'Github',
          link: 'http://github.com/beacrea',
          asset: 'github.svg'
        },
        codepen: {
          title: 'Codepen',
          link: 'http://codepen.io/beacrea/',
          asset: 'codepen.svg'
        },
        linkedin: {
          title: 'Linkedin',
          link: 'http://linkedin.com/in/cbeasley0',
          asset: 'linkedin-in.svg'
        }
      }
    }
  },
  methods: {
    setIcon: function (i) {
      return this.iconPath + i
    }
  }
}
</script>

<style lang="scss" scoped>
// Imports
@import "../../globalStyles/imports";
@import "../../globalStyles/vars";

#contact {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  justify-content: center;
  align-items: center;
  padding: $padding_side;
  text-align: center;
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
}
.grid {
  margin-top: 2.4rem;
  max-width: 250px;
  display: grid;
  text-align: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1.6rem;
}
.icon {
  img {
    max-height: 4.0rem;
    color: white;
  }
  a {
    border-bottom: none;
  }
  & > span {
    font-size: 1.4rem;
    line-height: 1.5;
  }
}
</style>
