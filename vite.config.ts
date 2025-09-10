import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 自定義主題文件
        // additionalData: `@use "@/assets/style/element-variables.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    ElementPlus({
      useSource: true,
    }),
  ],
})
