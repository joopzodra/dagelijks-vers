<template>
  <div class="poem-item box padding-8">
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
/*
 * The PoemItem component is child component of the PoemsListDelivered and the PoemsListStored components. It displays a poem object it receives from it's parent component.
 * Every time the user clicks on a poem in the list, the onSelectedPoemIdChanged method is called.
 * It shows a part of the poem, until the user clicks on it.  If the user click on the poem, the onSelectedPoemIdChanged handler makes the whole poem visible, and a button for storage handling.
 * Clicking the button for storage handling in a poem in the PoemsListDelivered component stores the poem, and it will appear in the PoemsListStored components. While clicking the button for storage handling in a poem in the PoemsListStored component deletes the poem from te storage. This is controlled by the storageAction property.
 * To see which properties a poem object has, look in the backend-service.js for the convertSql method.
 */
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
.padding-8 {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
.poem-item {
  white-space: pre-line;
  cursor: pointer;
}
.poem-item p {
  margin: 6px 0 0;
  line-height: 1em;
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
  opacity: 0.3;
}
.second-line::after {
  content:  " . . .";
}
.second-line.full {
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
