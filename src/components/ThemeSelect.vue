<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Options {
  label: string | number
  value: string | number
}
interface ThemeOptions extends Options {
  /** 預覽色 */
  PreviewColor: string
  /** 文字色 */
  textColor: string
}
/** 系統主題顏色 */
const systemTheme = ref<string>('theme-blue')
/** 系統主題顏色選項 */
const themeOptions = ref<ThemeOptions[]>([
  { label: '藍', value: 'theme-blue', PreviewColor: 'linear-gradient(to right, #f0f9ff, #09a3ee)', textColor: '#33bcfd' },
  { label: '粉', value: 'theme-pink', PreviewColor: 'linear-gradient(to right, #fdf2f8, #e74a97)', textColor: '#f076b6' },
  { label: '黃', value: 'theme-yellow', PreviewColor: 'linear-gradient(to right, #fdf8e9, #de8f14)', textColor: '#efad32' },
  { label: '綠', value: 'theme-green', PreviewColor: 'linear-gradient(to right, #eefbf2, #29a05d)', textColor: '#49bb77' },
  { label: '紫', value: 'theme-purple', PreviewColor: 'linear-gradient(to right, #faf7fd, #8b4fce)', textColor: '#bb96ea' },
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
      <div class="flex items-center justify-between">
        <div class="w-12 h-4 rounded-sm mr-3" :style="{ backgroundImage: item.PreviewColor }" />
        <span :style="{ color: item.textColor }">{{ item.label }}</span>
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