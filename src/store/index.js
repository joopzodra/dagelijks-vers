import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    poems: [],
    initLoading: false,
    poemsLoadingCompleted: false,
    headerHeight: 0,
    footerHeight: 0,
    poemsLoadingOffset: 0,
    loadingError: false,
    poemsDeliveredScrollTop: 0,
    poemsStoredScrollTop: 0
  },
  mutations: {
    loadPoems (state, poems) {
      state.poems = [...state.poems, ...poems]
      if (state.poems.length > 300) {
        state.poems = state.poems.slice(0, 300)
      }
    },
    setInitLoading (state, initLoading) {
      state.initLoading = initLoading
    },
    setPoemsLoadingCompleted (state, poemsLoadingCompleted) {
      state.poemsLoadingCompleted = poemsLoadingCompleted
    },
    addPoem (state, poem) {
      state.poems.unshift(poem)
      if (state.poems.length > 300) {
        state.poems.pop()
      }
    },
    setHeaderHeight (state, headerHeight) {
      state.headerHeight = headerHeight
    },
    setFooterHeight (state, footerHeight) {
      state.footerHeight = footerHeight
    },
    addToPoemsLoadingOffset (state, loadedPoemsLength) {
      state.poemsLoadingOffset += loadedPoemsLength
    },
    setLoadingError (state, loadingError) {
      state.loadingError = loadingError
    },
    setPoemsDeliveredScrollTop (state, scrollTop) {
      state.poemsDeliveredScrollTop = scrollTop
    },
    setPoemsStoredScrollTop (state, scrollTop) {
      state.poemsStoredScrollTop = scrollTop
    }
  }
})
