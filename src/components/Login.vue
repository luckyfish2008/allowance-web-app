<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!--头像-->
        <img
          src="../assets/logo.png"
          alt
        />
      </div>
      <!--添加表单-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login_form"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icondenglu"
          ><template slot="prepend">帐号</template></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont iconmima"
            type="password"
          ><template slot="prepend">密码</template></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在5到8个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '密码为 6~8 位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 调用post请求,使用async await会对结果进行解析， res为请求结果的别名 {}用于解构返回结果
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.code === 200) {
          // 存储登录信息到localStorage中
          localStorage.setItem(this.$settings.LOGIN_UUID_KEY, res.data[this.$settings.LOGIN_UUID_KEY])
          localStorage.setItem(this.$settings.LOGIN_GH_KEY, res.data[this.$settings.LOGIN_GH_KEY])
          localStorage.setItem(this.$settings.LOGIN_USER_KEY, JSON.stringify(res.data[this.$settings.LOGIN_USER_KEY]))

          this.$message.success('登录成功')
          this.$router.push({ path: '/home' })
          this.$router.push({ path: '/home' })
        } else if (res.code === 400) {
          this.$message.error('登录失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 根节点样式
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
// 登录框
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; // 圆角
  position: absolute; // 绝对定位
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 根据自己位置 以自己为长度位移
  // 头像框
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%; // 加圆角
    padding: 2px;
    box-shadow: 0 0 10px #ddd; // 盒子阴影
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0ee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%; // 加圆角
      background-color: #eee;
    }
  }
  .btns {
    display: flex; // 弹性布局
    justify-content: flex-end; // 尾部对齐
  }
  .login_form {
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box; // 设置边框
  }
}
</style>
