import type { AppState } from '../types'
import { buildDemo } from '../data/demo'
const KEY = 'smartmoney_v2'
export const loadState = (): AppState => {
  try { const r = localStorage.getItem(KEY); if (r) return { ...buildDemo(), ...JSON.parse(r) } } catch { /* ignore */ }
  return buildDemo()
}
export const saveState = (s: AppState) => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full or blocked */ } }
export const download = (name: string, content: string, type: string) => {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click()
}
export const toCSV = (s: AppState) => 'date,type,category,description,amount\n' + s.tx.map(t => [t.date, t.type, t.category, `"${t.description}"`, t.amount].join(',')).join('\n')
