<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <div style="display: flex;margin-right: 15px">
          <div style="width: 70px;align-content: center">启用状态</div>
          <Select v-model="roleState" style="width: 150px">
            <Option v-for="item in roleStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <Input v-model="searchName" placeholder="请输入角色名" style="width: 250px;margin-right: 15px" />
      </div>
      <Button style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="formRight.roleName"></Input>
        </FormItem>
        <FormItem label="是否启用">
          <Switch v-model="formRight.roleState" true-color="#13ce66" false-color="#ff4949" />
        </FormItem>
        <FormItem label="角色权限" prop="roleAuth">
          <Input v-model="formRight.roleAuth"></Input>
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
import {resolveComponent} from "vue";

export default {
  name:'PositionPage',
  data(){
    return{
      tableHeight:'200',
      modal2:false,
      loading:false,
      positionTitle:'',
      searchName:'',
      searchPhone:'',
      editId:'',
      roleState:'',
      roleStateList:[
        {
          value: '1',
          label: '启用'
        },
        {
          value: '2',
          label: '停用'
        }
      ],
      tableData: [
        {
          id:'123456',
          roleName: '管理员',
          roleState: true,
          createTime:'2025-05-12 11:12:25',
          roleAuth: '系统所有权限，用户修改删除，企业职位发布审核，企业管理'
        },{
          id:'123496',
          roleName: '企业',
          roleState: true,
          createTime:'2025-05-12 11:17:45',
          roleAuth: '企业设置，职位申请审核'
        },{
          id:'123486',
          roleName: '求职者',
          roleState: false,
          createTime:'2025-05-12 11:15:30',
          roleAuth: '浏览职位，简历编辑保存，申请职位'
        }
      ],
      formRight: {
        id:'',
        roleName: '',
        roleState: true,
        createTime:'',
        roleAuth: ''
      },
      columns: [
        {
          title: '角色名称',
          key: 'roleName',
          align: 'center',
        },
        {
          title: '角色状态',
          key: 'roleState',
          align: 'center',
          render: (h,params) => {  // 按钮操作
            return h('div', [
              h(resolveComponent('Switch'), {
                trueColor: "#13ce66",
                falseColor: "#ff4949",
                size: 'small',
                modelValue: params.row.roleState, // 绑定到行数据的 status 字段
                onClick: () => {
                  this.editRoleState(params.row.roleState,params.row.id);
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
          key: 'roleAuth',
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
        roleName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        roleAuth: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 140;
  },
  methods:{
    editRoleState(state,id){
      this.formRight.roleState = !state;
      this.formRight.id = id;
    },
    showModal(){
      this.positionTitle = '新建用户';
      this.modal2 = true;
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
            content: content
          });
          break;
      }
    },
    editRole(id,index){
      this.positionTitle = '编辑角色';
      this.modal2 = true;
      this.formRight.id = id;
      this.formRight.roleName = this.tableData[index].roleName;
      this.formRight.roleState = this.tableData[index].roleState;
      this.formRight.roleAuth = this.tableData[index].roleAuth;
      this.formRight.createTime = this.tableData[index].createTime;
    },
    cancel(name){
      this.modal2 = false;
      this.handleReset(name);

    },
    createUser(name){
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.loading = false;
            this.modal2 = false;
            this.$Message.success('操作成功!');
            this.formRight={
              id:'',
              roleName: '',
              roleState: true,
              createTime:'',
              roleAuth: ''
            }
          }, 2000);
        } else {
          this.loading = false;
        }
      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.formRight={
        id:'',
        roleName: '',
        roleState: true,
        createTime:'',
        roleAuth: ''
      }
    }
  }
}
</script>