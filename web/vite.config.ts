import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pagesはリポジトリ名(このリポジトリでは "-") をサブパスとして配信するため、
// 本番ビルド時のみ base をそのパスに合わせる。開発サーバーではルート("/")のまま。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/-/' : '/',
  plugins: [react()],
}))
