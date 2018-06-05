<template>
  <div ref="slideContainer" class="slide-container" :style="{ 'margin-top': headerHeight + 'px', 'margin-bottom': footerHeight + 'px', 'height': elemHeight + 'px'}">
    <transition
    :enter-active-class="enterActiveClass"
    :leave-active-class="leaveActiveClass"
    >
    <router-view/>
  </transition>
  <LoadingErrorBadge v-if="loadingError" @hide-error-badge="hideErrorBadge" />
</div>
</template>

<script>
/*
 * The AppContent component contains the main content in the router view.
 * It uses a slide transition to switch between the two poems list components in the router view.
 * The component watches the changes in the routes. On a change it applies an enter-active-class to the new routed component and an leave-active-class to the previous routed component.
 * The user can switch routes by the router links in the Header component. On mobile devices he can also swipe left or right. The Hammer.js module is used for this. (It doesn't work as smooth as native swipe, unfortunately.)
 * In initiation the component configs the browser storage, by the localforage module. It also askes the backendservice to load poems from the backend. And it requests a sockets connection so the backend will constantly push new poems in.
 * The loadingError value is set globally via the app's store in order to handle it uniformly in all components (also the PoemListDelivered component and the backend service can set the loadingError value).
*/
import Hammer from 'hammerjs'
import localforage from 'localforage'

import { backendService } from '../services/backend-service'
import LoadingErrorBadge from './LoadingErrorBadge'

export default {
  components: {
    LoadingErrorBadge
  },

  data () {
    return {
      enterActiveClass: '',
      leaveActiveClass: ''
    }
  },

  computed: {
    headerHeight () {
      return this.$store.state.headerHeight
    },
    footerHeight () {
      return this.$store.state.footerHeight
    },
    elemHeight () {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const viewPortHeight = iOS ? screen.height : window.innerHeight
      return viewPortHeight - this.$store.state.headerHeight - this.$store.state.footerHeight
    },
    loadingError () {
      return this.$store.state.loadingError
    }
  },

  beforeCreate () {
    localforage.config({
      name: 'dagelijks-vers',
      storeName: 'poems'
    })
  },

  created () {
    this.$store.commit('setInitLoading', true)
    backendService.getPoems()
      .then(() => {
        this.$store.commit('setInitLoading', false)
        return true
      })
      .catch(err => {
        this.$store.commit('setInitLoading', false)
        this.$store.commit('setLoadingError', true)
        console.log(err)
      })
      .then(() => backendService.connectSocket())
  },

  mounted () {
    this.setSwipeListener()
  },

  watch: {
    '$route' (to, from) {
      if (from.path === '/') {
        this.enterActiveClass = 'animated fadeIn'
        this.leaveActiveClass = 'animated fadeOut'
      } else if (to.path === '/aanvoer') {
        this.enterActiveClass = 'animated slideInLeft'
        this.leaveActiveClass = 'animated slideOutRight'
      } else if (to.path === '/voorraad') {
        this.enterActiveClass = 'animated slideInRight'
        this.leaveActiveClass = 'animated slideOutLeft'
      }
    }
  },

  methods: {
    hideErrorBadge () {
      this.$store.commit('setLoadingError', false)
    },
    setSwipeListener () {
      const routes = ['/aanvoer', '/voorraad']
      let currentRouteIndex = routes.indexOf(this.$router.currentRoute.path)
      const mostLeftRouteIndex = 0
      const mostRightRouteIndex = routes.length - 1
      const slideContainer = this.$refs.slideContainer
      const hammerOptions = {
        dragLockToAxis: true,
        dragBlockHorizontal: true
      }
      const hammer = new Hammer(slideContainer, hammerOptions)
      hammer.on('dragleft swipeleft', (ev) => {
        if (currentRouteIndex < mostRightRouteIndex) {
          this.$router.push(routes[currentRouteIndex + 1])
          currentRouteIndex++
        }
      })
      hammer.on('dragright swiperight', (ev) => {
        if (currentRouteIndex > mostLeftRouteIndex) {
          this.$router.push(routes[currentRouteIndex - 1])
          currentRouteIndex--
        }
      })
    }
  }
}
</script>

<style scoped>
.slide-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
/* Can't use next line because iPhone gives to big size. Therefore we set the height in the script */
/*   height: 100vh; */
  overflow-x: hidden;
}

@media (min-width: 64em) {
  .slide-container {
    max-width: none;
    margin-left: 16px;
    margin-right: 16px;
  }
}
</style>