import Vue from 'vue'
import VueRouter from 'vue-router'

import * as http from 'http'
Vue.prototype.$http = http

import router from './router'

const mainComponent = new Vue({
  router,
  template: `<router-page />`,
})

; (<any>mainComponent).$start()
