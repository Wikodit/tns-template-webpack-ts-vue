import VuexPersistence from 'vuex-persist'
import { getString, setString } from 'tns-core-modules/application-settings/application-settings'

/**
 * Vuex persist configuration compatible with nativescript
 */
export default new VuexPersistence({
  saveState(key, state) {
    setString(key, JSON.stringify(state))
  },

  restoreState(key) {
    return JSON.parse(getString(key) || '{}')
  },
}).plugin