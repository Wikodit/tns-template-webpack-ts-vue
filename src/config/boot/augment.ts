import Vue from 'vue'
import { screen, isAndroid, isIOS } from 'tns-core-modules/platform/platform'
import { android as appAndroid, ios as appIOS } from 'application'

/**
 * Quick access
 */
import components from 'views/components'
import pages from 'views/pages'
import models from 'models'

Vue.components = Vue.prototype.$components = components
Vue.pages = Vue.prototype.$pages = pages
Vue.models = Vue.prototype.$models = models

/**
 * Basic
 */
import * as http from 'http'
Vue.prototype.$http = http

import store from 'store'
Vue.store = Vue.prototype.$store = store

/**
 * Bus
 */
import bus from 'lib/bus'
Vue.bus = Vue.prototype.$bus = bus

/**
 * Moment
 */
import * as moment from 'moment'
import 'moment/locale/fr'

moment.locale('fr')
Vue.moment = Vue.prototype.$moment = moment

/**
 * Icons
 */
import iconFont from 'assets/fonts/icon'

Vue.icons = Vue.prototype.$icons = {}
for (const icon in iconFont) {
  Vue.prototype.$icons[icon] = String.fromCharCode(iconFont[icon])
}

/**
 * Useful informations of device
 */
const width = screen.mainScreen.widthPixels / screen.mainScreen.scale
const $device = {
  screen: {
    width,
    height: screen.mainScreen.heightPixels / screen.mainScreen.scale,
  },
  navBar: { width, height: 0 },
  actionBar: { width, height: 44 },
  statusBar: { width, height: 20 },
  content: { width, height: null },
  keyboard: { width, height: 0 },
  isIOS,
  isAndroid,
}


if (isAndroid) {
  appAndroid.on('activityCreated', () => {
    const windowManager = <android.view.WindowManager>appAndroid.context.getSystemService(
      android.content.Context.WINDOW_SERVICE,
    )
    const display = windowManager.getDefaultDisplay()
    const size = new android.graphics.Point()
    display.getSize(size)

    $device.navBar.height = $device.screen.height - size.y / screen.mainScreen.scale
    $device.actionBar.height = 48 // @todo get dynamcaly ? but static in navbar.scss

    const resourceId = appAndroid.context.getResources().getIdentifier(
      'status_bar_height',
      'dimen',
      'android',
    )
    if (resourceId > 0) {
      $device.statusBar.height = (
        appAndroid.context.getResources().getDimensionPixelSize(resourceId) /
        screen.mainScreen.scale
      )
    }

    const extraHeight = $device.navBar.height + $device.actionBar.height + $device.statusBar.height
    $device.content.height = $device.screen.height - extraHeight
  })
} else {
  const extraHeight = $device.navBar.height + $device.actionBar.height + $device.statusBar.height
  $device.content.height = $device.screen.height - extraHeight

  const interval = setInterval(() => {
    if (!appIOS.window) return
    clearInterval(interval)
    if (!appIOS.window.safeAreaInsets) return
    $device.content.height -= appIOS.window.safeAreaInsets.bottom + (appIOS.window.safeAreaInsets.top / 2) || 0
  }, 20)
}

Vue.device = Vue.prototype.$device = $device
