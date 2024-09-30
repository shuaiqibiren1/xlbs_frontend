import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server: {
    proxy: {
      '/api': {//获取路径中包含了/api的请求
        target: 'http://localhost:8080',//后台服务所在的源
        // target: 'http://159.75.116.168:8080',
        changeOrigin: true,//修改源
        rewrite: (path) => {
          const transformedPath = path.replace(/^\/api/, '');
          logTransformedPath(transformedPath);
          return transformedPath;
        }
      }
    }
  }
})



function logTransformedPath(path) {
  // 这里实现你的逻辑，比如发送到服务器，或者存储到localStorage等  
  console.log('Transformed path:', path); // 这只是示例，实际上在配置文件中这样做可能不行  
}