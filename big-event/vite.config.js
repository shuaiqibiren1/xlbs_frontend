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
        changeOrigin: true,//修改源
        rewrite: (path) => {
          const transformedPath = path.replace(/^\/api/, '');
          //  rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
          // 这里不能直接用console.log，但你可以将路径发送到某个可以记录的地方  
          // 例如，发送到一个API端点，或者写入到浏览器的localStorage中  
          // 假设我们有一个记录路径的函数logTransformedPath  
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