<!--
 * @Author: zwz
 * @Date: 2024-04-30 16:49:39
 * @LastEditors: zwz
 * @LastEditTime: 2024-05-01 08:11:04
 * @Description: 请填写简介
-->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          :router="true"
        >
          <el-menu-item index="/">
            首页
          </el-menu-item>
          <el-sub-menu index="/content">
            <template #title>
              <span>内容管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/content/articleManage">文章管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="common-layout-header">
          <el-dropdown style="float: right; height: 100%;">
            <div style="display: flex; justify-content: center; align-items: center;">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="common-layout-header-username">{{ userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="signOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main>
          <div style="width: 100%;">
            <!-- <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              
              <el-breadcrumb-item>
                <a href="/">promotion management</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item>promotion list</el-breadcrumb-item>
              <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
            </el-breadcrumb> -->
            <router-view></router-view>
          </div>
        </el-main>
        <el-footer class="common-layout-footer">
          <div>
            代码小站 &copy;2023 - present. Created by avicii
          </div>
          </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
// 获取用户相关小仓库
import { useUserStore } from '@/stores/userStore'
// 获取路由对象
let $route = useRoute()

// 获取stores存储的用户名
let {userInfo,setUserInfo} = useUserStore()

const signOut = () => {
  console.log('退出登录');
}

</script>

<style lang="scss" scoped>
.common-layout {
  ::v-deep .el-menu--vertical {
      height: 100vh;
  }
  ::v-deep .el-main {
    background-color: #f8f8f8;
  }
  &-header {
    &-username {
      line-height: 100%;
    }
  }
  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-around
  }
}
</style>