/* eslint-disable */
import { Store } from 'vuex'
import { State } from './store'
import { CreateForm } from './views/CreateForm.vue'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
    forefatherComponent: CreateForm
    options: {
      showActions: boolean
      showFooter: boolean
    }
  }
}

// Vuex@4.0.0-beta.1 is missing the typing for `useStore`. See https://github.com/vuejs/vuex/issues/1736
declare module 'vuex' {
  export function useStore(key?: string): Store<State>
}
