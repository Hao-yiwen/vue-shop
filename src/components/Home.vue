<template>
  <el-container>
    <!--      页面头部区-->
    <el-header>
      <div><img src="../assets/logo.png" alt=""><span>卢本伟电商管理系统</span></div>
      <el-button type="primary" @click="loginout">退出</el-button>
    </el-header>
    <!--      页面主体区-->
    <el-container>
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="iscollapse"
          collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>导航一</span>
            </template>
            <el-menu-item @click="saveNavState('/'+subitem.path)" v-for="subitem in item.children" :key="subitem.id" :index="'/'+subitem.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subitem.authname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        iconsObj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        iscollapse:'false',
        activePath:''
      }
    },
    created() {
      this.getMenuList();
      this.activePath=window.sessionStorage.getItem('activePath');
    },
    methods: {
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath=window.sessionStorage.getItem('activePath');
      },
      loginout() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      toggleCollapse(){
        this.iscollapse=!this.iscollapse;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
  .iconfont{
    margin-left: 10px;
  }
  .toggle-button{
    background-color: #4A5064;
    color:#ffffff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
