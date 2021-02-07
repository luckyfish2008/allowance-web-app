<template>
  <div style="height:100%">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="showEditDialog($event)"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="userlist"
        border
        stripe
        size="medium"
        ref="mytableRef"
        :height="tableHeight"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
          width="200"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          width="200"
        ></el-table-column>
        <el-table-column
          label="密码"
          prop="password"
          width="200"
        ></el-table-column>
        <el-table-column label="角色" prop="role" width="200"></el-table-column>
        <el-table-column label="状态" prop="state" width="100">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog($event, scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 权限 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 100]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--弹框 新增/修改  试了一下也可以用标签 UserEdit 或者user-edit  -->
    <user-edit
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refreshDataList="getUserList"
    >
    </user-edit>
  </div>
</template>
<script>
// 导入增加修改页面组件
import UserEdit from './UserEdit.vue'
export default {
  // 注册增加修改页面组件
  components: { UserEdit },
  // 数据
  data () {
    return {
      // 查询数据
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 100
      },
      tableHeight: 0, // 表格高度
      userlist: [], // 用户列表
      total: 0, // 最大数据记录
      addOrUpdateVisible: false // 新增/修改界面是否显示
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {
    // console.log('mounted')
    this.$nextTick(function () {
      /*
      console.log(window)
      console.log(
        this.$refs.mytableRef.$el.parentElement.parentElement.parentElement
          .offsetHeight,
        this.$refs.mytableRef.$el.topElement
      )
      */
      this.tableHeight =
        window.innerHeight - this.$refs.mytableRef.$el.offsetTop - 80
    })
  },
  methods: {
    // 查询用户数据
    async getUserList () {
      // console.log('getUserList')
      const { data: res } = await this.$http.get('getAllUser', {
        params: this.queryInfo
      })
      if (res.code === 200) {
        this.userlist = res.data.data
        this.total = res.data.total
      } else {
        this.$message.error('查询异常！')
      }
    },
    // 改变状态
    async userStateChanged (userInfo) {
      const confirmResult = await this.$confirm(
        '修改用户状态, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        userInfo.state = !userInfo.state // 撤回原来的状态
        return this.$message.info('已取消')
      }
      // 提交到后台进行修改状态
      const { data: res } = await this.$http.put(
        `updateState?id=${userInfo.id}&state=${userInfo.state}`
      )
      if (res.code !== 200) {
        this.$message.error('状态修改失败！')
      }
      this.$message.success('状态修改成功！')
    },
    // 监听pageSize改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList() // 数据发生改变重新申请数据
    },
    // 监听pageNum改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList() // 数据发生改变重新申请数据
    },
    // 新增修改页面
    showEditDialog (event, id) {
      // 显示组件
      this.addOrUpdateVisible = true
      // 调用初始化方法
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.init(id)
      })
    },
    // 删除
    async deleteUser (id) {
      const confirmResult = await this.$confirm(
        '用户将被永久删除,确定删除吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('deleteUser?id=' + id)
      if (res.code !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>
<style scoped></style>
