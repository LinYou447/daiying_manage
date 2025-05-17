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
        <FormItem label="职位名称" prop="name">
          <Input v-model="formRight.name"></Input>
        </FormItem>
        <FormItem label="职位ID" prop="positionCode">
          <Input v-model="formRight.positionCode"></Input>
        </FormItem>
        <FormItem label="工作地点" prop="workLocation">
          <City use-name v-model="formRight.workLocation" />
        </FormItem>
        <FormItem label="薪资" prop="money">
          <Input v-model="formRight.money"></Input>
        </FormItem>
        <FormItem label="招聘类型" prop="recruitmentType">
          <Input v-model="formRight.recruitmentType"></Input>
        </FormItem>
        <FormItem label="职位类型" prop="category">
          <Input v-model="formRight.category"></Input>
        </FormItem>
        <FormItem label="职位介绍" prop="jobDescription">
          <Input v-model="formRight.jobDescription" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="职位要求" prop="positionRequire">
          <Input v-model="formRight.jobRequirements" type="textarea" :autosize="{minRows: 3,maxRows: 7}"></Input>
        </FormItem>
        <FormItem label="紧急程度" prop="positionRequire">
          <Tag style="cursor: pointer" @click="this.formRight.degree = '不急'" color="success">不急</Tag>
          <Tag style="cursor: pointer" @click="this.formRight.degree = '紧急'" color="error">紧急</Tag>
          <Tag style="cursor: pointer" @click="this.formRight.degree = '一般'" color="warning">一般</Tag>
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
import {inject, resolveComponent} from "vue";
import axios from "axios";

export default {
  name:'PositionPage',
  data(){
    return{
      tableHeight:'200',
      modal2:false,
      loading:false,
      positionTitle:'',
      isEdit:false,
      companyId:'',
      tokenFix:'',
      tableData: [
        {
          name: '',
          positionCode: '',
          workLocation: '',
          jobDescription: '222222222222222222222222222222222222',
          jobRequirements: '3333333333333333333333332222222222222222222222222222222222222333333333333333',
          money: '',
          recruitmentType:'',
          degree:'',
        }
      ],
      formRight: {
        name: '',
        workLocation: '',
        money: '',
        jobDescription: '',
        jobRequirements: '',
        positionCode: '',
        degree:'',
        recruitmentType:''
      },
      columns: [
        {
          title: '职位名称',
          key: 'name',
          align: 'center',
        },
        {
          title: '职位ID',
          key: 'positionCode',
          align: 'center',
        },
        {
          title: '工作地点',
          key: 'workLocation',
          align: 'center',
        },
        {
          title: '薪资',
          key: 'money',
          align: 'center',
        },
        {
          title: '职位介绍',
          key: 'jobDescription',
          width: 180,
          align: 'center'
        },
        {
          title: '职位要求',
          key: 'jobRequirements',
          align: 'center',

        },
        {
          title: '审核状态',
          key: 'state',
          align: 'center',

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
          render: (h,params) => {
            if(params.row.state==="已发布"){
              return h('div', [
                h(resolveComponent('Button'), {
                  type: 'primary',
                  size: 'small',
                  style: {
                    marginRight: '5px'
                  },
                  disabled:true,
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
                    this.instance(params.row.id,3)
                  }
                }, {
                  default() {
                    return '删除'
                  }
                })
              ]);
            }else {
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
                    this.instance(params.row.id,3)
                  }
                }, {
                  default() {
                    return '删除'
                  }
                })
              ]);
            }// 按钮操作
          }
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '职位名称不能为空', trigger: 'blur' }
        ],
        positionCode: [
          { required: true, message: '职位id不能为空', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '职位类型不能为空', trigger: 'blur' }
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
    this.getCompany();
  },
  methods:{
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
            this.companyId = res.data.data.id;
            this.getAllPosition(res.data.data.id);
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
    getAllPosition(companyId){
      var search = {
        name: null,
        companyId:companyId
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
      this.isEdit = false;
      this.modal2 = true;
      this.positionTitle = '新增职位';
    },
    editPosition(index){
      this.positionTitle = '编辑职位';
      this.modal2 = true;
      this.isEdit = true;
      this.formRight = this.tableData[index];
      // this.tableData.forEach(item => {
      //   this.formRight.positionCode = item.positionCode;
      //   this.formRight.jobDescription = item.jobDescription;
      //   this.formRight.name = item.name;
      //   this.formRight.workLocation = item.workLocation;
      //   this.formRight.money = item.money;
      //   this.formRight.jobRequirements = item.jobRequirements;
      //   this.formRight.recruitmentType = item.recruitmentType;
      //   this.formRight.degree = item.degree;
      // })
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
    cancel(){
      this.modal2 = false;
      // this.handleReset(name);
    },
    create(){
      this.formRight.companyId = this.companyId;
      axios.post(this.$apiBaseUrl+'/api/position/createPosition',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
        }else{
          this.$Message.error(res.data.message);
        }
      })
    },
    update(){
      axios.post(this.$apiBaseUrl+'/api/position/updatePosition',this.formRight,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.$Message.success(res.data.message);
        }else{
          this.$Message.error(res.data.message);
        }
      })
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
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.isEdit){
            this.update();
          }else{
            this.create()
          }
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