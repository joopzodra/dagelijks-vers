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
export default {
  mounted () {
    this.$emit('headermounted', this.$el.offsetHeight)
  }
}
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 1000;
}
header {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding-bottom: 16px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: green;
  margin: 0;
  font-weight: normal;
}

nav {
  display: flex;
  justify-content: space-around;
  border-color: green;
  a {
    display: block;
    flex: 1 1 50%;
    text-align: center;
    padding: 8px 0;
    color: green;
    text-decoration: none;
    background-color: rgba(0, 128, 0, 0.1);
  }
  a:nth-child(1) {
    border-radius: 0 0 10px 0;
  }
  a:nth-child(2) {
    border-radius: 0 0 0 10px;
  }
  .router-link-active {
    background-color: rgb(255, 255, 255);
  }
}

@media (min-width: 64em) {
  header {
    max-width: none;
  }
  nav {
    justify-content: center;
  }
}
</style>
