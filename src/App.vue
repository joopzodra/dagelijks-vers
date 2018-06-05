<template>
  <div id="app">
    <Header v-on:headermounted="onHeaderMounted" />
    <AppContent />
    <Footer v-on:footermounted="onFooterMounted" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
const AppContent = () => import(/* webpackChunkName: "AppContent" */ './components/AppContent.vue')

export default {
  components: {
    Header,
    Footer,
    AppContent
  },

  methods: {
    onHeaderMounted: function (headerHeight) {
      this.$store.commit('setHeaderHeight', headerHeight)
    },
    onFooterMounted: function (footerHeight) {
      this.$store.commit('setFooterHeight', footerHeight)
    }
  }
}
</script>

// Css for all app components
<style src="./styles/animate.css"></style>
<style src="./styles/flexboxgrid.css"></style>
<style src="./styles/w3.css"></style>
<style>
/*
Some styles for html, body and #app are in internal stylesheet in index.html
*/
/*
Breakpoints in flexboxgrid.css:
sm min-width: 48em
md min-width: 64em
lg min-width: 75em
*/

@media (min-width: 64em) {
  .slide-container {
    max-width: none;
  }
  .poem-container {
   border-bottom: 0px !important;
  }
  .poem-item {
    background-color: rgb(255,255,239);
    padding: 24px;
    margin: 16px;
  }
  .poem-item .date {
    text-align: left !important;
  }
}
</style>
