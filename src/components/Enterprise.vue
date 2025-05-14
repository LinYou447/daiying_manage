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
    <div class="enterprise-box">
      <Tooltip @click="editEnterprise" style="position: absolute;right: 0;top: 0;cursor: pointer" size="25" content="编辑" placement="right">
        <Icon size="25" type="ios-create" />
      </Tooltip>
      <div class="enterprise-box-left font_size">
        <div>企业名称：</div>
        <div style="margin-top: 10px;margin-bottom: 10px">企业地址：</div>
        <div>联系电话：</div>
      </div>
      <div class="enterprise-box-right font_size">
        <div>喔喔喔科技有限公司</div>
        <div style="margin-top: 10px;margin-bottom: 10px">北京市亦庄开发区1号科技园区12栋</div>
        <div>15200000000</div>
      </div>
    </div>
    <Modal
        v-model="modal"
        title="编辑企业信息"
        :loading="loading">
      <div>
        <Form ref="formValidate" :model="formRight" :rules="ruleValidate" label-position="right" :label-width="100">
          <FormItem label="公司名称" prop="enterpriseName">
            <Input v-model="formRight.enterpriseName"></Input>
          </FormItem>
          <FormItem label="公司地址" prop="address">
            <Input v-model="formRight.adress" maxlength="100" show-word-limit type="textarea" />
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input v-model="formRight.phone"></Input>
          </FormItem>
          <FormItem label="企业资质">
            <Input v-model="formRight.qualifications"></Input>
          </FormItem>
          <FormItem label="注册资本">
            <Input v-model="formRight.registeredCapital" prefix="logo-yen"  />
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
export default {
  name:'EnterprisePage',
  data(){
    return{
      modal:false,
      loading: false,
      formRight: {
        enterpriseName: '',
        adress: '',
        phone: '',
        qualifications:'',
        registeredCapital:0,
        legalPerson:''
      },
      ruleValidate: {
        enterpriseName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        adress: [
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
  methods:{
    editEnterprise(){
      this.modal = true;
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
          setTimeout(() => {
            this.modal = false;
            this.loading = false;
          }, 2000);
          this.$Message.success('修改成功!');
        } else {
          this.loading = false;
        }
      })
    }
  }
}

</script>