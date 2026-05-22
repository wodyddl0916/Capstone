import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Docker 외부 접속 허용 (유지)
    port: 5173,      // 포트 번호 고정 (유지)
    strictPort: true, // 포트 자동 변경 방지 (유지)
    watch: {
      usePolling: true, // 파일 변경 감지 활성화 (유지)
    },
    // --- 프록시 설정 영역 ---
    proxy: {
      // 1. 네이버 API 프록시 (기존 기능 유지)
      '/v1': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
      },
      // 2. 스프링 부트 백엔드 프록시 (신규 추가)
      '/api': {
        target: 'http://43.201.202.195:8080', // 스프링 부트 서버 주소
        changeOrigin: true,
        secure: false,
      }
    }
    // --------------------------------
  },
})