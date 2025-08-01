/*
 * @Author: zwz
 * @Date: 2024-04-30 09:33:46
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-30 16:46:57
 * @Description: 请填写简介
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // 配置项目@别名
    alias: {
      '@': path.join(__dirname, './src')
    }
  },
  // 配置跨域
  server: {
    proxy: {
      "/api": { // 作为可替代域名
        target: 'http://127.0.0.1:3000', // 表示要替换的服务端地址
        changeOrigin: true, // 表示开启代理, 允许跨域请求数据
        rewrite: path => path.replace(/^\/api/, '') // 设置重写路径, 去掉path
      }
    }
  }
})
