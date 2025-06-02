<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 5px">
      <div style="display: flex;margin-right: 15px">
        <div style="width: 70px;align-content: center">审核状态</div>
        <Select v-model="state" style="width: 150px">
          <Option v-for="item in pushStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div style="display: flex;margin-right: 10px">
        <Input v-model="companyName" placeholder="请输入企业名称" style="width: 250px;margin-right: 15px" />
        <Input v-model="phone" placeholder="请输入联系电话" style="width: 250px;margin-right: 15px" />
        <Input v-model="positionCode" placeholder="请输入职位ID" style="width: 250px" />
      </div>
      <Button @click="getAllPosition" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
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
        <FormItem label="企业" >
          <Select :disabled="disInput" v-model="formRight.companyId">
            <Option v-for="item in enterpriseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="职位名称" prop="name">
          <Input :disabled="disInput" v-model="formRight.name"></Input>
        </FormItem>
        <FormItem label="职位ID" prop="positionCode">
          <Input :disabled="disInput" v-model="formRight.positionCode"></Input>
        </FormItem>
        <FormItem label="工作地点" prop="workLocation">
          <City use-name :disabled="disInput" v-model="formRight.workLocation" />
        </FormItem>
        <FormItem label="薪资" prop="money">
          <Input :disabled="disInput" v-model="formRight.money"></Input>
        </FormItem>
        <FormItem label="招聘类型" prop="recruitmentType">
          <Input :disabled="disInput" v-model="formRight.recruitmentType"></Input>
        </FormItem>
        <FormItem label="职位类型" prop="category">
          <Input :disabled="disInput" v-model="formRight.category"></Input>
        </FormItem>
        <FormItem label="职位介绍" prop="jobDescription">
          <Input :disabled="disInput" v-model="formRight.jobDescription" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="职位要求" prop="jobRequirements">
          <Input :disabled="disInput" v-model="formRight.jobRequirements" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="紧急程度" prop="positionRequire">
          <Tag style="cursor: pointer" @click="this.formRight.degree = '不急'" color="success">不急</Tag>
          <Tag style="cursor: pointer" @click="this.formRight.degree = '紧急'" color="error">紧急</Tag>
          <Tag style="cursor: pointer" @click="this.formRight.degree = '一般'" color="warning">一般</Tag>
        </FormItem>
      </Form>
      <template #footer>
        <Button v-if="formRight.state === '待审核' && !this.isCreat" type="primary" @click="access">通过</Button>
        <Button v-if="formRight.state === '待审核' && !this.isCreat" type="primary" @click="unAccess">驳回</Button>
<!--        <Button v-if="formRight.state !== '待审核' && !this.isCreat" type="primary" @click="closeModal2">确定</Button>-->
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
import {inject, resolveComponent} from "vue";
import axios from "axios";

export default {
  name:'PositionManage',
  data(){
    return{
      tokenFix:'',
      req:{},
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
      companyName:'',
      phone:'',
      state:'',
      positionCode:'',
      pushStateList:[
        {
          value: '待审核',
          label: '待审核'
        },{
          value: '审核通过',
          label: '审核通过'
        },{
          value: '不通过',
          label: '不通过'
        },
      ],
      enterpriseList: [],
      tableData: [],
      formRight: {
        id:'',
        enterpriseName:'',
        companyId:'1',
        name: '',
        workLocation: '',
        money: '',
        jobDescription: '',
        jobRequirements: '',
        positionCode: '',
        pushState:''
      },
      columns: [
        {
          title: '公司名称',
          key: 'cpmpanyname',
          width: 220,
          align: 'center',
        },
        {
          title: '职位名称',
          key: 'name',
          width: 220,
          align: 'center',
        },
        {
          title: '职位ID',
          key: 'positionCode',
          width: 120,
          align: 'center',
        },{
          title: '审核状态',
          key: 'state',
          width: 100,
          align: 'center',
        },
        {
          title: '工作地点',
          key: 'workLocation',
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
          key: 'jobDescription',
          align: 'center'
        },
        {
          title: '职位要求',
          key: 'jobRequirements',
          align: 'center',

        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h,params) => {  // 按钮操作
            if(params.row.state === '待审核'){
              return h('div', [
                h(resolveComponent('Button'), {
                  type: 'primary',
                  size: 'small',
                  style: {
                    marginRight: '5px'
                  },
                  onClick: () => {
                    this.editPosition(params.row.id,'职位发布审核')
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
                    this.instance(params.row.id,3)
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
                    this.editPosition(params.row.id,'职位信息')
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
        }
      ],
      ruleValidate: {
        title: [
          { required: true, message: '职位名称不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '企业名称不能为空', trigger: 'change' }
        ],
        positionCode: [
          { required: true, message: '职位id不能为空', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '薪资不能为空', trigger: 'blur' }
        ],
        jobDescription: [
          { required: true, message: '职位介绍不能为空（没有请填写无）', trigger: 'blur' }
        ],
        jobRequirements: [
          { required: true, message: '职位要求不能为空（没有请填写无）', trigger: 'blur' }
        ],
        workLocation: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.tableHeight = window.innerHeight - 140;
    this.getAllCompany();
    this.getAllPosition();
  },
  methods:{
    getAllCompany(){
      axios.post(this.$apiBaseUrl+'/api/company/getAllCompany',
          {
            name:null,
            phone:null
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          res.data.data.forEach(item=>{
            var it = {
              value:item.id,
              label:item.name
            }
            this.enterpriseList.push(it);
          })
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getAllPosition(){
      var search = {
        state: this.state,
        phone:this.phone,
        positionCode:this.positionCode,
        companyName:this.companyName
      }
      axios.post(this.$apiBaseUrl+'/api/position/getAllPosition',search,
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
      this.modal2 = true;
      this.positionTitle = '新增职位';
      this.isCreat = true;
      this.disInput = false;
    },
    getPosition(positionId){
      axios.get(this.$apiBaseUrl+'/api/position/getById?id='+positionId,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          if(res.data.data!==null){
            this.formRight = res.data.data;
          }else{
            this.$Modal.error({
              title: "错误",
              content: '请先创建企业'
            });
          }
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    editPosition(positionId,content){
      this.positionTitle = content;
      this.modal2 = true;
      this.disInput = true;
      // console.log(this.tableData[0]);
      this.getPosition(positionId);
    },
    comment(){
      this.pushLoading = true;
      axios.post(this.$apiBaseUrl+'/api/position/updatePosition',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.modal2 = false;
          this.modal3 = false;
          this.pushLoading = false;
          this.$Message.success(res.data.message);
          this.getAllPosition();
        }else{
          this.$Message.error(res.data.message);
        }
      })
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
            content: content,
            onOk:()=>{
              this.delete(id);
            }
          });
          break;
      }
    },
    cancel(name){
      this.modal2 = false;
      this.isCreat = false;
      this.handleReset(name);
    },
    access(){
      this.accessDes = '通过';
      this.modal3 = true;
      this.formRight.state = '审核通过';
      this.formRight.msg = this.accessDes;
    },
    unAccess(){
      this.accessDes = '不好看不通过';
      this.modal3 = true;
      this.formRight.state = '审核不通过';
      this.formRight.msg = this.accessDes;
    },
    closeModal2(){
      this.modal2 = false;
    },
    delete(id){
      axios.delete(this.$apiBaseUrl+'/api/position/deletePosition?id='+id,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.getAllPosition();
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    createPosition(name){
      this.positionTitle = '新增职位';
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios.post(this.$apiBaseUrl+'/api/position/createPosition',this.formRight,
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
              this.getAllPosition();
            }else{
              this.$Message.error(res.data.message);
            }
          })
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