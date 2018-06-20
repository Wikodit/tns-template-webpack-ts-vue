import Vue from 'vue'
import * as trace from 'tns-core-modules/trace'

// Run with `tns debug ios --bundle --env.verbose` when you want to enable it
if (global.TNS_VERBOSE) {
  Vue.config.silent = false
  trace.setCategories(trace.categories.All)
  trace.enable()
}
