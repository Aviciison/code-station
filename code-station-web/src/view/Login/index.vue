<!--
 * @Author: zwz
 * @Date: 2024-04-30 16:40:22
 * @LastEditors: zhaoweizuo@163.com
 * @LastEditTime: 2024-05-01 09:27:40
 * @Description: 请填写简介
-->
<template>
  <div class="login">
    <el-card class="login-card">
      <template #header>
        <div class="login-card-title">代码小站后台管理系统</div>
        <el-tabs
          v-model="activeName"
          class="login-tabs"
          :stretch="true"
          @tab-click="onTabClick"
        >
          <el-tab-pane label="登录" name="login"></el-tab-pane>
          <el-tab-pane label="注册" name="register"></el-tab-pane>
        </el-tabs>
      </template>
      <div v-if="activeName === 'login'">
        <el-form
          :model="loginForm"
          label-width="auto"
          :rules="loginRules"
          size="large"
          ref="loginRuleFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="login-card-item">
            <el-button
              size="large"
              class="login-card-button-login"
              type="primary"
              @click="loginSubmitForm(loginRuleFormRef)"
            >
              登录
            </el-button>
            <el-button
              size="large"
              class="login-card-button-reset"
              @click="loginResetForm(loginRuleFormRef)"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 注册板块 -->
      <div v-else>
        <el-form
          :model="registerForm"
          label-width="auto"
          :rules="registerRules"
          size="large"
          ref="registerRuleFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="registerForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="registerForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              type="password"
              placeholder="请再次确认密码"
              v-model="registerForm.confirmPassword"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              placeholder="请输入邮箱"
              v-model="registerForm.email"
            ></el-input>
          </el-form-item>
          <el-form-item class="login-card-item">
            <el-button
              size="large"
              class="login-card-button-login"
              type="primary"
              @click="registerSubmitForm(registerRuleFormRef)"
            >
              注册
            </el-button>
            <el-button
              size="large"
              class="login-card-button-reset"
              @click="registerResetForm(registerRuleFormRef)"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { isEmail } from "@/utils";
import { setToken } from "@/utils/user-token";
import { register, loginService } from "@/api/user";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from 'vue-router'

// 获取useUserStore的实例
const userStore = useUserStore();

// 
const router = useRouter();

const activeName = ref("login"); // 选项卡选项
// 登录表单
const loginForm = ref({
  username: "",
  password: "",
});

const loginRules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 14, message: "密码长度为6-14个字符", trigger: "blur" },
  ],
});
// 登录表单ref
const loginRuleFormRef = ref();

// 登录提交
const loginSubmitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(loginForm.value);
      try {
        const res = await loginService({ ...loginForm.value });
        console.log(res, "111");
        ElMessage.success("登录成功");
        // 存储token 和 用户信息
        setToken(res.accessToken, res.refreshToken);
        userStore.setUserInfo(res.userInfo);
        // 跳转到首页
        router.replace('/home') // 使用replace 比 push好，不需要返回登录页面
      } catch (e) {
        console.log(e);
      }
    }
  });
};
// 登录重置
const loginResetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 注册
const registerRuleFormRef = ref();
// 注册表单
const registerForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const validateEmail = (rule, value, callback) => {
  console.log(value);
  if (!value) {
    callback("请输入邮箱");
    return;
  }
  console.log(isEmail(value));
  if (!isEmail(value)) {
    callback("请输入正确邮箱");
    return;
  }
  callback();
};
// 注册表单规则
const registerRules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请输入确认密码" },
    { min: 6, max: 14, message: "密码长度为6-14个字符", trigger: "blur" },
  ],
  email: [{ required: true, trigger: "blur", validator: validateEmail }],
});

// 注册提交
const registerSubmitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      if (registerForm.value.confirmPassword !== registerForm.value.password) {
        ElMessage.error("两次输入不一致，请重新输入");
        return;
      }
      try {
        const res = await register({ ...registerForm.value });
        ElMessage.success("注册成功");
        // 切换到登录的表单，清空数据
        activeName.value = "login";
        registerResetForm(registerRuleFormRef.value);
      } catch (e) {
        console.log(e);
      }
      console.log(registerForm.value);
    }
  });
};

// 注册表单重置
const registerResetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 切换tab清空表单数据
const onTabClick = () => {
  registerResetForm(registerRuleFormRef.value);
  loginResetForm(loginRuleFormRef.value);
};
</script>

<style lang="less" scoped>
.login {
  &-card {
    position: absolute;
    left: 50%;
    top: 20%;
    min-width: 400px;
    min-height: 400px;
    &-title {
      font-size: 30px;
      margin-bottom: 10px;
    }
    &-item {
      ::v-deep .el-form-item__content {
        justify-content: space-evenly;
      }
    }
    &-button {
      &-login {
        font-size: 18px;
      }
      &-reset {
        font-size: 18px;
      }
    }
  }
  &-tabs {
    ::v-deep .el-tabs__item {
      font-size: 20px;
    }
  }
}
</style>
