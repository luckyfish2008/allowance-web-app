<template>
  <div>
    home
    <el-button type="info" @click="logout">安全退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.removeItem('user') // 清除session
      window.sessionStorage.removeItem('flag')
      this.$router.push('/login') // 回到登录页面
    }
  }
}
</script>
<style lang="less" scoped></style>
