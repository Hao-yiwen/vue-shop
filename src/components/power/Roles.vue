<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <!-- 添加角色区 -->
        <el-col>
          <el-button type="primary" @click="adddialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表渲染区 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="100px"
        :model="addRole"
        :rules="addRoleRules"
        ref="addRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        label-width="100px"
        :model="editroles"
        :rules="editrolesRules"
        ref="editrolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      center
      @close="setRightDialogClosed"
    >
      <el-tree
        node-key="id"
        show-checkbox
        :data="rightList"
        :props="treeProps"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //所有角色列表数据
      roleList: [],
      adddialogVisible: false,
      addRole: {
        roleName: '',
        roleDesc: '',
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名称的长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '角色描述的长度在6~16个字符之间',
            trigger: 'blur',
          },
        ],
      },
      addRoleRef: {},
      editdialogVisible: false,
      editroles: {},
      editrolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名称的长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '角色描述的长度在6~16个字符之间',
            trigger: 'blur',
          },
        ],
      },
      editrolesRef: {},
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点值
      defKeys: [],
      // 即将分配权限的id
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    addRoles() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addRole)
        if (res.meta.status != 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.adddialogVisible = false
        this.getRolesList()
      })
    },
    async editRole(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.$message.success('获取用户成功')
      this.editroles = res.data
      this.editdialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editrolesRef.resetFields()
    },
    editRolesSubmit() {
      this.$refs.editrolesRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        console.log(this.editroles)
        console.log(typeof this.editroles.roleName)
        console.log(typeof this.editroles.roleDesc)
        const { data: res } = await this.$http.put(
          'roles/' + parseInt(this.editroles.roleId),
          {
            id: parseInt(this.editroles.roleId),
            roleName: this.editroles.roleName,
            roleDesc: this.editroles.roleDesc,
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('更新角色信息失败')
        }
        this.editdialogVisible = false
        this.getRolesList()
        this.$message.success('更新角色信息成功')
      })
    },
    async removeRoles(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id, {
        id: id,
      })
      if (res.meta.status != 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    async removeRightById(role, right) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${right}`
      )
      if (res.meta.status != 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
      this.$message.success('删除成功')
    },
    async showSetRightDialog(role) {
      this.roleId=role.id;
      //获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        return this.$message.error('获取用户权限失败')
      }
      this.rightList = res.data
      // 递归获取三级节点id
      this.getLeaKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeaKeys(node,arr) {
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>this.getLeaKeys(item,arr));
    },
    setRightDialogClosed(){
      this.defKeys=[];
    },
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()];
      console.log(keys);
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idStr
      })
      if(res.meta.status!=200){
        return this.$message.error('分配权限失败');
      }
      this.$message.success('分配权限成功');
      this.getRolesList();
      this.setRightDialogVisible=false;
    }
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>