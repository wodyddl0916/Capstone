import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Docker 외부 접속 허용
    port: 5173,      // 포트 번호 고정
    strictPort: true, // 포트가 사용 중일 때 자동으로 다른 포트로 바뀌는 것 방지
    watch: {
      usePolling: true, // Windows/Docker 환경에서 파일 변경 감지 활성화
    }
  },
  // 만약 사이트 주소가 localhost:5173/watt-mate 라면 아래 설정을 켭니다.
  // base: '/watt-mate/', 
})