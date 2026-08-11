import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { analyzer } from "vite-bundle-analyzer"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// ElementPlus 自動按需載入
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
    analyzer({
      // npm run analyze
      // 當環境變數有 ANALYZE 時才自動在瀏覽器中打開bundle-analyzer可視化結果
      analyzerMode: process.env.ANALYZE ? 'server' : 'static',
      openAnalyzer: process.env.ANALYZE ? true : false,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        /** 
         * 自訂打包拆分策略, 本來只有一個index-[hash].js, 切分成vendor-vue-[hash].js、vendor-libs-[hash].js, 如果有用到非同步組件也會被拆開
         * 這邊先註解不用再拆, 要的話vue, pinia, Element Plus都要綁一塊, 除非有大型套件才要再分
        */
        // manualChunks(id) {
        //   // 如果引用的模組來自 node_modules
        //   if (id.includes('node_modules')) {
        //     // 把 vue, vue-router, pinia 等核心庫打包成一個叫 vendor-vue 的檔案
        //     if (id.includes('vue') || id.includes('pinia')) {
        //       return 'vendor-vue'
        //     }
        //     // 其他第三方庫（例如 axios 等）打包成另一個檔案
        //     return 'vendor-libs'
        //   }
        // },
        // 讓打包後的檔名結構更好看, 加上 hash 防止瀏覽器快取舊檔案
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  base: '/ice-dog',
})
