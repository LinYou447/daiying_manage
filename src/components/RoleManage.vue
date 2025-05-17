<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <div style="display: flex;margin-right: 15px">
          <div style="width: 70px;align-content: center">启用状态</div>
          <Select v-model="req.state" clearable style="width: 150px">
            <Option v-for="item in roleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <Input v-model="req.name" placeholder="请输入角色名" style="width: 250px;margin-right: 15px" />
      </div>
      <Button @click="getAll" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
      <Button @click="showModal" type="primary" shape="circle" icon="md-add">新增角色</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="tableData"></Table>
    <Modal
        :title="positionTitle"
        v-model="modal2"
        :mask-closable="false"
        @on-cancel="cancel"
        :closable="false">
      <Form ref="formValidate" :rules="ruleValidate" :model="formRight" label-position="right" :label-width="100">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formRight.name"></Input>
        </FormItem>
        <FormItem label="是否启用">
          <Switch v-model="formRight.state" true-color="#13ce66" false-color="#ff4949" />
        </FormItem>
        <FormItem label="角色权限" prop="des">
          <Input v-model="formRight.des"></Input>
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
      tokenFix:'',
      loading:false,
      positionTitle:'',
      isEdit:false,
      req:{
        name:'',
        state:'',
      },
      roleStateList:[
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        }
      ],
      tableData: [
        {
          id:'123456',
          name: '管理员',
          state: true,
          createTime:'2025-05-12 11:12:25',
          des: '系统所有权限，用户修改删除，企业职位发布审核，企业管理'
        },{
          id:'123496',
          name: '企业',
          state: true,
          createTime:'2025-05-12 11:17:45',
          des: '企业设置，职位申请审核'
        },{
          id:'123486',
          name: '求职者',
          state: false,
          createTime:'2025-05-12 11:15:30',
          des: '浏览职位，简历编辑保存，申请职位'
        }
      ],
      formRight: {
        id:'',
        name: '',
        state: true,
        createTime:'',
        des: ''
      },
      columns: [
        {
          title: '角色名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '角色状态',
          key: 'state',
          align: 'center',
          render: (h,params) => {  // 按钮操作
            return h('div', [
              h(resolveComponent('Switch'), {
                trueColor: "#13ce66",
                falseColor: "#ff4949",
                size: 'small',
                modelValue: params.row.state, // 绑定到行数据的 status 字段
                onClick: () => {
                  this.editRoleState(params.row.state,params.row.id);
                }
              })
            ]);
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '角色权限',
          key: 'des',
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
                  this.editRole(params.row.id,params.index)
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
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        des: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.tableHeight = window.innerHeight - 140;
    this.getAll();
  },
  methods:{
    editRoleState(state,id){
      this.formRight.state = !state;
      this.formRight.id = id;
    },
    showModal(){
      this.positionTitle = '新建用户';
      this.modal2 = true;
      this.isEdit = false;
    },
    instance (roleId,state) {
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
            onOk:()=>{
              this.delete(roleId);
            }
          });
          break;
      }
    },
    create(){
      axios.post(this.$apiBaseUrl+'/api/role/create', this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.loading = false;
          this.modal2 = false;
          this.handleReset();
          this.getAll();
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    update(){
      axios.post(this.$apiBaseUrl+'/api/role/update', this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.loading = false;
          this.modal2 = false;
          this.handleReset();
          this.getAll();
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    delete(roleId){
      axios.delete(this.$apiBaseUrl+'/api/role/delete?id='+roleId,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.getAll();
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getAll(){
      axios.post(this.$apiBaseUrl+'/api/role/getAll',this.req,
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
    editRole(id){
      this.positionTitle = '编辑角色';
      this.modal2 = true;
      this.isEdit = true;
      this.getById(id);
    },
    getById(id){
      axios.get(this.$apiBaseUrl+'/api/role/getById?id='+id,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.formRight = res.data.data;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    cancel(){
      this.modal2 = false;
      this.handleReset();

    },
    createUser(name){
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.update();
          }else{
            this.create();
          }
        } else {
          this.loading = false;
        }
      });
    },
    handleReset () {
      this.$refs['formValidate'].resetFields();
      this.formRight={
        id:'',
        name: '',
        state: true,
        createTime:'',
        des: ''
      }
    }
  }
}
</script>