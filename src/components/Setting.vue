<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from "pinia"
import { getLocal, setLocal } from '../utils/index.ts'
import ThemeSelect from './ThemeSelect.vue'
import type { Options } from './types.ts'
import { useSettingStore } from '../store/setting.ts'

const settingStore = useSettingStore()
const { size, winLine } = storeToRefs(settingStore)

const dialogVisible = ref<boolean>(false)

/** 每行個數 */
const selectSize = ref<number>(size.value || 5)
/** 每行個數選項 */
const sizeOptions = ref<Options[]>([
  { label: '3 x 3', value: 3 },
  { label: '4 x 4', value: 4 },
  { label: '5 x 5', value: 5 },
])
const handleChangeSize = () => {
  settingStore.setSize(selectSize.value)
}

/** 獲勝連線數 */
const selectWinLine = ref<number>(winLine.value || 1)
/** 獲勝連線數選項 */
const winLineOptions = computed((): Options[] => {
  let maxLine = 1
  let options = [] as Options[]
  if (size.value === 3) maxLine = 5
  else if (size.value === 4) maxLine = 8
  else if (size.value === 5) maxLine = 10
  for (let i = 1; i <= maxLine; i++) {
    options.push({ label: `${i}`, value: i })
  }
  return options
})
const handleChangeWinLine = () => {
  settingStore.setWinLine(selectWinLine.value)
}

/** 設定本地儲存資料 */
const setLocalData = (): void => {
  selectSize.value = getLocal<number>('size') ?? selectSize.value
  selectWinLine.value = getLocal<number>('winLine') ?? selectWinLine.value 
}

watch(
  [selectSize, selectWinLine],
  ([newSelectSize, newSelectWinLine]) => {
    setLocal('size', newSelectSize)
    setLocal('winLine', newSelectWinLine)
  },
  { deep: true, immediate: false }
)

onMounted(() => {
  setLocalData()
})
</script>

<template>
  <!-- target -->
  <button 
    class="flex items-center justify-center h-8 w-8 cursor-pointer select-none rounded bg-theme-50 hover:bg-theme-300 transition-all"
    @click="dialogVisible = true"
  >
    <i class="svg-font-setting text-theme-900 text-3xl"></i>
  </button>

  <!-- dialog -->
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    width="260"
    class="bg-theme-200!"
    append-to-body
  >
    <template #header>
      <div class="w-full text-center text-xl font-bold text-theme-700">設定</div>
    </template>

    <div class="space-y-2">
      <div class="flex items-center">
        <div class="w-20 mr-1 text-md font-bold text-theme-700">賓果盤尺寸</div>
        <el-select 
          v-model="selectSize" 
          class="select w-24! mr-2" 
          :popper-class="'selectOption'"
          @change="handleChangeSize">
          <el-option
            v-for="item in sizeOptions"
            :key="`sizeOption-${item.value}`"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <div class="w-20 mr-1 text-md font-bold text-theme-700">獲勝連線數</div>
        <el-select 
          v-model="selectWinLine" 
          class="select w-24! mr-2" 
          :popper-class="'selectOption'"
          @change="handleChangeWinLine">
          <el-option
            v-for="item in winLineOptions"
            :key="`winLineOption-${item.value}`"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="flex items-center">
        <div class="w-20 mr-1 text-md font-bold text-theme-700">主題色</div>
        <ThemeSelect />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end w-full">
        <button class="button" type="button" @click="dialogVisible = false">關閉</button>
      </div>
    </template>
  </el-dialog>
</template>