import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    proxy: {
      '/login': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/register': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/student/update-profile': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/student/courses': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/student/schedule': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app', 
      '/student/result': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/student/notice': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
      '/student/attendance': 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app', 
      '/socket.io': {
        target: 'https://sparkling-pamelina-jatin7876-c8ba21cb.koyeb.app',
        ws: true 
      }
    }
  },
  plugins: [react(), tailwindcss()]
});