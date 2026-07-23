import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    size: 5,
    winLine: 1
  }),
  actions: {
    setSize(value: number) {
      this.size = value
    },
    setWinLine(value: number) {
      this.winLine = value
    },
  }
})