<style scoped>
.bioBody{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  padding-bottom: 20px;
  background-color: whitesmoke;
  .bioBodyItem{
    width: 50%;
    height: 50%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 30px;
    position: relative;
  }
}
.buttonStyle{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 50px;
}
.ivu-upload{
  height: 150px;
}
</style>

<template>
  <div class="bioBody">
    <div class="bioBodyItem">
      <div v-if="!this.editValue" style="width: 100%;height: 40px">
        <Divider>注册账号</Divider>
      </div>
      <div v-else style="width: 100%;height: 40px">
        <Divider>修改账号信息</Divider>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="formValidate.username" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="请输入电话"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" type="password" password placeholder="请输入密码" />
        </FormItem>
        <FormItem>
          <div class="buttonStyle">
            <Button v-if="!this.editValue" style="width: 170px" type="primary" @click="handleSubmit('formValidate')">注 册</Button>
            <Button v-else style="width: 170px" type="primary" @click="handleSubmit('formValidate')">保 存</Button>
            <Button @click="login" style="margin-left: 8px;width: 170px">登 录</Button>
            <Button @click="back" style="margin-left: 8px;width: 170px">返回</Button>
          </div>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import {Input} from "view-ui-plus";
import axios from "axios";
import {inject} from "vue";

export default {
  name:'BiographicalNote',
  components: {Input},
  props:{
    // isEdit:{
    //   type:Boolean
    // }
  },
  data(){
    return{
      value1: '110000',
      editValue:false,
      tokenFix:'',
      formValidate: {
        username: '',
        password: '',
        phone: '',
        email: '',
      },
      ruleValidate: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    if(this.$route.query.isEdit){
      this.editValue = this.$route.query.isEdit;
      this.getUser();
    }else{
      this.editValue = false;
    }
  },
  methods:{
    returnHome(){
      this.$router.push("/home")
    },
    back(){
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push('/home');
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
          this.formValidate = res.data.data;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    editUser(){
      this.formValidate.id = sessionStorage.getItem("userId");
      axios.post(this.$apiBaseUrl+'/api/user/editUser',JSON.stringify(this.formValidate),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.$router.push("/login");
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    regedit(){
      this.formValidate.role = "COMPANY";
      axios.post(this.$apiBaseUrl+'/api/user/regedit',JSON.stringify(this.formValidate),
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }).then(res=>{
        if(res.data.code===500){
          this.$Message.error('注册失败!'+res.data.message);
        }else{
          this.$Message.success(res.data.message);
          this.$router.push("/");
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.editValue){
            this.editUser();
          }else{
            this.regedit();
          }
        }
      })
    },
    login () {
      this.$router.push("/login");
    }
  }
}
</script>