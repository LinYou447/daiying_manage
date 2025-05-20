<style scoped>
.home-style{
  width: 100%;
  height: 100%;
  position: relative;
}
.home-style-title{
  position: absolute;
  left: 20px;
  top: 17px;
  color: white;
  font-size: 16px;
  z-index: 10;
}
.home-style-title1{
  position: absolute;
  left: 20px;
  top: 17px;
  color: black;
  font-size: 16px;
  z-index: 10;
}
.content-body-style{
  height: calc(100% - 60px);
  width: 100%;
  display: flex;
}
.content-body-right{
  width: calc(100% - 240px);
  height: 100%;
  padding: 15px;
}
</style>

<template>
  <div class="home-style">

    <div style=" position: absolute;right: 0;top: 15px;width: 60px;height: 60px;z-index: 10">
      <Space size="large" wrap>
        <Dropdown
            :transfer="isMobile"
            :placement="isMobile ? 'bottom' : 'bottom-end'"
            @on-click="handleMenuItem"
            @on-visible-change="handleMenuToggle"
        >
          <!-- 头像触发元素 -->
          <Avatar
              :src="avatarUrl"
              class="clickable-avatar"
              style="cursor: pointer;"
          />
          <template #list>
            <DropdownMenu>
              <DropdownItem  name="logout" divided>
                <Icon type="ios-log-out" /> 退出登录
              </DropdownItem>
            </DropdownMenu>
          </template>
          <!-- 下拉菜单内容 -->
        </Dropdown>
      </Space>
    </div>



    <div :class="this.theme==='dark' ? 'home-style-title' : 'home-style-title1'">
      校园兼职管理系统
    </div>
    <Menu style="padding-left: 200px" mode="horizontal" :theme="theme" active-name="1">

    </Menu>
    <div class="content-body-style">
<!--      管理员-->
      <Menu v-if="isManager" :theme="theme" active-name="1">
        <MenuItem @click="toUser" name="1">
          <Icon type="ios-paper" />
          用户管理
        </MenuItem>
        <MenuItem @click="toEnterpriseManage" name="2">
          <Icon type="ios-people" />
          企业管理
        </MenuItem>
        <MenuItem @click="toPositionManage" name="3">
          <Icon type="ios-people" />
          兼职信息管理
        </MenuItem>
        <MenuItem @click="toLvShareManage" name="4">
          <Icon type="ios-people" />
         评论信息管理
        </MenuItem>
        <MenuItem @click="toRoleManage" name="5">
          <Icon type="ios-people" />
          用户角色配置
        </MenuItem>
        <MenuItem @click="toManageMessage" name="6">
          <Icon type="ios-people" />
          系统操作日志
        </MenuItem>
        <MenuItem @click="toEditManage" name="7">
          <Icon type="ios-people" />
          系统设置
        </MenuItem>
      </Menu>
<!--      企业-->
      <Menu v-else :theme="theme" active-name="1">
        <MenuItem @click="toEnterprise" name="1">
          <Icon type="ios-paper" />
          企业信息
        </MenuItem>
        <MenuItem @click="toPosition" name="2">
          <Icon type="ios-people" />
          职位管理
        </MenuItem>
        <MenuItem @click="toEntry" name="3">
          <Icon type="ios-people" />
          入职申请
        </MenuItem>
      </Menu>
      <div class="content-body-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import {inject} from "vue";
import axios from "axios";

export default {
  name:'HomePage',
  data(){
    return{
      tokenFix:'',
      avatarUrl:'https://i.loli.net/2017/08/21/599a521472424.jpg',
      isManager:false,
      theme:'light',
      isMobile:true,
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.queryTheme();
    this.getUser();
  },
  methods:{
    getUser(){
      axios.get(this.$apiBaseUrl+'/api/user/getById?id='+sessionStorage.getItem("userId"),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          if(res.data.data.role === 'JOBSEEKERS'){
            this.$Modal.err({
              title: '错误！',
              content: '您没有登录权限！'
            });
          } else if(res.data.data.role.includes("COMPANY") && res.data.data.role.includes("ADMIN")){
            this.isManager = true;
            this.toUser();
          }else if(res.data.data.role.includes("ADMIN")){
            // this.$router.push({path:'/user',query:{isManager: true}})
            this.isManager = true;
            this.toUser();
          }else{
            // this.$router.push("/home");
            this.isManager = false;
            this.toEnterprise();
          }
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    handleMenuToggle(visible) {
      console.log('菜单状态:', visible ? '展开' : '收起')
    },
    handleMenuItem(name) {
      switch(name) {
        case 'logout':
          this.handleLogout()
          break
      }
    },
    // 退出登录示例
    handleLogout() {
      this.$Modal.confirm({
        title: '确认退出',
        content: '您确定要退出当前账号吗？',
        onOk: () => {
          // 执行退出逻辑
          this.$Message.success('已退出登录');
          //清空页面登录信息 返回登录页面
          this.$router.push("/");
        }
      })
    },
    toUser(){
      this.$router.push("/user");
    },
    toEnterprise(){
      this.$router.push('/enterprise');
    },
    toPosition(){
      this.$router.push('/position');
    },
    toEntry(){
      this.$router.push('/entry');
    },
    queryTheme(){
      axios.get(this.$apiBaseUrl+'/api/theme/getById?id=1',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.theme = res.data.data.theme;
        }
      })
    },
    toEnterpriseManage(){
      this.$router.push('/enterpriseManage');
    },
    toPositionManage(){
      this.$router.push('/positionManage');
    },
    toRoleManage(){
      this.$router.push('/roleManage');
    },
    toManageMessage(){
      this.$router.push('/manageMessage');
    },
    toEditManage(){
      this.$router.push('/editManage');
    },
    toLvShareManage(){
      this.$router.push('/lvShareManage');
    }
  }
}

</script>