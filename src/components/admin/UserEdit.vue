<template>
  <el-dialog
    :title="!editForm.id?'新增用户':'修改用户'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="setDialogClosed"
    width="40%"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="70px"
    >
      <!-- 用户名 -->
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input v-model="editForm.password"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
    </el-form>
    <!-- 内容底部区域 -->
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="saveUser"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false, // 是否显示dialog
      editForm: {
        id: null,
        username: '',
        password: '',
        email: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 5, max: 15, message: '请输入正确邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 页面初始化
    async init (id) {
      const { data: res } = await this.$http.get('getUpdateUser', { params: id })
      if (res.code === 200) {
        this.editForm = res.data
        this.visible = true
        this.editForm.id = id
      }
    },
    // 保存用户
    saveUser () {
      console.log('zzzzz')
    },
    // 关闭对话框触发
    setDialogClosed () {
      this.$emit('refreshDataList')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
