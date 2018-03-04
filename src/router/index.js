import Vue from 'vue'
import Router from 'vue-router'
import About from '../components/pages/About'
import Stats from '../components/pages/Stats'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'About',
      component: About
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats
    }
  ]
})
