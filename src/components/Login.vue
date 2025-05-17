<style scoped>
.loginBody{
  width: 100%;
  height: 100%;
  background-image: url("../../image/LoginBackground.png");
  align-items: center;
  align-content: center;
}
.demo-login{
  width: 400px;
  margin: 0 auto !important;
}
.demo-auto-login{
  margin-bottom: 24px;
  text-align: left;
}
.demo-auto-login a{
  float: right;
}
.regeditStyle{
  height: 100%;
  width: 100%;
  color: #2d8cf0;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
}
</style>

<template>
  <div class="loginBody">
    <div class="demo-login">
      <Login @on-submit="handleSubmit">
        <UserName style="margin-bottom: 15px" name="username" />
        <Password name="password" />
        <div class="demo-auto-login">
          <!--          <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>-->
          <div class="regeditStyle">
            <div @click="regedit" style="margin-right: 20px;cursor: pointer">注册</div>
            <div style="cursor: pointer">忘记密码</div>
          </div>
        </div>
        <Submit  />
      </Login>
    </div>
  </div>
</template>

<script>
// import {Button} from "view-ui-plus";
// eslint-disable-next-line vue/no-export-in-script-setup
import axios from "axios";
import {inject} from "vue";

export default {
  name: 'LoginPage',
  props: {
    msg: String
  },
  data () {
    return {
      autoLogin: true
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
  },
  methods: {
    handleSubmit (valid, { username, password }) {
      if (valid) {
        // this.$Modal.info({
        //   title: '输入的内容如下：',
        //   content: 'username: ' + username + ' | password: ' + password
        // });
        var formData = {
          username: username,
          password: password
        }
        axios.post(this.$apiBaseUrl+'/api/user/login',JSON.stringify(formData),
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }).then(res=>{
          if(res.data.code===200){
            sessionStorage.setItem('token', res.data.data.token);
            sessionStorage.setItem('userId', res.data.data.userId);
            sessionStorage.setItem('userName', res.data.data.userName);
            this.getUser();
            // this.$router.push("/home")
          }else{
            this.$Message.error(res.data.message);
          }
        })
      }
    },
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
            this.$Modal.error({
              title: '错误！',
              content: '您没有登录权限！'
            });
          } else if(res.data.data.role.includes("COMPANY") && res.data.data.role.includes("ADMIN")){
            this.$Modal.confirm({
              title: '提示',
              content: '您是否要作为管理员登录？',
              showClose:true,
              onOk:()=>{
                this.$router.push({path:'/user',query:{isManager: true}})
              },
              onCancel:()=>{
                this.$router.push("/home");
              }
            });
            // this.isManager = true;
          }else if(res.data.data.role.includes("ADMIN")){
            this.$router.push({path:'/user',query:{isManager: true}})
            // this.isManager = true;
          }else{
            this.$router.push("/home");
            // this.isManager = false;
          }
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    regedit(){
      this.$router.push("/regedit")
    }
  }
}
</script>