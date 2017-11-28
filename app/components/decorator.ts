import Component, { createDecorator } from 'vue-class-component'
import Vue, { ComponentOptions } from 'vue'
import { VueDecorator } from 'vue-class-component/lib/util'
export * from 'vue-property-decorator'

export default function component(options: any) {
  // Handle template loading
  if (typeof options.template === 'function') {
    options.template(options)
    delete options.template
  }

  // Handle Style loading for the page only
  if (typeof options.style === 'string') {
    // @todo only way for now to load styles is to use the beforeMount
    // not the best way, because here beforeMount can only be override in decorator not in
    // the class body
    const hookHandler = options.mounted
    const style = options.style

    options.mounted = function () {
      if (typeof this.$el.nativeView === 'object') {
        this.$el.nativeView.css = style
      }

      if (typeof hookHandler === 'function') {
        hookHandler.call(this)
      }

      if (typeof this.afterMount === 'function') {
        this.afterMount.call(this)
      }
    }
    delete options.style
  }

  // Original decorator
  return Component(options)
}

export {
  component as Component,
}
