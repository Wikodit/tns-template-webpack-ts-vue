import Vue from 'vue'
import VuexORM from '@vuex-orm/core'
import Vuex, { StoreOptions } from 'vuex'
export * from 'vuex'

// import vuexLocalPlugin from 'lib/vuex-local'

import modules from 'store/modules'

import { get } from 'lib/api'
import database from 'store/database';

Vue.use(Vuex)

export interface RootState {

}

const storeConfig: StoreOptions<RootState> = {
  modules,
  actions: {
    async startAutoSync({ dispatch }) {
      dispatch('_runAutoSync')
    },

    async _runAutoSync({ dispatch }) {
      if (this.autoSyncTimer) {
        clearTimeout(this.autoSyncTimer)
      }

      // A parameter is given to autoSync, to determine every how many 10s seconds
      // the sync should occur
      // ex: to do an autosync every 130 seconds (or 13 x 10s), do :
      // `async autoSync ({}, counter) {
      //    if (counter % 13) return
      //    instructions...
      // }`
      this.timerModulo = this.timerModulo < 59 ? (this.timerModulo + 1) : 0
      dispatch('autoSync', this.timerModulo, { root: true })

      this.autoSyncTimer = setTimeout(
        async () => {
          dispatch('_runAutoSync')
        },
        10000,
      )
    },

    async stopAutoSync() {
      if (this.autoSyncTimer) {
        clearTimeout(this.autoSyncTimer)
      }
    },
  },
  mutations: {},
  plugins: [
    // vuexLocalPlugin,
    VuexORM.install(database)
  ],
}

export default new Vuex.Store(storeConfig)
