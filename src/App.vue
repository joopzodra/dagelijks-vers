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
}
/* Following styles are copied from w3 styles */
.border {
  border: 1px solid #ccc;
}
.border-top{
  border-top:1px solid #ccc
}
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.white {
  color:#000 !important;
  background-color:#fff !important;
}
.green {
  color:#fff !important;
  background-color:#4CAF50 !important;
}
.button {
    border: none;
    display: inline-block;
    outline: 0;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    background-color: inherit;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
}
.button:hover{
  color:#000;
  background-color:#ccc;
}
.small {
  font-size:12px;
}
.container:after, .container:before {
    content: "";
    display: table;
    clear: both;
}
.container {
    padding: 0 16px;
}
</style>
