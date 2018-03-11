import Vue from 'vue'
import Router from 'vue-router'
import About from '../components/pages/About'
import Stats from '../components/pages/Stats'
import Contact from '../components/pages/Contact'
import Work from '../components/pages/Work'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'intro'
      }
    },
    {
      path: '/intro',
      name: 'intro',
      component: About
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/work',
      name: 'work',
      component: Work
    }
  ]
})
