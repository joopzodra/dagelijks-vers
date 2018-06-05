<template>
  <div class="stored-poems-list w3-container slide" v-if="poems && poems.length" :style="{ 'height': elemHeight + 'px'}">
    <div class="row">
      <div v-for="poem of poems" :key="poem.id" class="poem-container w3-border-bottom w3-padding-16 col-xs-12 col-sm-12 col-md-6 col-lg-4" :class="{selected: poem === selectedPoem}" @click="toggleSelect(poem)">
        <PoemItem :poem="poem" :selectedPoemId="selectedPoem ? selectedPoem.id : -1" storageAction="delete" v-on:poemDeleted="refreshPoems"></PoemItem>
      </div>
    </div>
  </div>
  <div class="stored-poems-list w3-container slide" v-else>
    <p>Je hebt nog geen versregels bewaard.</p>
  </div>
</template>

<script>
import localforage from 'localforage'
import PoemItem from './PoemItem'

export default {
  components: {
    PoemItem
  },

  data () {
    return {
      poems: [],
      selectedPoem: null
    }
  },

  computed: {
    elemHeight () {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const viewPortHeight = iOS ? screen.height : window.innerHeight
      return viewPortHeight - this.$store.state.headerHeight - this.$store.state.footerHeight
    }
  },

  created () {
    this.refreshPoems()
  },

  mounted () {
    setTimeout(() => { this.$el.scrollTop = this.$store.state.poemsStoredScrollTop }, 200)
  },

  beforeDestroy () {
    this.$store.commit('setPoemsStoredScrollTop', this.$el.scrollTop)
  },

  methods: {
    refreshPoems () {
      const poemsCache = []
      const sort = (a, b) => a.createdAt < b.createdAt ? 1 : -1
      localforage.iterate(function (value) {
        poemsCache.push(value)
      })
        .then(() => poemsCache.sort(sort))
        .then(() => {
          this.poems = poemsCache
        })
        .catch(err => console.log(err))
    },
    toggleSelect (poem) {
      this.selectedPoem === poem ? this.selectedPoem = null : this.selectedPoem = poem
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
</style>
