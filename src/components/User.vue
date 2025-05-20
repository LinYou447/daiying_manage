<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入用户名" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPhone" placeholder="请输入手机号" style="width: 250px" />
      </div>
      <Button @click="getAllUser" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
      <Button @click="showModal" type="primary" shape="circle" icon="md-add">新增用户</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="tableData"></Table>
    <Modal
        :title="positionTitle"
        v-model="modal2"
        :mask-closable="false"
        @on-cancel="cancel"
        :closable="false">
      <Form ref="formValidate" :rules="ruleValidate" :model="formRight" label-position="right" :label-width="100">
        <FormItem label="用户名" prop="username">
          <Input v-model="formRight.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formRight.password"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="formRight.phone"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formRight.email"></Input>
        </FormItem>
        <FormItem label="角色">
          <CheckboxGroup v-model="formRight.role">
<!--            <Checkbox label="JOBSEEKERS"></Checkbox>-->
<!--            <Checkbox label="COMPANY"></Checkbox>-->
<!--            <Checkbox label="ADMIN"></Checkbox>-->
            <Checkbox v-for="(role,index) in roleList" :key="index" :label="role.name"></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <template #footer>
        <Button type="primary" :loading="loading" @click="createUser('formValidate')">确定</Button>
        <Button @click="cancel('formValidate')">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import {inject, resolveComponent} from "vue";
import axios from "axios";

export default {
  name:'PositionPage',
  data(){
    return{
      tableHeight:'200',
      modal2:false,
      loading:false,
      isEdit:false,
      tokenFix:'',
      positionTitle:'',
      searchName:'',
      searchPhone:'',
      editId:'',
      roleList:[],
      tableData: [
        {
          id:'1345664',
          username: '小不点',
          password: 'JiBuZhu?',
          avatar: '',
          phone: '15203507334',
          email: 'wojibuzhu447@163.com',
          createTime: '2025-05-09 12:20:23',
          role:'管理员'
        }
      ],
      formRight: {
        id:'',
        username: '',
        password:'',
        avatar:'',
        phone: '',
        email: '',
        createTime: '',
        role: []
      },
      columns: [
        // {
        //   title: "头像",
        //   key: "avatar",
        //   align: "center",
        //   width: 100,
        //   render:(h) => {
        //     return h('Img', {  // 也可用原生img标签代替
        //       style: {
        //         width: '30px',
        //         height: '30px',
        //         'border-radius': '50%'
        //       },
        //       attrs: {
        //         src:'https://i.loli.net/2017/08/21/599a521472424.jpg'
        //       }
        //     })
        //   }
        // },

        {
          title: '用户名称',
          key: 'username',
          align: 'center',
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '角色',
          key: 'role',
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
                  this.editUser(params.row.id)
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
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '职位介绍不能为空（没有请填写无）', trigger: 'blur' }
        ],
        positionRequest: [
          { required: true, message: '职位要求不能为空（没有请填写无）', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 140;
    this.tokenFix = inject("tokenFix");
    this.getAllRole();
    this.getAllUser();
  },
  methods:{
    getAllRole(){
      var req={
        state:1
      }
      axios.post(this.$apiBaseUrl+'/api/role/getAll',req,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          console.log(res.data.data)
          this.roleList = res.data.data;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getAllUser(){
      axios.post(this.$apiBaseUrl+'/api/user/getAll',
          {
            username:this.searchName,
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
    showModal(){
      this.positionTitle = '新建用户';
      this.modal2 = true;
      this.isEdit = false;
    },
    editUser(id){
      this.isEdit = true;
      this.positionTitle = '编辑用户';
      this.modal2 = true;
      this.getUserById(id);
    },
    getUserById(id){
      axios.get(this.$apiBaseUrl+'/api/user/getById?id='+id,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.formRight=res.data.data;
          var items = this.formRight.role.split(',');
          this.formRight.role=[];
          items.forEach(item=>{
            this.formRight.role.push(item);
          })
        }else{
          this.$Message.error(res.data.message);
        }
      })
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
              this.delete(id);
            }
          });
          break;
      }
    },
    cancel(name){
      this.modal2 = false;
      this.handleReset(name);
    },
    create(){
      var roleStr = '';
      this.formRight.role.forEach((item,index)=>{
        roleStr = roleStr + item;
        if(index !== this.formRight.role.length-1 ){
          roleStr = roleStr + ',';
        }
      })
      this.formRight.role = roleStr;
      axios.post(this.$apiBaseUrl+'/api/user/regedit',this.formRight,
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
          this.getAllUser();
          // window.location.reload();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    getUserCompany(){
      axios.get(this.$apiBaseUrl+'/api/user/getUserCompany?userId='+this.formRight.id,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200 && res.data.data == '1'){
          this.updateUser();
        }else if(res.data.code===200 && res.data.data == '2'){
          this.$Modal.confirm({
            title: '提示',
            content: '修改用户企业权限会断开企业与用户之间的联系，是否继续？',
            onOk:()=>{
              this.updateUser();
            }
          });
        }else{
          this.$Message.error('系统错误！请稍后再试');
        }
      })
    },
    update(){
      var flash = false;
      this.formRight.role.forEach(item=>{
        if(item=='COMPANY'){
          flash = true;
        }
      })
      if(!flash){
        this.getUserCompany();
      }else{
        this.updateUser();
      }
    },
    updateUser(){
      var roleStr = '';
      this.formRight.role.forEach((item,index)=>{
        roleStr = roleStr + item;
        if(index !== this.formRight.role.length-1 ){
          roleStr = roleStr + ',';
        }
      })
      this.formRight.role = roleStr;
      axios.post(this.$apiBaseUrl+'/api/user/editUser',this.formRight,
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
          this.getAllUser();
          // window.location.reload();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    delete(userId){
      axios.delete(this.$apiBaseUrl+'/api/user/deleteById?id='+userId,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.getAllUser();
        }else{
          this.loading = false;
          this.$Message.error(res.data.message);
        }
      })
    },
    createUser(name){
      // this.positionTitle = '新建用户';
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.update(name);
          }else{
            this.create(name);
          }
        } else {
          this.loading = false;
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>