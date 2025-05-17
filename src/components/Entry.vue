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
        <Input v-model="positionName" placeholder="请输入职位名称" style="width: 250px;margin-right: 15px" />
        <Input v-model="phone" placeholder="请输入联系电话" style="width: 250px;margin-right: 15px" />
        <Input v-model="positionCode" placeholder="请输入职位ID" style="width: 250px" />
      </div>
      <Button @click="getData" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="data"></Table>
    <Modal
        title="职位申请审核"
        v-model="modal2"
        width="900"
        :mask-closable="false"
        @on-cancel="cancel('formValidate')"
        :closable="false">
      <div class="bioBody">
        <div class="bioBodyItem">
          <Form ref="formValidate" :model="formValidate" :label-width="80">
            <Row>
              <Col span="18">
                <FormItem label="姓名">
                  <Input disabled v-model="formValidate.name"></Input>
                </FormItem>
                <FormItem label="性别" >
                  <RadioGroup v-model="formValidate.sex">
                    <Radio disabled label="1">男</Radio>
                    <Radio disabled label="0">女</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="邮箱" disabled>
                  <Input disabled v-model="formValidate.email" ></Input>
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="4">
                <div style="width: 100%;height: 150px;border: solid 1px black">

                </div>
              </Col>
            </Row>
            <FormItem label="所在城市" prop="city">
              <City use-name disabled v-model="formValidate.city" />
            </FormItem>
            <FormItem label="籍贯">
              <Input disabled v-model="formValidate.nativePlace" ></Input>
            </FormItem>
            <FormItem label="电话">
              <Input disabled v-model="formValidate.phone" ></Input>
            </FormItem>
            <FormItem label="学历">
              <RadioGroup v-model="formValidate.edu">
                <Radio disabled label="zhuanke">专科</Radio>
                <Radio disabled label="benke">本科</Radio>
                <Radio disabled label="shuoshi">硕士</Radio>
                <Radio disabled label="boshi">博士</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="专业">
              <Input disabled v-model="formValidate.major"></Input>
            </FormItem>
            <FormItem label="教育背景">
              <Input disabled v-model="formValidate.eduBack" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="实习经历">
              <Input disabled v-model="formValidate.internshipExperience" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="证书技能">
              <Input disabled v-model="formValidate.certificateSkills" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="自我评价">
              <Input disabled v-model="formValidate.selfEvaluation" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <template #footer>
        <Button type="primary" :loading="loading" @click="access">通过</Button>
        <Button @click="unAccess">驳回</Button>
        <Button @click="cancel('formValidate')">取消</Button>
      </template>
    </Modal>

    <Modal
        :title="accessTitle"
        v-model="modal3"
        :mask-closable="false"
        :closable="false">
      <div>
        <Input v-model="this.accessDes" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
      </div>
      <template #footer>
        <Button type="primary" :loading="loading" @click="comment">确定</Button>
        <Button @click="cancelComment">取消</Button>
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
      searchName:'',
      searchPhone:'',
      searchPoId:'',
      pushState:'',
      modal3:false,
      loading:false,
      accessDes:'',
      accessTitle:'',
      reqId:'',
      req:{},
      phone:'',
      state:'',
      positionName:'',
      positionCode:'',
      pushStateList:[
        {
          value: '待审核',
          label: '待审核'
        },{
          value: '不通过',
          label: '不通过'
        },{
          value: '审核通过',
          label: '审核通过'
        },
      ],
      formValidate: {
        name: '',
        nativePlace: '',
        phone: '',
        edu: '',
        major: '',
        email: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        eduBack: '',
        internshipExperience: '',
        certificateSkills: '',
        selfEvaluation: '',
      },
      columns: [
        {
          title: '职位名称',
          key: 'positionName',
          align: 'center',
        },
        {
          title: '职位ID',
          key: 'positionCode',
          align: 'center',
        },
        {
          title: '审核状态',
          key: 'state',
          align: 'center',
        },
        {
          title: '申请人',
          key: 'bioName',
          align: 'center',
        },
        {
          title: '申请时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '电话号',
          key: 'bioPhone',
          width: 180,
          align: 'center'
        },
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
                  onClick: () => {
                    this.showModal(params.row.bioId,params.row.id);
                  }
                }, {
                  default() {
                    return '审核'
                  }
                })
              ]);
            }else{
              return h('div', [
                h(resolveComponent('Button'), {
                  type: 'primary',
                  size: 'small',
                  disabled:true,
                  onClick: () => {
                    this.showModal();
                  }
                }, {
                  default() {
                    return '审核'
                  }
                })
              ]);
            }
          }
        }
      ],
      data: [
        {
          title: 'Java开发工程师',
          positionId: 'ID45615',
          requestName: '北京',
          requestTime: '2025-05-07 11:20:53',
          phone: '15203507334',
          avatar: '10k',
          state:'审核通过'
        },
        {
          title: 'Java开发工程师',
          positionId: 'ID45615',
          requestName: '北京',
          requestTime: '2025-05-07 11:20:53',
          phone: '15203507334',
          avatar: '10k',
          state:'待审核'
        },
        {
          title: 'Java开发工程师',
          positionId: 'ID45615',
          requestName: '北京',
          requestTime: '2025-05-07 11:20:53',
          phone: '15203507334',
          avatar: '10k',
          state:'驳回'
        }
      ],
      tokenFix:'',
      companyInfo:{}
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.tableHeight = window.innerHeight - 140;
    this.getCompany();
  },
  methods:{
    getInfo(bioId){
      axios.get(this.$apiBaseUrl+'/api/biographical/getById?id='+bioId,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          // this.$Message.success(res.data.message);
          this.formValidate = res.data.data;
          this.biographicalId = res.data.data.id;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getCompany(){
      axios.get(this.$apiBaseUrl+'/api/company/getByUserId?userId='+sessionStorage.getItem("userId"),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          if(res.data.data!==null){
            this.companyInfo = res.data.data;
            this.getData();
          }else{
            this.$Message.error("请填写企业信息");
          }
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    getData(){
      var req = {
        companyId: this.companyInfo.id,
        state:this.state,
        positionName:this.positionName,
        phone:this.phone,
        positionCode:this.positionCode
      };
      axios.post(this.$apiBaseUrl+'/api/positionRequest/getAllPositionRequest',req,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.data = res.data.data;
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    access(){
      this.accessDes = '通过！';
      this.accessTitle = '通过评语';
      this.modal3 = true;
      this.req = {
        id:this.reqId,
        state:'审核通过',
        mes:this.accessDes
      }
    },
    unAccess(){
      this.accessDes = '不通过！';
      this.accessTitle = '驳回原因';
      this.modal3 = true;
      this.req = {
        id:this.reqId,
        state:'不通过',
        mes:this.accessDes
      }
    },
    comment(){
      this.loading = true;
      axios.post(this.$apiBaseUrl+'/api/positionRequest/updatePositionRequestRequest',this.req,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
          this.getData();
        }else{
          this.$Message.error(res.data.message);
        }
      })
      setTimeout(() => {
        this.modal2 = false;
        this.modal3 = false;
        this.loading = false;
        this.$Message['success']({
          background: true,
          content: '审核成功'
        });
      }, 2000);
    },
    cancelComment(){
      this.modal3 = false;
    },
    cancel(name){
      this.modal2 = false;
      this.handleReset(name);
    },
    showModal(bioId,reqId){
      this.modal2 = true;
      this.reqId = reqId;
      this.getInfo(bioId);
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>