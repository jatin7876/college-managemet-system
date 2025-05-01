import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/register': 'http://localhost:3000',
      '/student/update-profile': 'http://localhost:3000',
      '/student/courses': 'http://localhost:3000',
      '/student/schedule': 'http://localhost:3000', 
      '/student/result': 'http://localhost:3000',
      '/student/notice': 'http://localhost:3000',
      '/student/attendance': 'http://localhost:3000', 
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true 
      }
    }
  },
  plugins: [react(), tailwindcss()]
});