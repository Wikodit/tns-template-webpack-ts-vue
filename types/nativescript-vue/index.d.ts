declare module 'nativescript-vue' {
  import Vue from 'vue'
  import { View } from 'tns-core-modules/ui/core/view/view'

  export default class NativeScriptVue<V = View> extends Vue {
    nativeView: V;
  }

  export function registerElement(elementName: String, resolver: Function, options?: any)
}
