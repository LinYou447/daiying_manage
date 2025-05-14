<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 5px">
      <div style="display: flex;margin-right: 15px">
        <div style="width: 70px;align-content: center">审核状态</div>
        <Select v-model="pushState" style="width: 150px">
          <Option v-for="item in pushStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div style="display: flex;margin-right: 10px">
        <Input v-model="searchName" placeholder="请输入企业名称" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPhone" placeholder="请输入联系电话" style="width: 250px;margin-right: 15px" />
        <Input v-model="searchPoId" placeholder="请输入职位ID" style="width: 250px" />
      </div>
      <Button style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
        <FormItem label="企业" prop="enterpriseId">
          <Select :disabled="disInput" v-model="formRight.enterpriseId">
            <Option v-for="item in enterpriseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="职位名称" prop="title">
          <Input :disabled="disInput" v-model="formRight.title"></Input>
        </FormItem>
        <FormItem label="职位ID" prop="positionId">
          <Input :disabled="disInput" v-model="formRight.positionId"></Input>
        </FormItem>
        <FormItem label="工作地点" prop="city">
          <City :disabled="disInput" v-model="formRight.city" />
        </FormItem>
        <FormItem label="薪资" prop="money">
          <Input :disabled="disInput" v-model="formRight.money"></Input>
        </FormItem>
        <FormItem label="职位介绍" prop="positionDesc">
          <Input :disabled="disInput" v-model="formRight.positionDesc" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="职位要求" prop="positionRequest">
          <Input :disabled="disInput" v-model="formRight.positionRequest" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
      </Form>
      <template #footer>
        <Button v-if="formRight.pushState === '待审核' && !this.isCreat" type="primary" @click="access">通过</Button>
        <Button v-if="formRight.pushState === '待审核' && !this.isCreat" type="primary" @click="unAccess">驳回</Button>
        <Button v-if="formRight.pushState !== '待审核' && !this.isCreat" type="primary" @click="closeModal2">确定</Button>
        <Button v-if="this.isCreat" type="primary" :loading="loading" @click="createPosition('formValidate')">新增职位</Button>
        <Button @click="cancel('formValidate')">取消</Button>
      </template>
    </Modal>
    <Modal
        :title="accessTitle"
        v-model="modal3"
        :mask-closable="false"
        @on-cancel="cancel('formValidate')"
        :closable="false">
      <div>
        <Input v-model="this.accessDes" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
      </div>
      <template #footer>
        <Button type="primary" :loading="pushLoading" @click="comment">确定</Button>
        <Button @click="cancelComment">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import {resolveComponent} from "vue";

export default {
  name:'PositionManage',
  data(){
    return{
      pushState:'',
      tableHeight:'200',
      isCreat:false,
      modal2:false,
      modal3:false,
      loading:false,
      pushLoading:false,
      disInput:true,
      positionId:'',
      accessDes:'',
      positionTitle:'',
      accessTitle:'审核评价',
      searchName:'',
      searchPhone:'',
      searchPoId:'',
      pushStateList:[
        {
          value: '1',
          label: '待审核'
        },{
          value: '2',
          label: '驳回'
        },{
          value: '3',
          label: '已发布'
        },
      ],
      enterpriseList: [
        {
          value: '123456789',
          label: '喔喔喔科技有限公司'
        }
      ],
      tableData: [
        {
          id:'',
          enterpriseId:'123456789',
          enterpriseName:'喔喔喔科技有限公司',
          title: 'Java开发工程师',
          positionId: 'ID45615',
          city: '北京',
          positionDesc: '222222222222222222222222222222222222',
          positionRequest: '3333333333333333333333332222222222222222222222222222222222222333333333333333',
          money: '10k',
          pushState:'待审核'
        },{
          id:'',
          enterpriseId:'123456789',
          enterpriseName:'喔喔喔科技有限公司',
          title: 'Java开发工程师',
          positionId: 'ID45615',
          city: '北京',
          positionDesc: '222222222222222222222222222222222222',
          positionRequest: '3333333333333333333333332222222222222222222222222222222222222333333333333333',
          money: '10k',
          pushState:'已发布'
        },{
          id:'',
          enterpriseId:'123456789',
          enterpriseName:'喔喔喔科技有限公司',
          title: 'Java开发工程师',
          positionId: 'ID45615',
          city: '北京',
          positionDesc: '222222222222222222222222222222222222',
          positionRequest: '3333333333333333333333332222222222222222222222222222222222222333333333333333',
          money: '10k',
          pushState:'驳回'
        }
      ],
      formRight: {
        id:'',
        enterpriseName:'',
        enterpriseId:'',
        title: '',
        city: '',
        money: '',
        positionDesc: '',
        positionRequest: '',
        positionId: '',
        pushState:''
      },
      columns: [
        {
          title: '公司名称',
          key: 'enterpriseName',
          width: 220,
          align: 'center',
        },
        {
          title: '职位名称',
          key: 'title',
          width: 220,
          align: 'center',
        },
        {
          title: '职位ID',
          key: 'positionId',
          width: 120,
          align: 'center',
        },{
          title: '审核状态',
          key: 'pushState',
          width: 100,
          align: 'center',
        },
        {
          title: '工作地点',
          key: 'city',
          align: 'center',
          width: 100,
        },
        {
          title: '薪资',
          key: 'money',
          width: 85,
          align: 'center',
        },
        {
          title: '职位介绍',
          key: 'positionDesc',
          width: 220,
          align: 'center'
        },
        {
          title: '职位要求',
          key: 'positionRequest',
          width: 220,
          align: 'center',

        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h,params) => {  // 按钮操作
            if(params.row.pushState === '待审核'){
              return h('div', [
                h(resolveComponent('Button'), {
                  type: 'primary',
                  size: 'small',
                  style: {
                    marginRight: '5px'
                  },
                  onClick: () => {
                    this.editPosition(params.index,'职位发布审核')
                  }
                }, {
                  default() {
                    return '审核'
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
            }else{
              return h('div', [
                h(resolveComponent('Button'), {
                  size: 'small',
                  style: {
                    marginRight: '5px'
                  },
                  onClick: () => {
                    this.editPosition(params.index,'职位信息')
                  }
                }, {
                  default() {
                    return '查看'
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
        }
      ],
      ruleValidate: {
        title: [
          { required: true, message: '职位名称不能为空', trigger: 'blur' }
        ],
        enterpriseId: [
          { required: true, message: '企业名称不能为空', trigger: 'change' }
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
      this.positionTitle = '新增职位';
      this.isCreat = true;
      this.disInput = false;
    },
    editPosition(index,content){
      this.positionTitle = content;
      this.modal2 = true;
      this.disInput = true;
      // console.log(this.tableData[0]);
      this.formRight.positionId = this.tableData[index].positionId;
      this.formRight.positionDesc = this.tableData[index].positionDesc;
      this.formRight.title = this.tableData[index].title;
      this.formRight.money = this.tableData[index].money;
      this.formRight.positionRequest = this.tableData[index].positionRequest;
      this.formRight.enterpriseName = this.tableData[index].enterpriseName;
      this.formRight.enterpriseId = this.tableData[index].enterpriseId;
      this.formRight.pushState = this.tableData[index].pushState;
    },
    comment(){
      this.pushLoading = true;
      setTimeout(() => {
        this.modal2 = false;
        this.modal3 = false;
        this.pushLoading = false;
        this.$Message['success']({
          background: true,
          content: '审核成功'
        });
      }, 2000);
    },
    cancelComment(){
      this.modal3 = false;
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
    access(){
      this.accessDes = '通过';
      this.modal3 = true;
    },
    unAccess(){
      this.accessDes = '不好看不通过';
      this.modal3 = true;
    },
    closeModal2(){
      this.modal2 = false;
    },
    createPosition(name){
      this.positionTitle = '新增职位';
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.loading = false;
            this.modal2 = false;
            this.$Message.success('新增成功!');
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