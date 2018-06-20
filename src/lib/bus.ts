import Vue from 'nativescript-vue'
import {
  ios as appIos,
  on as applicationOn,
  launchEvent,
  suspendEvent,
  resumeEvent,
  exitEvent,
  LaunchEventData,
  ApplicationEventData,
} from 'tns-core-modules/application/application'
import { topmost } from 'tns-core-modules/ui/frame/frame'
import { isAndroid } from 'tns-core-modules/platform/platform'
import { startMonitoring, connectionType, getConnectionType } from 'tns-core-modules/connectivity/connectivity'

export enum BusEventList {
  KEYBOARD_TOGGLED = 'KEYBOARD_TOGGLED',
  APPLICATION_LAUNCH = 'KEYBOARD_TOGGLED',
  APPLICATION_RESUME = 'APPLICATION_RESUME',
  APPLICATION_EXIT = 'APPLICATION_EXIT',
  APPLICATION_SUSPEND = 'APPLICATION_SUSPEND',
}

export interface KeyboardToggleDetail {
  height?: number
  duration?: number
  curve?: number
}

export declare interface Bus {
  $on(event: BusEventList.KEYBOARD_TOGGLED, callback: (shown: boolean, height?: number) => void): this

  $on(event: BusEventList.APPLICATION_LAUNCH, callback: (args: LaunchEventData) => void): this
  $on(event: BusEventList.APPLICATION_RESUME, callback: (args: ApplicationEventData) => void): this
  $on(event: BusEventList.APPLICATION_EXIT, callback: (args: ApplicationEventData) => void): this
  $on(event: BusEventList.APPLICATION_SUSPEND, callback: (args: ApplicationEventData) => void): this

  $on(event: BusEventList | BusEventList[], callback: Function): this
  $once(event: BusEventList, callback: Function): this
  $emit(event: BusEventList, ...args: any[]): this
  $off(event: BusEventList, ...args: any[]): this
}

export class Bus extends Vue {
  constructor () {
    super()

    this._injectLifecycleHooks()
    this.trackKeyboard()

    // Enable connection tracking
    // this.onConnectionTypeChanged = this.onConnectionTypeChanged.bind(this)
    // this.onConnectionTypeChanged(getConnectionType())
    // startMonitoring(this.onConnectionTypeChanged)
  }

  /**
   * Role is to bind callback to main application events
   * @private
   * @memberof Bus
   */
  private _injectLifecycleHooks() {
    this.onLaunch = this.onLaunch.bind(this)
    this.onExit = this.onExit.bind(this)
    this.onSuspend = this.onSuspend.bind(this)
    this.onResume = this.onResume.bind(this)

    applicationOn(launchEvent, this.onLaunch)
    applicationOn(exitEvent, this.onExit)
    applicationOn(resumeEvent, this.onResume)
    applicationOn(suspendEvent, this.onSuspend)
  }

  /**
   * Called when app is launching
   * @protected
   * @param {LaunchEventData} args 
   * @memberof Bus
   */
  protected onLaunch(args: LaunchEventData) {
    this.$emit(BusEventList.APPLICATION_LAUNCH, args)
    this.$store.dispatch('startAutoSync', undefined, { root: true })
  }

  /**
   * Called when app is exiting
   * @protected
   * @param {ApplicationEventData} args 
   * @memberof Bus
   */
  protected onExit(args: ApplicationEventData) {
    this.$emit(BusEventList.APPLICATION_EXIT, args)
  }

  /**
   * Called when app is suspending
   * @protected
   * @param {ApplicationEventData} args 
   * @memberof Bus
   */
  protected onSuspend(args: ApplicationEventData) {
    this.$emit(BusEventList.APPLICATION_SUSPEND, args)
    this.$store.dispatch('stopAutoSync', undefined, { root: true })
  }

  /**
   * Called when app is resuming
   * @protected
   * @param {ApplicationEventData} args 
   * @memberof Bus
   */
  protected onResume(args: ApplicationEventData) {
    this.$emit(BusEventList.APPLICATION_RESUME, args)
    this.$store.dispatch('startAutoSync', undefined, { root: true })

    // this.onConnectionTypeChanged(getConnectionType())
  }

  /**
   * Called when connectivity change
   * @protected
   * @param {ApplicationEventData} args 
   * @memberof Bus
   */
  // protected onConnectionTypeChanged(newConnectionType: number) {
  //   switch (newConnectionType) {
  //     case connectionType.none:
  //       break;
  //     case connectionType.wifi:
  //       break;
  //     case connectionType.mobile:
  //       break;
  //   }
  // }

  /**
   * Start the tracking of the keyboad, should only be called once
   * @protected
   * @returns 
   * @memberof Bus
   */
  protected trackKeyboard() {
    if (isAndroid) {
      const tm = topmost()
      if (!tm) { setTimeout(() => { this.trackKeyboard() }, 200); return }
      if (!tm.currentPage) { setTimeout(() => { this.trackKeyboard() }, 200); return }

      const cv = tm.currentPage.android

      cv.getViewTreeObserver().addOnGlobalLayoutListener(
        new android.view.ViewTreeObserver.OnGlobalLayoutListener({
          onGlobalLayout: () => {
            // Grab the Current Screen Height
            const rect = new android.graphics.Rect()
            cv.getWindowVisibleDisplayFrame(rect)
            const screenHeight = cv.getRootView().getHeight()
            const missingSize = screenHeight - rect.bottom

            if (missingSize > (screenHeight * 0.15)) {
              this.notifyKeyboard(true, { height: missingSize })
            } else {
              this.notifyKeyboard(false, { height: 0 })
            }
          },
        }),
      )
    } else {
      appIos.addNotificationObserver(UIKeyboardWillShowNotification, (
        notification: NSNotification,
      ) => {
        const info = notification.userInfo
        const height = info.valueForKey(UIKeyboardFrameEndUserInfoKey).CGRectValue.size.height
        const duration = info.valueForKey(UIKeyboardAnimationDurationUserInfoKey).doubleValue
        const curve = info.valueForKey(UIKeyboardAnimationCurveUserInfoKey).integerValue

        this.notifyKeyboard(true, { duration, height, curve })
      })
      appIos.addNotificationObserver(UIKeyboardDidHideNotification, (
        notification: NSNotification,
      ) => {
        const info = notification.userInfo
        const duration = info.valueForKey(UIKeyboardAnimationDurationUserInfoKey).doubleValue
        this.notifyKeyboard(false, { duration, height: 0 })
      })
    }
  }

  /**
   * Get called when keyboard state change
   * @param {any} val 
   * @param {KeyboardToggleDetail} detail
   * @memberof Bus
   */
  protected notifyKeyboard(val, detail: KeyboardToggleDetail) {
    const cp = topmost().currentPage
    if (!cp || !cp.cssClasses) return
    const res = cp.cssClasses[val ? 'add' : 'delete']('layout__keyboard--shown')
    if (res) cp._onCssStateChange()
    this.$emit(BusEventList.KEYBOARD_TOGGLED, val, detail)
  }
}

export default new Bus()
