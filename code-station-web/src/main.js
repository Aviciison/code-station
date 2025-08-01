/*
 * @Author: zwz
 * @Date: 2024-04-30 09:33:46
 * @LastEditors: zwz
 * @LastEditTime: 2024-05-01 08:22:27
 * @Description: 请填写简介
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import {createPinia} from 'pinia'
import { ElMessage } from "element-plus";
import router from './router'


const app = createApp(App)

for(const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElMessage);
app.config.globalProperties.$message = ElMessage;

app.use(createPinia())


app.use(router)

app.mount('#app')
