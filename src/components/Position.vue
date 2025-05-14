<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 5px">
      <Button @click="showModal" type="primary" shape="circle" icon="md-add">新增职位</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="tableData"></Table>
    <Modal
        :title="positionTitle"
        v-model="modal2"
        :mask-closable="false"
        @on-cancel="cancel"
        :closable="false">
      <Form ref="formValidate" :rules="ruleValidate" :model="formRight" label-position="right" :label-width="100">
        <FormItem label="职位名称" prop="title">
          <Input v-model="formRight.title"></Input>
        </FormItem>
        <FormItem label="职位ID" prop="positionId">
          <Input v-model="formRight.positionId"></Input>
        </FormItem>
        <FormItem label="工作地点" prop="city">
          <City v-model="formRight.city" />
        </FormItem>
        <FormItem label="薪资" prop="money">
          <Input v-model="formRight.money"></Input>
        </FormItem>
        <FormItem label="职位介绍" prop="positionDesc">
          <Input v-model="formRight.positionDesc" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="职位要求" prop="positionRequire">
          <Input v-model="formRight.positionRequest" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
      </Form>
      <template #footer>
        <Button type="primary" :loading="loading" @click="createPosition('formValidate')">提交发布</Button>
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
      tableData: [
        {
          title: 'Java开发工程师',
          positionId: 'ID45615',
          city: '北京',
          positionDesc: '222222222222222222222222222222222222',
          positionRequest: '3333333333333333333333332222222222222222222222222222222222222333333333333333',
          money: '10k'
        }
      ],
      formRight: {
        title: '',
        city: '',
        money: '',
        positionDesc: '',
        positionRequest: '',
        positionId: ''
      },
      columns: [
        {
          title: '职位名称',
          key: 'title',
          align: 'center',
        },
        {
          title: '职位ID',
          key: 'positionId',
          align: 'center',
        },
        {
          title: '工作地点',
          key: 'city',
          align: 'center',
        },
        {
          title: '薪资',
          key: 'money',
          align: 'center',
        },
        {
          title: '职位介绍',
          key: 'positionDesc',
          width: 180,
          align: 'center'
        },
        {
          title: '职位要求',
          key: 'positionRequest',
          align: 'center',

        },
        {
          title: "头像",
          key: "avatar",
          align: "center",
          width: 100,
          render:(h) => {
            return h('Img', {  // 也可用原生img标签代替
              style: {
                width: '30px',
                height: '30px',
                'border-radius': '50%'
              },
              attrs: {
                src:'https://i.loli.net/2017/08/21/599a521472424.jpg'
              }
            })
          }
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
                  this.editPosition(params.index)
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
                  this.instance(params.index,3)
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
        title: [
          { required: true, message: '职位名称不能为空', trigger: 'blur' }
        ],
        positionId: [
          { required: true, message: '职位id不能为空', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '薪资不能为空', trigger: 'blur' }
        ],
        positionDesc: [
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
      this.modal2 = true;
    },
    editPosition(){
      this.positionTitle = '编辑职位';
      this.modal2 = true;
      // console.log(this.tableData[0]);
      this.tableData.forEach(item => {
        this.formRight.positionId = item.positionId;
        this.formRight.positionDesc = item.positionDesc;
        this.formRight.title = item.title;
        // this.formRight.city = item.city;
        this.formRight.money = item.money;
        this.formRight.positionRequest = item.positionRequest;
        // console.log(item.positionRequest);
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
    cancel(name){
      this.modal2 = false;
      this.handleReset(name);
    },
    createPosition(name){
      this.positionTitle = '新增职位';
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