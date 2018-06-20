import {
  LoadingIndicator,
  OptionsCommon,
  OptionsAndroid,
  OptionsIOS,
} from 'nativescript-loading-indicator'

export * from 'nativescript-loading-indicator'

/**
 * Used to store the loader instance if any
 * @type {LoadingIndicator}
 */
let loader: LoadingIndicator = null

/**
 * Show a native activity indicator
 * There can be only one at the same time
 * 
 * @export
 * @param {OptionsCommon} [settings={}] All customization options
 */
export function show(settings: OptionsCommon = {}) {
  if (loader) loader.hide()
  loader = new LoadingIndicator()

  const android: OptionsAndroid = Object.assign({
    // indeterminate: true,
    // cancelable: true,
    // cancelListener: function (dialog) { console.log("Loading cancelled") },
    // max: 100,
    // progressNumberFormat: "%1d/%2d",
    // progressPercentFormat: 0.53,
    // progressStyle: 1,
    // secondaryProgress: 1
  }, settings.android ||  {})

  const ios: OptionsIOS = Object.assign({
    // details: "Additional detail note!",
    // margin: 10,
    // dimBackground: true,
    // color: "#4B9ED6", // color of indicator and labels
    // // background box around indicator
    // // hideBezel will override this if true
    // backgroundColor: "yellow",
    // userInteractionEnabled: false, // default true. false so that the touches fall through it.
    // hideBezel: true, // default false, can hide the surrounding bezel
    // view: UIView, // Target view to show on top of (Defaults to entire window)
    // mode: // see iOS specific options below
  }, settings.ios || {})

  settings.ios = ios
  settings.android = android
  settings.message = settings.message || 'Chargement'

  loader.show(settings)
}

/**
 * Hide the loading indicator
 * 
 * @export
 */
export function hide() {
  if (!loader) return
  loader.hide()
  loader = null
}
