<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.query">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username">
      </el-table-column>
      <el-table-column label="邮箱" prop="email">
      </el-table-column>
      <el-table-column label="电话" prop="mobile">
      </el-table-column>
      <el-table-column label="角色" prop="role_name">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--        {{scope.row.mg_state}}-->
          <el-switch
            @change="userstateChanged(scope.row)"
            v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-tooltip :enterable="false" effect="dark" content="Top Center 分配角色" placement="top"></el-tooltip>
          <el-button icon="el-icon-edit" type="primary" size="mini">{{scope.row.name}}</el-button>
          <el-tooltip :enterable="false" effect="dark" content="Top Center 分配角色" placement="top"></el-tooltip>
          <el-button icon="el-icon-delete" type="danger" size="mini">{{scope.row.name}}</el-button>
          <el-tooltip :enterable="false" effect="dark" content="Top Center 分配角色" placement="top"></el-tooltip>
          <el-button icon="el-icon-setting" type="warning" size="mini">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!--  添加对话框-->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
  >
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
             label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="addForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="addForm.email" ></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>

</template>

<script>
  export default {
    data() {
      var checkEmail=(rules,value,cb)=>{
        // const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(
      }
      var checkMobile=(rules,value,cb)=>{

      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        //控制显示与隐藏
        addDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile:''
        },
        addFormRules: {
          username: [
            {
              required: true, message: '请输入用户名', trigger: 'blur'
            },
            {
              min: 3, max: 6, message: '请输入3~6个字符', trigger: 'blur'
            }
          ],
          password: [
            {
              required: true, message: '请输入密码', trigger: 'blur'
            },
            {
              min: 3, max: 6, message: '请输入3~6个字符', trigger: 'blur'
            }
          ],
          email:[
            {
              required: true, message: '请输入邮箱', trigger: 'blur'
            },
            {
              min: 3, max: 6, message: '请输入3~6个字符', trigger: 'blur'
            }
          ],
          mobile:[
            {
              required: true, message: '请输入手机', trigger: 'blur'
            },
            {
              min: 3, max: 6, message: '请输入3~6个字符', trigger: 'blur'
            }
          ]
        }
      }
    },
    async created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        if (res.meta.status != 200) return this.$message.error('获取用户列表失败');
        this.userList = res.data.users;
        this.total = res.data.total;
      },
      async getMenuList() {
        const {data: res} = await this.$http.get('menus');
        if (res.meta != 200) {
          return this.$message.error('获取失败', res.meta.msg);
        }
        this.menuList = res.data;
      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this.getMenuList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getMenuList();
      },
      async userstateChanged(userinfo) {
        const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
        if (res.meta.status != 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新状态失败');
        }
        this.$message.success('更新状态成功');
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-pagination {
    margin-top: 15px;
  }
</style>
