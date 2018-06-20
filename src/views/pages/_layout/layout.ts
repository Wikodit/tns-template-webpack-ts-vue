import Vue from 'nativescript-vue'
import { Component } from 'lib/decorator'
import { Frame } from 'tns-core-modules/ui/frame/frame'

import HelloWorldPage from 'views/pages/home/home'

import './layout.scss'

@Component({
  template: require('./layout.pug'),
})
export default class LayoutComponent extends Vue {
  startingPage: typeof Vue = null
  startingProps: any = {}

  created() {
    this.startingPage = HelloWorldPage
  }

  start() {
    (<any>this).$start({
      getRootView(self) {
        return self.$el.nativeView
      },
    })
  }

  loaded({ object }: { object: Frame }) {
    console.log(`
      Frame is loaded, frame is the part of the view that will handle pages.
      RadSideDrawer or TabView can be used around it.
    `)
  }
}
