<template>
  <div class="footer-container">
    <footer>
      <div class="frontendjr-button">
        <a href="https://frontendjr.nl">&#8592; frontendJR</a>
      </div>
    </footer>
  </div>
</template>

<script>
/*
 * The footer component contains the link to the FrontendJR website's homepage.
 * Also, it emits its height to the App component after it's mounted.
 */
export default {
  mounted () {
    this.$emit('footermounted', this.$el.offsetHeight)
  }
}
</script>

<style >
/* Styles for the Footer component are in index.html (minified) and in styles-uncompressed.css (pretty) */
</style>
