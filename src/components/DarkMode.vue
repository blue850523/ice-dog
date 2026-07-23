<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLocal, setLocal } from '../utils/index.ts'

type Mode = 'light' | 'dark'
/** 系統模式 */
const systemMode = ref<Mode>('dark')

/** 初始化系統預設 */
const initSystemMode = (): void => {
  const mode = getLocal<Mode>('mode') ?? systemMode.value
  
  if (mode) {
    changeTheme(mode)
  } else {
    // 抓系統預設
    systemMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light'
    changeTheme(systemMode.value)
  }
}

/** 切換主題 */
const changeTheme = (mode: Mode): void => {
  if (mode === 'dark') {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
  setLocal('mode', mode)
  systemMode.value = mode
}

onMounted(() => {
  initSystemMode()
})
</script>

<template>
  <button
    class="flex items-center justify-center h-8 w-8 cursor-pointer select-none rounded bg-theme-50 hover:bg-theme-300 transition-all"
    @click="changeTheme(systemMode === 'dark' ? 'light' : 'dark')"
  >
    <span>
      <i v-show="systemMode === 'light'" class="svg-font-sun text-theme-900 text-3xl"></i>
      <i v-show="systemMode === 'dark'" class="svg-font-moon text-theme-900 text-3xl"></i>
    </span>
  </button>
</template>
