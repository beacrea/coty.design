<template>
  <div id="contact">
   <section>
     <h2>Where I'm Found</h2>
     <div class="grid">
        <div class="icon">
          <a :href="icon.dribbble.link" target="_blank" rel="me">
            <i class="fab fa-dribbble"></i>
            <span>{{icon.dribbble.title}}</span>
          </a>
        </div>
        <div class="icon">
          <a :href="icon.github.link" target="_blank" rel="me">
            <i class="fab fa-github"></i>
            <span>{{icon.github.title}}</span>
          </a>
        </div>
        <div class="icon">
          <a :href="icon.linkedin.link" target="_blank" rel="me">
            <i class="fab fa-linkedin"></i>
            <span>{{icon.linkedin.title}}</span>
          </a>
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
          link: 'https://dribbble.com/beacrea',
          asset: 'dribbble.svg'
        },
        twitter: {
          title: 'Twitter',
          link: 'https://twitter.com/beacrea',
          asset: 'twitter.svg'
        },
        github: {
          title: 'Github',
          link: 'https://github.com/beacrea',
          asset: 'github.svg'
        },
        codepen: {
          title: 'Codepen',
          link: 'https://codepen.io/beacrea/',
          asset: 'codepen.svg'
        },
        linkedin: {
          title: 'Linkedin',
          link: 'https://linkedin.com/in/cbeasley0',
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
  i {
    font-size: 4.0rem;
    color: white;
    margin-bottom: 1rem;
  }
  img {
    max-height: 4.0rem;
    color: white;
  }
  a {
    border-bottom: none;
    color: white;
    font-weight: 300;
  }
  & > span {
    font-size: 1.4rem;
    line-height: 1.5;
  }
}
</style>
