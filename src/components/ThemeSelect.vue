<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Options {
  label: string | number
  value: string | number
}
interface ThemeOptions extends Options {
  color: string
}
/** 系統主題顏色 */
const systemTheme = ref<string>('theme-blue')
/** 系統主題顏色選項 */
const themeOptions = ref<ThemeOptions[]>([
  { color: '#33bcfd', label: '藍', value: 'theme-blue' },
  { color: '#f076b6', label: '粉', value: 'theme-pink' },
  { color: '#efad32', label: '黃', value: 'theme-yellow' },
  { color: '#49bb77', label: '綠', value: 'theme-green' },
  { color: '#bb96ea', label: '紫', value: 'theme-purple' },
])
/** 初始化系統主題顏色 */
const initSystemTheme = (): void => {
  const theme = localStorage.getItem('theme')
  if (theme) {
    changeTheme(theme)
  } else {
    changeTheme(systemTheme.value)
  }
}
/** 切換主題色 */
const changeTheme = (theme: string) => {
  if (document.documentElement.className.includes('dark')) {
    document.documentElement.className = `${theme} dark`
  } else {
    document.documentElement.className = theme || ""
  }
  localStorage.setItem('theme', theme)
  systemTheme.value = theme
}

onMounted(() => {
  initSystemTheme()
})
</script>

<template>
  <el-select
    v-model="systemTheme"
    class="!w-16 select" 
    :popper-class="'selectOption'"
    @change="changeTheme">
    <el-option
      v-for="item in themeOptions"
      :key="`themeOption-${item.value}`"
      :label="item.label"
      :value="item.value"
    >
      <div class="flex items-center justify-baseline">
        <div class="w-4 h-4 rounded-sm mr-1.5" :style="{ backgroundColor: item.color }" />
        <span :style="{ color: item.color }">{{ item.label }}</span>
      </div>
    </el-option>
  </el-select>
</template>

<style lang="scss" scoped>
:deep(.el-select-dropdown__item.is-selected) {
  font-weight: bold;
}
.selectOption {
  .el-select-dropdown__item.is-hovering {
    background-color: var(--color-theme-50);
  }
}
</style>