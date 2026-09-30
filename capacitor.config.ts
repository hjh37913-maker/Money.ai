import type { CapacitorConfig } from '@capacitor/cli'
const config: CapacitorConfig = {
  appId: 'com.smartmoney.ai',
  appName: 'SmartMoney AI',
  webDir: 'dist',
  plugins: { CapacitorHttp: { enabled: true } }, // запити до AI-API йдуть нативно, без CORS
}
export default config
