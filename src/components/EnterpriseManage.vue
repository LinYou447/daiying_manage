<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入企业名称" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPhone" placeholder="请输入联系电话" style="width: 250px" />
      </div>
      <Button @click="getAllCompany" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
      <Button @click="showModal" type="primary" shape="circle" icon="md-add">新增企业</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="tableData"></Table>
    <Modal
        :title="positionTitle"
        v-model="modal2"
        :mask-closable="false"
        @on-cancel="cancel"
        :closable="false">
      <Form ref="formValidate" :model="formRight" :rules="ruleValidate" label-position="right" :label-width="100">
        <FormItem label="企业名称" prop="name">
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
        <FormItem label="关联用户">
          <Row :gutter="16">
            <Col span="6">
              <div><Button @click="selectUser" type="primary">选择用户</Button></div>
            </Col>
            <Col span="18">
              <div><Input disabled v-model="formRight.username" /></div>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <template #footer>
        <Button type="primary" :loading="loading" @click="createEnterprise('formValidate')">确定</Button>
        <Button @click="cancel('formValidate')">取消</Button>
      </template>
    </Modal>
    <Modal @on-cancel="cancelSelect" width="80%" v-model="modal3">
      <Table :mask-closable="false" @on-current-change="currentChange" highlight-row ref="currentRowTable" :columns="userColumns" :data="userData"></Table>
    </Modal>
  </div>
</template>

<script>
import {inject, resolveComponent} from "vue";
import {Button, Modal} from "view-ui-plus";
import axios from "axios";

export default {
  name:'EnterpriseManage',
  components: {Modal, Button},
  data(){
    return{
      tableHeight:'200',
      isEdit:false,
      modal2:false,
      modal3:false,
      loading:false,
      tokenFix:'',
      positionTitle:'',
      searchName:null,
      searchPhone:null,
      editId:'',
      selectData:true,
      tableData: [
        {
          id:'1234568',
          name: '喔喔喔科技有限公司',
          address: '北京市大兴区',
          phone: '15203507334',
          qualification:'企业资质',
          capital:0,
          legalPerson:'张三',
          role:'企业'
        }
      ],
      formRight: {
        id:'',
        name: '',
        address: '',
        phone: '',
        qualification:'',
        capital:0,
        legalPerson:'',
        username:null,
        userId:null
      },
      userColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '角色',
          key: 'role'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
      ],
      userData: [],
      columns: [
        {
          title: '企业名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '地址',
          key: 'address',
          align: 'center',
        },
        {
          title: '联系电话',
          key: 'phone',
          align: 'center',
        },
        {
          title: '企业资质',
          key: 'qualification',
          align: 'center',
        },
        {
          title: '注册资本',
          key: 'capital',
          width: 180,
          align: 'center'
        },
        {
          title: '法人',
          key: 'legalPerson',
          width: 180,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h,params) => {  // 按钮操作
            return h('div', [
              h(resolveComponent('Button'), {
                type: 'primary',
                size: 'small',
                style: {
                  marginRight: '5px'
                },
                onClick: () => {
                  this.editUser(params.row.id,params.index)
                }
              }, {
                default() {
                  return '编辑'
                }
              }),
              h(resolveComponent('Button'), {
                type: 'error',
                size: 'small',
                onClick: () => {
                  // this.deleteCompany(params.row.id)
                  this.instance(params.row.id,3)
                }
              }, {
                default() {
                  return '删除'
                }
              })
            ]);
          }
        }
      ],
      ruleValidate: {
        name: [
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
  mounted() {
    this.tableHeight = window.innerHeight - 140;
    this.tokenFix = inject("tokenFix");
    this.getAllCompany();
  },
  methods:{
    getAllCompany(){
      axios.post(this.$apiBaseUrl+'/api/company/getAllCompany',
          {
            name:this.searchName,
            phone:this.searchPhone
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.tableData = res.data.data;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    currentChange(currentRow, oldRow){
      console.log(currentRow.username);
      console.log(oldRow);
      this.formRight.username = currentRow.username;
      this.formRight.userId = currentRow.id;
    },
    cancelSelect(){
      this.formRight.username = null;
      this.formRight.userId = null;
    },
    showModal(){
      this.positionTitle = '新建企业';
      this.modal2 = true;
      this.isEdit = false;
    },
    selectUser(){
      axios.get(this.$apiBaseUrl+'/api/user/getAllByRole?role=JOBSEEKERS',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.userData = res.data.data;
          this.modal3 = true;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    editUser(id,index){
      this.isEdit = true;
      this.positionTitle = '编辑企业';
      this.modal2 = true;
      this.formRight.id = id;
      this.formRight.name = this.tableData[index].name;
      this.formRight.address = this.tableData[index].address;
      this.formRight.phone = this.tableData[index].phone;
      this.formRight.qualification = this.tableData[index].qualification;
      this.formRight.capital = this.tableData[index].capital;
      this.formRight.legalPerson = this.tableData[index].legalPerson;
      this.formRight.username = this.tableData[index].username;
      this.formRight.userId = this.tableData[index].userId;
    },
    instance (id,state) {
      const title = '删除';
      const content = '是否确认删除本条数据？';
      switch (state) {
        case 1:
          this.$Modal.success({
            title: title,
            content: content
          });
          break;
        case 2:
          this.$Modal.warning({
            title: title,
            content: '正在审核请耐心等待！'
          });
          break;
        case 3:
          this.$Modal.confirm({
            title: title,
            content: content,
            showClose:true,
            onOk:()=>{
              this.deleteCompany(id);
            }
          });
          break;
      }
    },
    editRole(){

    },
    cancel(name){
      this.modal2 = false;
      this.handleReset(name);
    },
    create(){
      axios.post(this.$apiBaseUrl+'/api/company/createCompany',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.loading = false;
          this.modal2 = false;
          this.$Message.success(res.data.message);
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
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
          this.modal2 = false;
          this.$Message.success(res.data.message);
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    createEnterprise(name){
      if(this.formRight.userId===null){
        this.$Message.error('请关联企业用户');
        return;
      }
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.update();
          }else{
            this.create()
          }
        } else {
          this.loading = false;
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    deleteCompany(companyId){
      axios.delete(this.$apiBaseUrl+'/api/company/deleteById?id='+companyId,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.getAllCompany();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    }
  }
}
</script>