<template>
  <div class="loading-error-badge">
    <transition name="slide">
      <div class="badge-inner" v-if="show">
        <div class="badge-text">Geen verse aanvoer door server-probleem.</div>
        <div>
          <button class="button white border" @click="hide">OK</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/*
 * The LoadingErrorBadge appears at the bottom of the app. It's a child component of the AppContent component.
 * Emitting the hide-badge-error event happens after the same time the leave transition takes.
 */
export default {
  data () {
    return {
      show: false
    }
  },

  mounted () {
    this.show = true
  },

  methods: {
    hide () {
      this.show = false
      setTimeout(() => {
        this.$emit('hide-error-badge')
      }, 800)
    }
  }
}
</script>

<style scoped lang="scss">
.loading-error-badge {
  position: fixed;
  bottom: 50px;
}
.slide-enter-active {
  transition: transform 0.8s ease-out;
}
.slide-leave-active {
  transition: transform 0.8s ease-in;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(-100%,0,0);
}
.badge-inner {
  background-color: rgb(255,240,240);
  color: red;
  padding: 16px;
  border-radius: 10px;
  border: solid 1px red;
  display: flex;
  align-items: center;
  max-width: 80%;
  max-width: calc(100% - 32px);
  margin-left: 16px;
}
button {
  margin-left: 16px;
  border-radius: 4px
}
</style>
