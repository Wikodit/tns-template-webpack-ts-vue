import { ActionBar as ActionBarCommon } from './action-bar.common'
import { device } from 'platform'
import { android as appAndroid } from 'application'

import View = android.view.View
import WindowManager = android.view.WindowManager

export class ActionBar extends ActionBarCommon {
  // public update() {
  //   super.update()
  //   const { page, nativeViewProtected } = this

  //   // ; (<any>global).$nb = nativeViewProtected

  //   if (page) {
  //     // if (device.sdkVersion >= '21') {
  //     //   const window = appAndroid.startActivity.getWindow()
  //       // window.clearFlags((<any>WindowManager.LayoutParams).FLAG_TRANSLUCENT_STATUS)
  //       // window.addFlags((<any>WindowManager.LayoutParams).FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
  //       // // window.setStatusBarColor(0x000000)

  //       // const decorView = window.getDecorView()
  //       // decorView.setSystemUiVisibility(
  //       //   View.SYSTEM_UI_FLAG_LAYOUT_STABLE
  //       //   // | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
  //       //   // | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
  //       //   | (<any>View).SYSTEM_UI_FLAG_IMMERSIVE_STICKY,
  //       // )
  //     // }
  //   }
  // }
}
