import Vue from 'vue'
import VuexORM from '@vuex-orm/core'
import Vuex, { StoreOptions } from 'vuex'
export * from 'vuex'

import modules from 'store/modules'
import database from 'store/database';

import VuexPersistence from 'vuex-persist'
import { getString, setString } from 'tns-core-modules/application-settings/application-settings'

Vue.use(Vuex)

/**
 * Vuex persist configuration compatible with nativescript
 */
const vuexLocal = new VuexPersistence({
  saveState(key, state) {
    setString(key, JSON.stringify(state))
  },

  restoreState(key) {
    return JSON.parse(getString(key) || '{}')
  },
})

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
    vuexLocal.plugin,
    VuexORM.install(database)
  ],
}

export default new Vuex.Store(storeConfig)
