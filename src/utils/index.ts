/**
 * 取得 localStorage 資料
 * @param key localStorage 的 key
 * @param defaultValue 預設值
 */
export function getLocal <T>(key: string, defaultValue?: T): T | undefined {
  const data = localStorage.getItem(key)
  if (!data) return defaultValue
  try {
    return JSON.parse(data) as T
  } catch {
    return defaultValue
  }
}

/**
 * 設定 localStorage 資料
 * @param key localStorage 的 key
 * @param value 資料
 */
export function setLocal (key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}