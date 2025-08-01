/*
 * @Author: zwz
 * @Date: 2024-04-28 09:21:18
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-29 15:19:35
 * @Description: 请填写简介
 */
import { defineConfig } from '@umijs/max';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig({
  esbuildMinifyIIFE: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  alias: {
    assets: '/src/assets',
  },
  lessLoader: {
    modifyVars: {
      // 'theme-color': '#1DA57A',
      hack: `true; @import "@/style/variables.less";`,
    },
    javascriptEnabled: true,
  },
  layout: {
    title: '代码小站',
  },
  routes: [
    { path: '/login', component: './login', layout: false, hideInMenu: true },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '聊天室',
      path: '/chat',
      component: './chat',
      routes: [
        {
          path: '/chat',
          component: '@/pages/chat/friendShip',
        },
        {
          path: '/chat/chat',
          component: '@/pages/chat/chat',
        },
        {
          path: '/chat/group',
          component: './chat/Group',
        },
        {
          path: '/chat/collection',
          component: './chat/Collection',
        },
        {
          path: '/chat/notification',
          component: './chat/Notification',
        },
      ],
    },
    {
      name: '图表',
      path: '/chart',
      component: './chart',
    },
    {
      name: '写文章',
      path: '/article',
      component: './article',
      hideInMenu: true,
      access: 'canSeeLogin',
    },
    {
      name: '个人中心',
      path: '/personalCenter',
      component: './personalCenter',
      hideInMenu: true,
      access: 'canSeeLogin',
    },
    {
      name: '编辑个人资料',
      path: '/editPerson',
      component: './personalCenter/editPerson',
      hideInMenu: true,
      access: 'canSeeLogin',
    },
    {
      name: '文章详情',
      path: '/articleDetail/:articleId',
      component: './articleDetail',
      hideInMenu: true,
    },
  ],

  npmClient: 'pnpm',
  proxy: {
    '/api/chat': {
      target: 'http://localhost:3000',
      // target: 'http://116.198.235.238:3000',
      changeOrigin: true,
      pathRewrite: { '^/api/chat': '' },
    },
    '/api': {
      target: 'http://127.0.0.1:3005',
      // target: 'http://116.198.235.238:3005',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  // plugins: ['umi-plugin-sentry-react'],
  // sentry: {
  //   sourceMap: {
  //     dsn: 'https://5b779a568cc57fbd005be1d2c46357fb@o4507649669529600.ingest.us.sentry.io/4507649675689984',
  //   },
  // },
  extraPostCSSPlugins: [postcssPresetEnv()],
  tailwindcss: {},
});
