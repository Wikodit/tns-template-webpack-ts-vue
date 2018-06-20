import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
import { Page, NavigationEntry, Size } from 'tns-core-modules/ui/frame/frame'

export type navigateTo = (
  component: VueConstructor,
  options?: NavigationEntry,
  cb?: () => Page,
) => Promise<Page>;

declare module 'vue/types/vue' {
  interface Vue {
    $navigateTo: navigateTo
    $navigateBack: () => void
    
    $start: () => void

    $modal?: { close: (data?) => Promise<typeof data> };

    $showModal: (component: typeof Vue, options?: { context?: any; fullscreen?: boolean }) => Promise<any>;
  }

  interface VueConstructor<V extends Vue = Vue> {
    navigateTo: navigateTo
    navigateBack: () => void
  }
}
