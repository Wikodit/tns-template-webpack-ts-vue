import { Frame, isAndroid } from 'tns-core-modules/ui/frame'
import { AnimationCurve } from 'tns-core-modules/ui/enums/enums'

if (isAndroid) {
  Frame.defaultTransition = {
    name: 'slide',
    duration: 300,
    curve: AnimationCurve.easeInOut,
  }
}