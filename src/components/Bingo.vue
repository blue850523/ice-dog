<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from "pinia"
import { getLocal, setLocal } from '../utils/index.ts'
import { useSettingStore } from '../store/setting.ts'
import DarkMode from './DarkMode.vue'
import Setting from './Setting.vue'
import confetti from 'canvas-confetti'

interface BingoItem {
  /** 賓果數字 */
  number: number
  /** 已被選擇 */
  selected: boolean
}
interface HistoryItem {
  /** 賓果數字 */
  number: number
  /** 賓果格位置 y */
  index: number
  /** 賓果格位置 x */
  index2: number
}
type Status = /** 設定數字中 */
  'setting' | 
  /** 設定數字完成 */
  'settingDone' | 
  /** 遊戲中 */
  'start' | 
  /** 遊戲結束 */
  'end'

const settingStore = useSettingStore()
const { size, winLine } = storeToRefs(settingStore)

/** 賓果格 */
const bingoData = ref<BingoItem[][]>([])
/** 狀態 */
const status = ref<Status>('setting')
/** 目前設定第幾個 */
const nowSettingNumber = ref<number>(1)
/** 設置歷史紀錄, 隨機產生時沒有設置歷史紀錄 */
const settingHistory = ref<[number, number][]>([])
/** 遊戲歷史紀錄 */
const gameHistory = ref<HistoryItem[]>([])

/** 產生賓果盤 */
const setBingo = (): void => {
  bingoData.value = Array.from({ length: size.value }, (_, _index) => {
    return Array.from({ length: size.value }, (_, _index2) => {
      return {
        number: 0,
        selected: false
      }
    })
  })
  status.value = 'setting'
  nowSettingNumber.value = 1
  settingHistory.value = []
  gameHistory.value = []
}
/** 隨機產生賓果盤 */
const random = (): void => {
  // 產生數字陣列
  const numbers = Array.from({ length: size.value * size.value }, (_, index) => {
    return index + 1
  })
  // 打亂數字陣列
  for (let i = numbers.length - 1; i > 0; i--) {
    // 隨機位置
    const randomIndex = Math.floor(Math.random() * (i + 1))
    // 交換
    ;[numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]]
  }
  bingoData.value = Array.from({ length: size.value }, (_, index) => {
    return Array.from({ length: size.value }, (_, index2) => {
      return {
        number: numbers[index * size.value + index2],
        selected: false
      }
    })
  })
  status.value = 'settingDone'
  nowSettingNumber.value = 1
  settingHistory.value = []
  gameHistory.value = []
}
/** 回復上一步數字 */
const backNumber = (): void => {
  if (nowSettingNumber.value === 1) return
  status.value = 'setting'
  nowSettingNumber.value -= 1
  const previousIndex = settingHistory.value.length - 1
  const index = settingHistory.value[previousIndex][0]
  const index2 = settingHistory.value[previousIndex][1]
  bingoData.value[index][index2].number = 0
  settingHistory.value.pop()
}
/** 開始遊戲 */
const start = (): void => {
  status.value = 'start'
}
/** 回復上一步選擇 */
const backHistory = (): void => {
  const previousIndex = gameHistory.value.length - 1
  const index = gameHistory.value[previousIndex].index
  const index2 = gameHistory.value[previousIndex].index2
  bingoData.value[index][index2].selected = false
  gameHistory.value.pop()
}
/** 設定賓果數字 */
const setNumber = (index: number, index2: number): void => {
  if ((bingoData.value[index][index2] as BingoItem).number) return
  (bingoData.value[index][index2] as BingoItem).number = nowSettingNumber.value
  nowSettingNumber.value += 1
  settingHistory.value.push([index, index2])
  // 設定完成
  if (nowSettingNumber.value > size.value * size.value) {
    status.value = 'settingDone'
  }
}
/** 選擇數字 */
const selectNumber = (index: number, index2: number): void => {
  if (bingoData.value[index][index2].selected) return
  bingoData.value[index][index2].selected = true
  gameHistory.value.push({
    number: bingoData.value[index][index2].number,
    index,
    index2
  })
}
/** 點擊賓果格 */
const clickBingoItem = (index: number, index2: number): void => {
  if (status.value === 'setting') {
    setNumber(index, index2)
  } else if (status.value === 'start') {
    selectNumber(index, index2)
  }
}

/** 當前已連線數 */
const bingoLines = computed((): number => {
  if (status.value !== 'start') return 0

  let count = 0

  for (let i = 0; i < size.value; i++) {
    // 檢查橫行
    if (bingoData.value[i].every(cell => cell.selected)) count++
    // 檢查直列
    if (bingoData.value.every(row => row[i].selected)) count++
  }

  // 檢查兩條對角線
  // 左上到右下
  if (bingoData.value.every((row, i) => row[i].selected)) count++
  // 右上到左下
  if (bingoData.value.every((row, i) => row[size.value - 1 - i].selected)) count++

  return count
})

watch(bingoLines, (newValue, oldValue) => {
  if (newValue > oldValue && newValue === winLine.value) {
    confetti({
      particleCount: 100,
      spread: 70,
      zIndex: 10000
    })
  }
})

/** 設定本地儲存資料 */
const setLocalData = (): void => {
  const bingo = getLocal('bingoData') as BingoItem[][]
  if (bingo) {
    bingoData.value = bingo
  } else {
    return setBingo()
  }

  status.value = getLocal('status') ?? status.value
  nowSettingNumber.value = getLocal('nowSettingNumber') ?? nowSettingNumber.value
  settingHistory.value = getLocal('settingHistory') ?? settingHistory.value
  gameHistory.value = getLocal('gameHistory') ?? gameHistory.value
}

watch(
  [bingoData, status, nowSettingNumber, settingHistory, gameHistory],
  ([newBingo, newStatus, newNowSetting, newSettingHistory, newGameHistory]) => {
    setLocal('bingoData', newBingo)
    setLocal('status', newStatus)
    setLocal('nowSettingNumber', newNowSetting)
    setLocal('settingHistory', newSettingHistory)
    setLocal('gameHistory', newGameHistory)
  },
  { deep: true, immediate: false }
)

watch(size, (_newSize) => {
  setBingo()
})

onMounted(() => {
  setLocalData()
})
</script>

<template>
  <div class="container pt-16! md:pt-12 space-y-3 bg-theme-50 dark:bg-theme-950 text-theme-950 dark:text-theme-50">
    <!-- header -->
    <header class="flex items-center justify-center fixed top-0 left-1/2 translate-x-[-50%] w-full md:w-3xl h-12 p-2 bg-theme-200 z-10">
      <div class="flex items-center justify-end flex-wrap w-full">
        <DarkMode class="mr-2" />
        <Setting />
      </div>
    </header>

    <div class="flex items-center justify-center">
      <button class="button mr-2" type="button" @click="setBingo">清空</button>
      <button class="button" type="button" @click="random">隨機</button>
    </div>

    <!-- bingo board -->
    <div class="relative flex items-center justify-center flex-col mx-auto w-fit border border-theme-800 bg-[#ffffff]">
      <div 
        v-for="(item, index) in bingoData" 
        :key="`bingoRow-${index}`" 
        class="flex">
        <div 
          v-for="(item2, index2) in item" 
          :key="`bingoItem-${index}-${index2}`" 
          class="flex items-center justify-center w-16 md:w-20 h-16 md:h-20 text-2xl border border-theme-800 text-theme-800 cursor-pointer hover:bg-theme-200 transition-all duration-200"
          :class="item2.selected && 'bg-theme-300'" 
          @click="clickBingoItem(index, index2)">
          {{ item2.number || '' }}
        </div>
      </div>
    </div>

    <div v-if="status === 'setting' || status === 'settingDone'" class="flex items-center justify-center flex-wrap space-y-3">
      <div v-if="status === 'setting'" class="w-full text-xl text-center font-bold text-theme-color">下個數字：{{ nowSettingNumber }}</div>
      <div v-if="status === 'settingDone'" class="w-full text-xl text-center font-bold text-theme-color">設定完成！</div>
    </div>

    <div 
      v-if="(status === 'setting' || status === 'settingDone') || (status === 'start' && gameHistory.length >= 1)" 
      class="flex items-center justify-center space-x-2"
    >
      <button v-if="(status === 'setting' || status === 'settingDone') && nowSettingNumber > 1" class="button button-md" type="button" @click="backNumber">上一步</button>
      <button v-if="status === 'settingDone'" class="button button-md" type="button" @click="start">開始</button>
      <button v-if="status === 'start' && gameHistory.length >= 1" class="button button-md" type="button" @click="backHistory">上一步</button>
    </div>

    <!-- history -->
    <div v-if="status === 'start'" class="flex items-center justify-center flex-col">
      <span class="mb-2 text-xl font-bold text-theme-color">
        已連線數 {{ bingoLines }} / {{ winLine }}
      </span>
      <span class="mb-2 text-xl font-bold text-theme-color">歷史紀錄</span>
      <div class="flex items-center justify-center flex-wrap w-full">
        <div 
          v-for="item in gameHistory" 
          :key="`history-${item.number}`"
          class="flex items-center justify-center m-1 w-7.5 h-7.5 text-lg md:text-base text-theme-50 bg-theme-500 rounded-full"
        >
          {{ item.number }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>