/*
 * @Author: zwz
 * @Date: 2024-04-30 16:34:23
 * @LastEditors: zwz
 * @LastEditTime: 2024-05-01 08:10:35
 * @Description: 请填写简介
 */
import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/view/Layout/index.vue'),
      children: [
        {
          path: '',
          name: '首页',
          component: () => import('@/view/home/index.vue'),
        },
        {
          path: '/content',
          name: '内容管理',
          children: [
            {
              path: '/content/articleManage',
              name: '文章管理',
              component: () => import('@/view/articleManage/index.vue'),
            }
          ]
        }
      ]
    },
    { path: "/login", component: () => import('@/view/Login/index.vue')},
  ]
})


router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，表示放行
    // next() 放行  next('/login') 强制跳转
  const refresh_token = localStorage.getItem('refresh_token')
  // if (to.path === '/login' && refresh_token && from.path !== '/login') {
  //   return next(from.path)
  // }
  if (to.path === '/login') {
    return next()
  }

  
  if (!refresh_token) {
    return next('/login')
  }
  next()
})

export default router