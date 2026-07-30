<script setup lang="ts">
import Bingo from './components/Bingo.vue'
import { useSettingStore } from './store/setting.ts'

const settingStore = useSettingStore()
settingStore.init()
</script>

<template>
  <Bingo />
</template>

<style scoped>

</style>
