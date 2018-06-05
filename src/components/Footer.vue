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
export default {
  mounted () {
    this.$emit('footermounted', this.$el.offsetHeight)
  }
}
</script>

<style scoped lang="scss">

</style>
