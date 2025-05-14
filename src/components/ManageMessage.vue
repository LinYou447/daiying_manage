<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入用户名" style="width: 250px;margin-right: 15px" />
      </div>
      <Button style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
          roleName: '小不点',
          rolePhone: 15203507334,
          role:'管理员',
          createTime:'2025-05-12 11:12:25',
          editTime:'2025-05-12 11:12:25',
          editMessage: '修改用户表'
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
          title: '用户名称',
          key: 'roleName',
          align: 'center',
        },{
          title: '用户电话',
          key: 'rolePhone',
          align: 'center',
        },{
          title: '用户角色',
          key: 'role',
          align: 'center',
        },
        {
          title: '操作时间',
          key: 'editTime',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '操作记录',
          key: 'editMessage',
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