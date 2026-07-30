import { defineStore } from 'pinia'
import { getLocal, setLocal } from '../utils'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    /** 每行個數 */
    size: 5,
    /** 獲勝連線數 */
    winLine: 1
  }),
  actions: {
    /** 還原localStorage狀態 */
    init() {
      const size = getLocal('size')
      const winLine = getLocal('winLine')
      if (size !== null && size) {
        this.size = Number(size)
      }

      if (winLine !== null && winLine) {
        this.winLine = Number(winLine)
      }
    },
    setSize(value: number) {
      this.size = value
      setLocal('size', value)
    },
    setWinLine(value: number) {
      this.winLine = value
      setLocal('winLine', value)
    }
  }
})