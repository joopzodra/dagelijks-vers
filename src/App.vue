<template>
  <div id="app">
    <Header v-on:headermounted="onHeaderMounted" />
    <AppContent />
    <Footer v-on:footermounted="onFooterMounted" />
  </div>
</template>

<script>
/* The App component is the app's root component.
 * For fast initial rendering there are a header and footer in the index.html. Next, this root component loads the header and footer component. A separate webpack file contains the (relative large) AppContent.
 * The component listens for mount-events of the header and footer, on which header and footer heights are stored; there're used by the PoemsListDelivered component.
 * The App component also loads the css files for app wide use, and contains some app wide css. Other app wide styles are inline in the index.html.
 */
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
const AppContent = () => import(/* webpackChunkName: "content" */ './components/AppContent.vue')

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
