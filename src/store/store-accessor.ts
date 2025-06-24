import type { AppStore } from './index'

let storeRef: AppStore | null = null

export const setStore = (store: AppStore): void => {
  storeRef = store
}

export const getStore = (): AppStore => {
  if (!storeRef) {
    throw new Error('Store not initialized in store-accessor!')
  }
  return storeRef
}
