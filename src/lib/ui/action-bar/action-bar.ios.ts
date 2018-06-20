import { ActionBar as ActionBarCommon } from './action-bar.common'

export class ActionBar extends ActionBarCommon {
  // private get navBar(): UINavigationBar {
  //   const page = this.page
  //   // Page should be attached to frame to update the action bar.
  //   if (!page || !page.frame) {
  //     return undefined
  //   }
  //   return (<UINavigationController>page.frame.ios.controller).navigationBar
  // }

  // private get navigationController(): UINavigationController {
  //   if (this.page && this.page.frame) {
  //     return this.page.frame.ios.controller
  //   }
  // }

  // public update() {
  //   super.update()
  //   const { navBar, page } = this
  //   if (navBar) {
  //     navBar.barStyle = UIBarStyle.BlackTranslucent
  //     navBar.setBackgroundImageForBarMetrics(UIImage.new(), UIBarMetrics.Default)
  //     navBar.shadowImage = UIImage.new()
  //     navBar.translucent = true
  //     this.navigationController.setNavigationBarHiddenAnimated(false, false)
  //     this.navigationController.navigationItem.setHidesBackButtonAnimated(true, false)
  //   }

  //   if (page) {
  //     page.backgroundSpanUnderStatusBar = true
  //   }
  // }
}
