<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getLocal, setLocal } from '../utils/index.ts'
import ThemeSelect from './ThemeSelect.vue'
import DarkMode from './DarkMode.vue'

interface Options {
  label: string | number
  value: string | number
}
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

/** 每行個數 */
const size = ref<number>(3)
/** 每行個數選項 */
const sizeOptions = ref<Options[]>([
  { label: '3 x 3', value: 3 },
  { label: '4 x 4', value: 4 },
  { label: '5 x 5', value: 5 },
])
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

/** 設定本地儲存資料 */
const setLocalData = (): void => {
  size.value = getLocal<number>('size') ?? size.value

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
  [size, bingoData, status, nowSettingNumber, settingHistory, gameHistory],
  ([newSize, newBingo, newStatus, newNowSetting, newSettingHistory, newGameHistory]) => {
    setLocal('size', newSize)
    setLocal('bingoData', newBingo)
    setLocal('status', newStatus)
    setLocal('nowSettingNumber', newNowSetting)
    setLocal('settingHistory', newSettingHistory)
    setLocal('gameHistory', newGameHistory)
  },
  { deep: true, immediate: false }
)

onMounted(() => {
  setLocalData()
})
</script>

<template>
  <div class="container !pt-20 md:pt-16 bg-[var(--color-theme-50)] dark:bg-[var(--color-theme-950)] text-[var(--color-theme-950)] dark:text-[var(--color-theme-50)]">
    <!-- header -->
    <header class="flex items-center justify-center fixed top-0 left-1/2 translate-x-[-50%] w-full md:w-3xl h-16 bg-[var(--color-theme-200)] z-10">
      <div class="flex items-center justify-center flex-wrap ">
        <DarkMode class="mr-2" />
        <ThemeSelect class="mr-2" />
        <el-select 
          v-model="size" 
          class="select !w-20 mr-2" 
          :popper-class="'selectOption'"
          @change="setBingo">
          <el-option
            v-for="item in sizeOptions"
            :key="`sizeOption-${item.value}`"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <button class="button mr-2" type="button" @click="setBingo">清空</button>
        <button class="button" type="button" @click="random">隨機</button>
      </div>
    </header>

    <!-- bingo board -->
    <div class="relative flex items-center justify-center flex-col mt-[0] mx-[auto] mb-4 w-[fit-content] border-[1px] border-[var(--color-theme-800)] bg-[#ffffff]">
      <div 
        v-for="(item, index) in bingoData" 
        :key="`bingoRow-${index}`" 
        class="flex">
        <div 
          v-for="(item2, index2) in item" 
          :key="`bingoItem-${index}-${index2}`" 
          class="flex items-center justify-center w-16 md:w-20 h-16 md:h-20 text-2xl border-[1px] border-[var(--color-theme-800)] text-[var(--color-theme-800)] cursor-pointer hover:bg-[var(--color-theme-200)] transition-all duration-200"
          :class="item2.selected && 'bg-[var(--color-theme-300)]'" 
          @click="clickBingoItem(index, index2)">
          {{ item2.number || '' }}
        </div>
      </div>
    </div>

    <!-- action -->
    <div class="flex items-center justify-center flex-wrap">
      <div v-if="status === 'setting'" class="mb-4 w-full text-xl text-center font-bold text-theme-color">下個數字：{{ nowSettingNumber }}</div>
      <div 
        v-if="(status === 'setting' || status === 'settingDone') || (status === 'start' && gameHistory.length >= 1)" 
        class="flex items-center justify-center mb-4 space-x-2"
      >
        <button v-if="(status === 'setting' || status === 'settingDone') && nowSettingNumber > 1" class="button button-md" type="button" @click="backNumber">上一步</button>
        <button v-if="status === 'settingDone'" class="button button-md" type="button" @click="start">開始</button>
        <button v-if="status === 'start' && gameHistory.length >= 1" class="button button-md" type="button" @click="backHistory">上一步</button>
      </div>
    </div>

    <!-- history -->
    <div v-if="status === 'start'" class="flex items-center justify-center flex-col">
      <span class="mb-2 text-xl font-bold text-theme-color">歷史紀錄</span>
      <div class="flex items-center justify-center flex-wrap w-full">
        <div 
          v-for="item in gameHistory" 
          :key="`history-${item.number}`"
          class="flex items-center justify-center m-1 w-7.5 h-7.5 text-lg md:text-base text-[var(--color-theme-50)] bg-[var(--color-theme-500)] rounded-full"
        >
          {{ item.number }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-select.select) {
  .el-select__wrapper {
    background-color: var(--color-theme-50);
    box-shadow: none;
  }
  .el-select__wrapper.is-focused {
    box-shadow: 0 0 0 1px var(--color-theme-600);
  }
  .el-select__selected-item {
    color: var(--color-theme-900);
  }
  .el-select__suffix .el-icon {
    color: var(--color-theme-900);
  }
}
.selectOption {
  .el-select-dropdown__item {
    color: var(--color-theme-900);
  }
  .el-select-dropdown__item.is-selected {
    color: var(--color-theme-500);
  }
  .el-select-dropdown__item.is-hovering {
    background-color: var(--color-theme-50);
  }
}
</style>