<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入企业名称" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPhone" placeholder="请输入联系电话" style="width: 250px" />
      </div>
      <Button style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
        <FormItem label="企业名称" prop="enterpriseName">
          <Input v-model="formRight.enterpriseName"></Input>
        </FormItem>
        <FormItem label="公司地址" prop="address">
          <Input v-model="formRight.address" maxlength="100" show-word-limit type="textarea" />
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
  name:'EnterpriseManage',
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
          id:'1234568',
          enterpriseName: '喔喔喔科技有限公司',
          address: '北京市大兴区',
          phone: '15203507334',
          qualifications:'企业资质',
          registeredCapital:0,
          legalPerson:'张三',
          role:'企业'
        }
      ],
      formRight: {
        id:'',
        enterpriseName: '',
        address: '',
        phone: '',
        qualifications:'',
        registeredCapital:0,
        legalPerson:'',
        role:[]
      },
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
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
          key: 'qualifications',
          align: 'center',
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
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
  mounted() {
    this.tableHeight = window.innerHeight - 140;
  },
  methods:{
    showModal(){
      this.positionTitle = '新建企业';
      this.modal2 = true;
    },
    editUser(id,index){
      this.positionTitle = '编辑企业';
      this.modal2 = true;
      this.formRight.id = id;
      this.formRight.enterpriseName = this.tableData[index].enterpriseName;
      this.formRight.address = this.tableData[index].address;
      this.formRight.phone = this.tableData[index].phone;
      this.formRight.qualifications = this.tableData[index].qualifications;
      this.formRight.registeredCapital = this.tableData[index].registeredCapital;
      this.formRight.legalPerson = this.tableData[index].legalPerson;
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
            content: content,
            showClose:true,
            onOk(){

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
    createUser(name){
      this.positionTitle = '新建用户';
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.loading = false;
            this.modal2 = false;
          }, 2000);
          this.$Message.success('提交成功!');
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