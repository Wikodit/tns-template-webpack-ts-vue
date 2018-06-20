import Vue, { registerElement } from 'nativescript-vue'
import {
  RadListView,
  ListViewGridLayout,
  ListViewLinearLayout,
  ListViewStaggeredLayout,
} from 'nativescript-ui-listview'
import { Color } from 'tns-core-modules/color/color';
import { isIOS } from 'tns-core-modules/ui/page/page';

registerElement('NativeRadListView', () => RadListView)
registerElement('ListViewGridLayout', () => ListViewGridLayout)
registerElement('ListViewLinearLayout', () => ListViewLinearLayout)
registerElement('ListViewStaggeredLayout', () => ListViewStaggeredLayout)

Vue.directive('tkListViewLayout', {
  inserted(el) {
    (<any>el.parentNode)._nativeView.listViewLayout = (<any>el)._nativeView
  },
})

const VUE_VIEW = '__vueVNodeRef__'

Vue.component('RadListView', {
  name: 'rad-list-view',
  props: {
    items: {
      type: [Array, Object],
      required: true,
    },
    '+alias': {
      type: String,
      default: 'item',
    },
    '+index': {
      type: String,
    },
  },
  computed: {
    nativeView() {
      return this.$refs.listView.nativeView
    },
  },
  template: `
    <native-rad-list-view
      ref="listView" 
      :items="items"
      v-bind="$attrs"
      v-on="listeners" 
      @itemTap="onItemTap"
      @itemLoading="onItemLoading"
    >
      <slot />
    </native-rad-list-view>
  `,

  watch: {
    items: {
      handler(newVal) {
        this.$refs.listView.setAttribute('items', newVal)
        this.$refs.listView.nativeView.refresh()
      },
      deep: true,
    },
  },

  created() {
    // we need to remove the itemTap handler from a clone of the $listeners
    // object because we are emitting the event ourselves with added data.
    const listeners = Object.assign({}, this.$listeners)
    delete listeners.itemTap
    this.listeners = listeners
  },

  mounted() {
    this.getItemContext = (item, index) =>
      getItemContext(item, index, this.$props['+alias'], this.$props['+index'])

    this.$refs.listView.setAttribute('items', this.items)
    this.$refs.listView.setAttribute(
      '_itemTemplatesInternal',
      this.$templates.getKeyedTemplates(),
    )
    this.$refs.listView.setAttribute('_itemTemplateSelector', (item, index) => {
      return this.$templates.selectorFn(this.getItemContext(item, index))
    })

    const availableTemplates = this.$templates.getAvailable()
    this.$refs.listView.setAttribute('itemViewLoader', (itemType) => {
      switch (itemType) {
        case 'itemview':
          return this.$templates.getKeyedTemplate('default').createView()
        case 'headerview':
          if (~availableTemplates.indexOf('header')) {
            return this.$templates.getKeyedTemplate('header').createView()
          }
        case 'footerview':
          if (~availableTemplates.indexOf('footer')) {
            return this.$templates.getKeyedTemplate('footer').createView()
          }
      }
    })
  },

  methods: {
    onItemTap(args) {
      this.$emit(
        'itemTap',
        Object.assign({ item: this.items[args.index] }, args),
      )
    },
    onItemLoading(args) {
      const index = args.index
      const items = args.object.items

      const currentItem =
        typeof items.getItem === 'function'
          ? items.getItem(index)
          : items[index]

      const name = args.object._itemTemplateSelector(currentItem, index, items)
      const context = this.getItemContext(currentItem, index)
      const oldVnode = args.view && args.view[VUE_VIEW]

      args.view = this.$templates.patchTemplate(name, context, oldVnode)
      if (isIOS && args.ios.backgroundView) {
        args.ios.backgroundView.backgroundColor = new Color("#000000").ios;
      }
    },
  },
})

function getItemContext(item, index, alias, indexAlias) {
  return {
    [alias]: item,
    [indexAlias || '$index']: index,
    $even: index % 2 === 0,
    $odd: index % 2 !== 0,
  }
}
