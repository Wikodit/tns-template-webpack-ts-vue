import Vue from 'vue'
import { Bus } from 'lib/bus'
import * as moment from 'moment'
import { VueConstructor } from 'vue/types/vue'
import { Page, NavigationEntry, Size } from 'tns-core-modules/ui/frame/frame'

import components from 'views/components'
import pages from 'views/pages'
import * as http from 'http'
import { Model } from '@vuex-orm/core';
import store from 'store'

export interface VueDevice {
  screen: Size
  content: Size
  actionBar: Size
  navBar: Size
  statusBar: Size
  keyboard: Size
}

export interface VueIcons {
  [iconName: string]: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $http: typeof http,
    $bus: Bus
    $moment: typeof moment
    $icons: VueIcons,
    $device: VueDevice
    $components: typeof components
    $pages: typeof pages
    $models: { [key: string]: typeof Model }
  }

  interface VueConstructor<V extends Vue = Vue> {
    bus: Bus
    components: typeof components
    pages: typeof pages
    device: VueDevice
    moment: typeof moment
    icons: VueIcons,
    models: { [key: string]: typeof Model}
    store: typeof store
  }
}

