import Vue from 'vue'
import Router from 'vue-router'
const PoemListDelivered = () => import(/* webpackChunkName: "slider-and-content" */ '../components/PoemListDelivered')
const PoemListStored = () => import(/* webpackChunkName: "slider-and-content" */ '../components/PoemListStored')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/apps/dagelijks-vers/',
  routes: [
    {
      path: '/aanvoer',
      component: PoemListDelivered
    },
    {
      path: '/voorraad',
      component: PoemListStored
    },
    {
      path: '*',
      redirect: '/aanvoer'
    }
  ]
})
