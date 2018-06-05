<template>
  <div class="poem-item box w3-padding-16">
    <div class="date">{{poem.time}}</div>
    <p class="first-line">{{lines[0]}}</p>
    <p class="second-line" :class="{full: poem.id === selectedPoemId}">{{lines[1]}}</p>
    <div class="fade-content" :style="{maxHeight: maxHeight}">
      <p>{{lines[2]}}</p>
      <p>{{lines[3]}}</p>
    </div>
    <div class="poet">
      <div class="badge" :class="{large: poem.id === selectedPoemId}"><img :src="backendUrl + 'uploads/gedichtenDb/' + poem.poetImg"></div>
      <div class="name">{{poem.poet}}</div>
    </div>
    <div class="button-container" v-if="poem.id === selectedPoemId">
      <button class="w3-button w3-green w3-small" @click="buttonAction">{{buttonText}}</button>
    </div>
  </div>
</template>

<script>
import localforage from 'localforage'
import { backendService } from '../services/backend-service'
export default {
  props: {
    poem: Object,
    storageAction: String,
    selectedPoemId: {
      type: Number,
      default: -1
    }
  },

  data () {
    return {
      maxHeight: null,
      buttonText: '',
      backendUrl: backendService.backendUrl
    }
  },

  computed: {
    lines () {
      return this.poem.fragment.split('\n')
    }
  },

  watch: {
    'selectedPoemId': {
      handler: 'onSelectedPoemIdChanged',
      immediate: false,
      deep: false
    }
  },

  mounted () {
    switch (this.storageAction) {
      case 'store':
        this.buttonText = 'bewaren'
        break
      case 'delete':
        this.buttonText = 'verwijderen'
        break
    }
  },

  methods: {
    onSelectedPoemIdChanged (idSelected, idPreviousSelected) {
      if (this.poem && (this.poem.id === idSelected || this.poem.id === idPreviousSelected)) {
        const fadeContentDiv = this.$el.querySelector('.fade-content')
        const divHeight = fadeContentDiv.scrollHeight + 'px'
        this.maxHeight = idSelected === this.poem.id ? divHeight : '0px'
      }
    },
    buttonAction () {
      switch (this.storageAction) {
        case 'store':
          this.storePoem()
          break
        case 'delete':
          this.deletePoem()
          break
      }
    },
    storePoem () {
      localforage.setItem(this.poem.id.toString(), this.poem)
        .catch(err => console.log(err))
    },
    deletePoem () {
      localforage.removeItem(this.poem.id.toString())
        .then(() => this.$emit('poemDeleted'))
        .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
.poem-item {
  white-space: pre-line;
  cursor: pointer;
}
.poem-item p {
  margin: 11px 0 0;
  line-height: 1.2em;
}
.date {
  font-size: 0.7em;
  font-style: italic;
  text-align: right;
}
.first-line {
  margin-top: 0;
}
.second-line {
/*   background: linear-gradient(to bottom, #555, #fff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  opacity: 0.3;
}
.second-line::after {
  content:  " . . .";
}
.second-line.full {
/*   background: transparent;
  -webkit-text-fill-color: #2c3e50; */
  opacity: 1;
}
.second-line.full::after {
  content: "";
}
.fade-content {
  max-height: 0;
  overflow: hidden;
  transform: translate3d(0,0,0);
  transition: max-height .2s ease;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}
.poet {
  display: flex;
  align-items:  center;
  margin-top: 12px;
}
.badge {
  width:  30px;
  height: 30px;
  transform: translate3d(0,0,0);
  transition: all .2s linear;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}
img {
  max-width: 100%;
  border-radius: 50%;
}
.badge.large {
  width:  50px;
  height: 50px;
}
.name {
  margin-left: 12px;
  font-size: 0.85em;
}
.button-container {
  text-align: right;
}
</style>
