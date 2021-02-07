<template>
  <el-dialog
    :title="!editForm.id ? '新增用户' : '修改用户'"
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
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="editForm.username"
          :disabled="editForm.id ? true : false"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="editForm.password"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
    </el-form>
    <!-- 内容底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="saveUser">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false, // 是否显示dialog
      api: '', // 增加，修改提交的api地址
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
    // 页面初始化  async init
    init (id) {
      // 给表单id赋值，这样值变化后自动会刷新页面
      this.editForm.id = id
      this.visible = true
      this.api = 'addUser'
      if (id) {
        // 修改
        this.api = 'editUser'
        this.$http
          .get('getUpdateUser', { params: { id: id } })
          .then(res => {
            this.editForm = res.data.data
          })
          .catch(err => {
            console.log(err)
            this.$message.error('获取数据失败')
          })
      }
    },
    // 保存用户
    saveUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(this.api, this.editForm)
        if (res.code !== 200) {
          return this.$message.error('保存失败')
        }
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('refreshDataList')
      })
    },
    // 关闭对话框触发
    setDialogClosed () {
      // 因为对话框是显示，隐藏。关掉的时候清除表单数据
      this.$refs.editFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped></style>
