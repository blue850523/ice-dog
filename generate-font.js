import svgtofont from 'svgtofont'
import path from 'path'

svgtofont({
  // 1. SVG 圖標存放目錄（要先手動建立此資料夾並放入 SVG 檔案）
  src: path.resolve(process.cwd(), 'src/assets/icons'), 
  
  // 2. 產生的字體與 CSS 存放目錄
  dist: path.resolve(process.cwd(), 'src/assets/fonts'), 
  
  fontName: 'svg-font', // 字體名稱與 CSS 前綴
  css: true,           // 自動生成 CSS 檔案
  startUnicode: 0xea01,
  svgicons2svgfont: {
    normalize: true   // 自動縮放、對齊 SVG，避免大小不一
  }
}).then(() => {
  console.log('🚀 [svgtofont] 字體與 CSS 轉換成功')
})