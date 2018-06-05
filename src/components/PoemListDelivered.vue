<template>
  <div class="poems-list w3-container slide" :style="{ 'height': elemHeight + 'px'}" >
    <div >
      <Spinner v-if="initLoading" />
      <transition-group :css="false" tag="div" id="transition-container" @enter="enterPoem" @after-enter="afterEnterPoem" class="row" ref="transitionContainer">
        <div v-for="poem of poems" :key="poem.id" class="poem-container w3-border-bottom col-xs-12 col-sm-12 col-md-6 col-lg-4" :class="{selected: poem === selectedPoem}" @click="toggleSelect(poem)" ref="poemContainer">
            <PoemItem :poem="poem" :selectedPoemId="selectedPoem ? selectedPoem.id : -1" storageAction="store" ref="jpoem"></PoemItem>
        </div>
      </transition-group>
      <Spinner v-if="poemsLoading && !poemsCompleted" />
    </div>
  </div>
</template>

<script>
/* The PoemsDelivered component shows the poems loaded from the backend and pushed by the backend via a socket connection.
 * During the initial loading, the spinner on top is shown.
 * When the user scrolls to the bottom of the list, more poems are loaded. This is controlled by checkIfNeedsLoading method. During loading, the bottom spinner is shown.
  * The component sets its height by the computed elemHeight property. The height is necessary to get the elements overflow-y, so we can get and set scroll values. They are used for triggering the scroll event and for storage of the scroll position before leaving/destroying the component.
 * The store's value poemsCompleted is true when there are no more poems to be loaded from the server. (The server has no more than 300 poems, constantly new poems are added and older poems removed.)
 * Poems pushed by the backend slide in from the top when the first poems of the list is in view. If the first poem is scrolled out of view, a new poem is added without slide. The first time this happens, the the list is scrolled up in order to keep the poems in view in their position. Oddly, after the first entrance, the browser itself takes care of the scrolling up!?
 * On wider screens (desktop) the poems are not listed but placed in rows. Then a different animation is used.
*/
import _ from 'lodash'

import { backendService } from '../services/backend-service'
import PoemItem from './PoemItem'
import Spinner from './Spinner'

export default {
  components: {
    PoemItem,
    Spinner
  },

  data () {
    return {
      selectedPoem: null,
      poemsLoading: false,
      poemsCompleted: false,
      poemContainerHeight: 0,
      programScroll: false,
      previousScrollPos: 0,
      previousEnterWasShiftIn: true
    }
  },

  computed: {
    poems () {
      return this.$store.state.poems
    },
    throttledCheckIfNeedsLoading () {
      return _.throttle(this.checkIfNeedsLoading, 250)
    },
    initLoading () {
      return this.$store.state.initLoading
    },
    elemHeight () {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const viewPortHeight = iOS ? screen.height : window.innerHeight
      return viewPortHeight - this.$store.state.headerHeight - this.$store.state.footerHeight
    }
  },

  mounted () {
    this.$el.scrollTop = this.$store.state.poemsDeliveredScrollTop
    this.poemsCompleted = false
    this.$el.addEventListener('scroll', (event) => {
      // for the topside of the list: reset an eventual transition
      this.$el.style.transition = ''
      // for the bottomside of the list: check if more poems should be loaded
      return this.throttledCheckIfNeedsLoading(event)
    })
  },

  beforeDestroy () {
    this.$store.commit('setPoemsDeliveredScrollTop', this.$el.scrollTop)
  },

  methods: {
    toggleSelect (poem) {
      this.selectedPoem === poem ? this.selectedPoem = null : this.selectedPoem = poem
    },
    elementClientHeight () {
      return this.$el.clientHeight
    },
    checkIfNeedsLoading (event) {
      // Check for scrolling up; don't start loading when scrolling up, only when scrolling down
      // Also, don't load when the scroll is not caused by the user but it's a programmatic scroll due to an entering poem
      const scrollingUp = event.target.scrollTop < this.previousScrollPos
      this.previousScrollPos = event.target.scrollTop
      if (this.programScroll || scrollingUp || this.poemsLoading || this.poemsCompleted) {
        return
      }
      let pixelsFromSlideBottomToListBottom = 0 + this.$el.scrollHeight - this.elementClientHeight() - this.$el.scrollTop
      if (pixelsFromSlideBottomToListBottom < 200) {
        this.poemsLoading = true
        backendService.getPoems()
          .then(() => {
            this.$nextTick(() => {
              this.poemsLoading = false
            })
            this.poemsCompleted = this.$store.state.poemsLoadingCompleted
          })
          .catch(err => {
            this.$store.commit('setLoadingError', true)
            this.poemsLoading = false
            console.log(err)
          })
      }
    },
    enterPoem (el, done) {
      // Prevent script error if app runs for the first time and can't connect to server for loading poems, so poemContainer is empty.
      if (!this.$refs.poemContainer || !this.$refs.poemContainer[0]) {
        return
      }
      const elRect = el.getBoundingClientRect()
      const elBottom = elRect.top + elRect.height
      const headerBottom = this.$store.state.headerHeight
      const elVisible = elBottom > headerBottom
      // breakpoint for widescreen is at 64em (flexbox.css uses em's). In App.js fontsize is set to 16px, so 64em = 16x64 = 1024
      const smallScreen = window.innerWidth < 1024
      // Oddly, a new poem a the top of the list is the last item of this.$refs.poemContainer
      this.poemContainerHeight = this.$refs.poemContainer[0].scrollHeight
      if (elVisible && smallScreen) {
        this.shiftInTopPoem()
      } else if (smallScreen) {
        this.scrollingUpOnEntry()
      } else {
        this.widescreenEntry(el)
      }
      done()
    },
    afterEnterPoem (el) {
      this.$el.style.transition = ''
      setTimeout(() => {
        this.$el.className = 'poems-list w3-container slide'
        this.$el.style.height = this.elemHeight + 'px'
      }, 2000)
    },
    shiftInTopPoem () {
      // Don't intermingle loading multiple poems at the end of the list with a transition
      if (this.poemsLoading) {
        return
      }
      this.previousEnterWasShiftIn = true
      this.$el.style.transform = `translateY(-${this.poemContainerHeight}px)`
      // Height is set to component's main element; must be adjusted otherwise the element's bottom ends a bit above the footer during the translate transition, causing a white space between element and the footer during the transition
      this.$el.style.height = (this.elemHeight + this.poemContainerHeight) + 'px'
      this.$nextTick(() => {
        this.$el.style.transition = 'transform 2.5s'
        this.$el.style.transform = 'translateY(0px)'
      })
    },
    scrollingUpOnEntry () {
      // Scrolling up is only needed for the first entry after shifting in entries. Otherwise the element's scrolltop is adjusted automatically. (How this happens, that's not clear, but it happens)
      if (!this.previousEnterWasShiftIn) {
        return
      }
      this.previousEnterWasShiftIn = false
      // Don't load poems when programmatically scrolling, which is controlled by this.programmScroll
      this.programScroll = true
      this.$el.scrollTop += this.poemContainerHeight + 1
      setTimeout(() => {
        this.programScroll = false
      }, 250)
    },
    widescreenEntry (el) {
      // Don't intermingle loading multiple poems at the end of the list with a transition
      if (this.poemsLoading) {
        return
      }
      this.$el.className = 'poems-list w3-container slide blink'
      el.style.transform = `translateY(-${this.poemContainerHeight}px)`
      this.$nextTick(() => {
        el.style.transition = 'transform 2.5s'
        el.style.transform = 'translateY(0px)'
      })
    }
  }
}
</script>

<style scoped>
.slide {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
#transition-container {
  width: 100%;
}
.poem-container {
  overflow: hidden;
}
@keyframes blink {
  0%, 100% {
    background-color: rgb(255,255,255);
  }
  50% {
    background-color: rgb(245,245,245);
  }
}
@media (min-width: 64em) {
  .blink {
    animation: blink 0.8s ease-out;
  }
}
</style>
