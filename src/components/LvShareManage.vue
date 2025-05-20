<style scoped>

</style>

<template>
  <div>
    <div style="display: flex;justify-content: flex-end;margin-bottom: 15px">
      <div style="display: flex;margin-right: 10px">
        <Input v-model="req.username" placeholder="请输入用户名" style="width: 250px;margin-right: 15px" />
      </div>
      <Button @click="getAllByUserName" style="margin-right: 10px" type="primary" shape="circle" icon="ios-search">查   询</Button>
    </div>
    <Table :height="tableHeight" stripe :columns="columns" :data="tableData"></Table>
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
      req:{
        username:'',
        phone:'',
      },
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
      tableData: [],
      columns: [
        {
          title: '用户名称',
          key: 'username',
          align: 'center',
        },{
          title: '标题',
          key: 'title',
          align: 'center',
        },{
          title: '内容',
          key: 'context',
          align: 'center',
        },
        {
          title: '发布时间',
          key: 'createTime',
          align: 'center',
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
    this.tokenFix = inject("tokenFix");
    this.getAll();
  },
  methods:{
    getAll(){
      axios.get(this.$apiBaseUrl+'/api/lvShare/getAll',
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
    delete(id){
      axios.delete(this.$apiBaseUrl+'/api/lvShare/delete?id='+id,
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
    getAllByUserName(){
      axios.get(this.$apiBaseUrl+'/api/lvShare/getAllByUsername?username='+this.req.username,
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
    }
  }
}
</script>