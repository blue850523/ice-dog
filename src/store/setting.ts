import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    /** 每行個數 */
    size: 5,
    /** 獲勝連線數 */
    winLine: 1
  }),
  persist: {
    key: 'setting-store'
  },
  actions: {
    setSize(value: number) {
      this.size = value
    },
    setWinLine(value: number) {
      this.winLine = value
    }
  }
})