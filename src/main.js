// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// enable Promises in IE
import { polyfill } from 'es6-promise'
polyfill()

Vue.config.productionTip = false

/* eslint-disable no-new */
export const vueInstance = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
