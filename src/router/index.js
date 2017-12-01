import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Exchange from '@/components/Exchange'
import Load from '@/components/Load'
import Config from '@/components/Config'
import VueResource from 'vue-resource'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/Exchange',
      name: 'Exchange',
      component: Exchange
    },
    {
      path: '/Load',
      name: 'Load',
      component: Load
    },
    {
      path: '/Config',
      name: 'Config',
      component: Config
    }
  ]
})
