<style scoped>
.enterprise-style{
  width: 100%;
  height: 100%;
  //background: coral;
}
.font_size{
  font-size: 16px;
}
.enterprise-box{
  height: 160px;
  width: 350px;
  background: #d8dde5;
  border-radius: 5px;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
  position: relative;
}
.enterprise-box-left{
  width: 88px;
  height: 100%;
}
.enterprise-box-right{
  //padding-left: 20px;
  height: 100%;
  overflow: hidden;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis;
  color: black;
}
</style>

<template>
  <div class="enterprise-style">
    <div v-if="!noCompany" class="enterprise-box">
      <Tooltip @click="editEnterprise" style="position: absolute;right: 0;top: 0;cursor: pointer" size="25" content="编辑" placement="right">
        <Icon size="25" type="ios-create" />
      </Tooltip>
      <div class="enterprise-box-left font_size">
        <div>企业名称：</div>
        <div style="margin-top: 10px;margin-bottom: 10px">企业地址：</div>
        <div>联系电话：</div>
      </div>
      <div class="enterprise-box-right font_size">
        <div>{{this.formRight.name}}</div>
        <div style="margin-top: 10px;margin-bottom: 10px">{{this.formRight.address}}</div>
        <div>{{this.formRight.phone}}</div>
      </div>
    </div>
    <div v-else style="display: flex;align-content: center;justify-content: center" class="enterprise-box">
      <Icon @click="createCompany" style="cursor: pointer" size="100" type="md-add" />
    </div>
    <Modal
        v-model="modal"
        :title="companyTitle"
        :loading="loading">
      <div>
        <Form ref="formValidate" :model="formRight" :rules="ruleValidate" label-position="right" :label-width="100">
          <FormItem label="公司名称" prop="name">
            <Input v-model="formRight.name"></Input>
          </FormItem>
          <FormItem label="公司地址" prop="address">
            <Input v-model="formRight.address" maxlength="100" show-word-limit type="textarea" />
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input v-model="formRight.phone"></Input>
          </FormItem>
          <FormItem label="企业资质">
            <Input v-model="formRight.qualification"></Input>
          </FormItem>
          <FormItem label="注册资本">
            <Input v-model="formRight.capital" prefix="logo-yen"  />
          </FormItem>
          <FormItem label="法人" prop="legalPerson">
            <Input v-model="formRight.legalPerson"></Input>
          </FormItem>
        </Form>
      </div>
      <template #footer>
        <Button type="primary" :loading="loading" @click="asyncOK('formValidate')">确定</Button>
        <Button @click="cancel('formValidate')">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import {inject} from "vue";
import axios from "axios";

export default {
  name:'EnterprisePage',
  data(){
    return{
      modal:false,
      tokenFix:'',
      isEdit:false,
      companyTitle:'',
      noCompany:false,
      loading: false,
      formRight: {
        name: '',
        address: '',
        phone: '',
        qualification:'',
        capital:0,
        legalPerson:''
      },
      ruleValidate: {
        name: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '企业地址不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '企业法人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.getCompany();
  },
  methods:{
    getCompany(){
      axios.get(this.$apiBaseUrl+'/api/company/getByUserId?userId='+sessionStorage.getItem("userId"),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          if(res.data.data!==null){
            this.formRight = res.data.data;
          }else{
            this.noCompany = true;
          }
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    createCompany(){
      this.modal = true;
      this.companyTitle = '创建企业';
      this.isEdit = false;
    },
    create(){
      this.formRight.userId = sessionStorage.getItem("userId");
      axios.post(this.$apiBaseUrl+'/api/company/createCompany',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.loading = false;
          this.modal = false;
          this.$Message.success(res.data.message);
          this.getCompany();
          // window.location.reload();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    editEnterprise(){
      this.modal = true;
      this.companyTitle = '编辑企业信息';
      this.isEdit = true;
    },
    update(){
      axios.post(this.$apiBaseUrl+'/api/company/updateCompany',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.loading = false;
          this.modal = false;
          this.$Message.success(res.data.message);
          this.getCompany();
          // window.location.reload();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    cancel(name){
      this.modal = false;
      this.handleReset(name);
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    asyncOK (name) {
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.update();
          }else {
            this.create();
          }
        } else {
          this.loading = false;
        }
      })
    }
  }
}

</script>