import trackNebulas from '@/assets/js/point'

export const state = () => {
  return {
    biServerCached: [],
    commonAsyncDataInit: '',
    commonAsyncDataEnd: '',
    asyncDataEnd: ''
  }
}

export const mutations = {
  updateTime(state, [key, value]) {
    state[key] = value
  },
  recoverBiServerCached(state) {
    state.biServerCached = []
  }
}

export const actions = {
  setBiRecords({ state }, { type, opts }) {
    // 为打点内容添加必传字段 lgt 必传
    if (process.server) {
      state.biServerCached.push({ type, opts })
      return
    }
    const vm = window.$nuxt
    if (!vm) return
    const copyOpts = JSON.parse(JSON.stringify(opts))
    const typeString = Object.prototype.toString.call(copyOpts).slice(8, -1)
    if (typeString == 'Array') {
      copyOpts.forEach((item) => {
        item.lgt = item.lgt ? item.lgt : new Date().getTime()
      })
    } else {
      copyOpts.lgt = copyOpts.lgt ? copyOpts.lgt : new Date().getTime()
    }
    if (process.client) {
      if (Array.isArray(copyOpts) && copyOpts.length > 30) {
        let i = 0
        while (i * 30 < copyOpts.length) {
          trackNebulas(vm, type, copyOpts.slice(i * 30, (i + 1) * 30))
          i++
        }
      } else {
        trackNebulas(vm, type, copyOpts)
      }
    }
  },
  analysis({ state }) {
    console.table(state)
  }
}
