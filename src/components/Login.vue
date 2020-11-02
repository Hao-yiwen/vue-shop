<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>

<!--      表单-->
      <el-form ref="loginFormRef" label-width="0px" :model="loginform" :rules="rules" class="login_form">
        <el-form-item prop="name">
          <el-input prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm" >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
          return{
            loginform:{
              username:'zs',
              password:'123'
            },
            rules:{
              name: [
                { required: false, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
              ]
            }
          }
        },
      methods:{
          resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
          },
        login(){
          console.log(this);
            this.$refs.loginRef.validate(async (valid)=>{
              if(!valid){
                return;
              }
              const {data:res}=await this.$http.post('login',this.loginform);
              if(res.meta!==200){
                this.$message.error('登陆失败');
              }
              this.message.error('登陆成功');
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home');
            })
        }
      }
    }
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      position: absolute;
      padding: 5px;
      left: 50%;
      top: -20%;
      box-shadow: 0 0 10px #ddd;
      transform: translateX(-50%);
      background-color: #fff;
      img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
