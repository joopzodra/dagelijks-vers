<template>
  <div class="header-container">
    <header>
      <h1>dagelijks vers</h1>
      <nav class="w3-border-top">
        <router-link to="/aanvoer">aanvoer</router-link>
        <router-link to="/voorraad">voorraad</router-link>
      </nav>
    </header>
  </div>
</template>

<script>
/*
 * The header component contains the app navigation, using the Vue router.
 * It emits its height to the App component after it's mounted.
 */
export default {
  mounted () {
    this.$emit('headermounted', this.$el.offsetHeight)
  }
}
</script>

<style>
/* Styles for the Header component are in index.html (minified) and in styles-uncompressed.css (pretty) */
</style>
