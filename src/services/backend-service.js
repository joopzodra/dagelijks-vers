import axios from 'axios'
import io from 'socket.io-client'

import store from '../store/index'

class BackendService {
  backendUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : 'https://frontendjr.nl/'
  numberOfPoemsToLoad = 20

  getPoems () {
    const offset = store.state.poemsLoadingOffset
    return axios.get(this.backendUrl + 'gedichtenDb/fragments', {
      params: {
        offset: offset,
        limit: this.numberOfPoemsToLoad
      }
    })
      .then(response => {
        const convertedPoems = response.data.poems.map(poem => this.convertSql(poem))
        store.commit('loadPoems', convertedPoems)
        store.commit('setPoemsLoadingCompleted', response.data.completed)
        store.commit('addToPoemsLoadingOffset', convertedPoems.length)
        return true
      })
  }

  convertSql (poem) {
    return {
      id: poem.id,
      fragment: poem.fragment,
      poet: poem.poet,
      sourceUrlLabel: poem.source_url_label,
      sourceUrl: poem.source_url,
      poetImg: poem.poet_img,
      createdAt: poem.createdAt, // this property is used for sorting on time
      time: poem.time
    }
  }

  connectSocket () {
    this.socket = io.connect(this.backendUrl)
    this.socket.on('poemAdded', poem => {
      const convertedPoem = this.convertSql(poem)
      store.commit('addPoem', convertedPoem)
      store.commit('addToPoemsLoadingOffset', 1)
    })
  }
}

export const backendService = new BackendService()