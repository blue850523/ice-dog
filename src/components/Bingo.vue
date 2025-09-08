<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Options {
  label: string
  value: number
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
type Status = 
  /** 初始化 */
  'init' | 
  /** 設定數字中 */
  'setting' | 
  /** 設定數字完成 */
  'settingDone' | 
  /** 遊戲中 */
  'start' | 
  /** 遊戲結束 */
  'end'

/** 每行個數 */
const numberOfRow = ref<number>(3)
/** 每行個數選項 */
const numberOfRowOptions = ref<Options[]>([
  { label: '3 x 3', value: 3 },
  { label: '5 x 5', value: 5 },
])
/** 賓果格 */
const bingoData = ref<BingoItem[][]>([])
/** 狀態 */
const status = ref<Status>('init')
/** 目前設定第幾個 */
const nowSettingNumber = ref<number>(1)
/** 設置歷史紀錄, 隨機產生時沒有設置歷史紀錄 */
const settingHistory = ref<[number, number][]>([])
/** 遊戲歷史紀錄 */
const gameHistory = ref<HistoryItem[]>([])

/** 產生賓果盤 */
const setBingo = (): void => {
  bingoData.value = Array.from({ length: numberOfRow.value }, (_, _index) => {
    return Array.from({ length: numberOfRow.value }, (_, _index2) => {
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
  const numbers = Array.from({ length: numberOfRow.value * numberOfRow.value }, (_, index) => {
    return index + 1
  })
  // 打亂數字陣列
  for (let i = numbers.length - 1; i > 0; i--) {
    // 隨機位置
    const randomIndex = Math.floor(Math.random() * (i + 1))
    // 交換
    ;[numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]]
  }
  bingoData.value = Array.from({ length: numberOfRow.value }, (_, index) => {
    return Array.from({ length: numberOfRow.value }, (_, index2) => {
      return {
        number: numbers[index * numberOfRow.value + index2],
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
  if (nowSettingNumber.value > numberOfRow.value * numberOfRow.value) {
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

onMounted(() => {
  setBingo()
})
</script>

<template>
  <div class="container">
    <!-- header -->
    <header>
      <div class="headerRow">
        <el-select v-model="numberOfRow" style="width: 5rem; margin-right: 1.25rem" @change="setBingo">
          <el-option
            v-for="item in numberOfRowOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="random">隨機選號</el-button>
      </div>
    </header>

    <div class="bingo">
      <div 
        v-for="(item, index) in bingoData" 
        :key="`bingoRow-${index}`" 
        class="bingoRow">
        <div 
          v-for="(item2, index2) in item" 
          :key="`bingoItem-${index}-${index2}`" 
          class="bingoItem"
          :class="{ selected: item2.selected }" 
          @click="clickBingoItem(index, index2)">
          {{ item2.number === 0 ? '' : item2.number }}
        </div>
      </div>
    </div>

    <div class="settingRow">
      <div v-if="status === 'setting'" class="nowSettingNumber">{{ status }}下個數字：{{ nowSettingNumber }}</div>
      <el-button v-if="(status === 'setting' || status === 'settingDone') && nowSettingNumber > 1" style="margin-right: .625rem" type="primary" @click="backNumber">上一步</el-button>
      <el-button v-if="status === 'settingDone'" style="margin-right: .625rem" type="primary" @click="start">開始</el-button>
      <el-button v-if="status === 'start' && gameHistory.length >= 1" type="primary" @click="backHistory">上一步</el-button>
    </div>

    <div v-if="status === 'start'" class="history">
      <span style="margin-bottom: .625rem">歷史紀錄</span>
      <div class="historyRow">
        <div 
          v-for="item in gameHistory" 
          :key="`history-${item.number}`"
          class="historyItem"
        >
          {{ item.number }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding-top: 4rem;
  background-color: #f0f9ff;
  color: #062e4b;
}
header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  background-color: #b8e5ff;
}
.headerRow {
  display: flex;
  align-items: center;
  justify-content: center;
}
.settingRow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.nowSettingNumber {
  width: 100%;
  margin-bottom: 1.25rem;
  text-align: center;
}
.bingo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto 1.25rem;
  width: fit-content;
  border: 1px solid #045888;
  background-color: #ffffff;
  .bingoRow {
    display: flex;
    .bingoItem {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border: 1px solid #045888;
      color: #062e4b;
      cursor: pointer;
      &:hover {
        background-color: #b8e5ff;
      }
      &.selected {
        background-color: #6ccdff;
      }
    }
  }
}
.history {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .historyRow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    .historyItem {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: .25rem;
      width: 1.875rem;
      height: 1.875rem;
      color: #ffffff;
      background-color: #09a3ee;
      border-radius: 50%;
    }
  }
}

@media (max-width: 768px) {
  .bingoItem {
    width: 4rem !important;
    height: 4rem !important;
  }
}
</style>