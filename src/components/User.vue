<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入用户名" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPhone" placeholder="请输入手机号" style="width: 250px" />
      </div>
      <Button style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
            <Checkbox label="求职者"></Checkbox>
            <Checkbox label="企业"></Checkbox>
            <Checkbox label="管理员"></Checkbox>
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
  },
  methods:{
    showModal(){
      this.positionTitle = '新建用户';
      this.modal2 = true;
    },
    editUser(id){
      this.positionTitle = '编辑用户';
      this.modal2 = true;
      this.formRight.id = id;
      this.formRight.username = this.tableData[0].username;
      this.formRight.password = this.tableData[0].password;
      this.formRight.phone = this.tableData[0].phone;
      this.formRight.email = this.tableData[0].email;
      // this.formRight.role = this.tableData[0].role;
      var items = this.tableData[0].role.split(',');
      items.forEach(item=>{
        this.formRight.role.push(item);
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
            content: content
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
    createUser(name){
      // this.positionTitle = '新建用户';
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.loading = false;
            this.modal2 = false;
            this.$Message.success('操作成功!');
          }, 2000);
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