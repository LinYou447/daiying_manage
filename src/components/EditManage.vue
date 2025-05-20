<style scoped>

</style>

<template>
  <div style="display: flex;align-content: center">
    <div style="font-size: 16px;margin-right: 10px">系统主题：</div>
    <RadioGroup v-model="border">
      <Radio @click="changeTheme('light')" label="light" border></Radio>
      <Radio @click="changeTheme('dark')" label="dark" border></Radio>
    </RadioGroup>
  </div>
</template>

<script>
import axios from "axios";
import {inject} from "vue";

export default {
  name:'EditManage',
  data(){
    return{
      tokenFix:'',
      border: 'dark'
    }
  },
  mounted() {
    this.tokenFix = inject("tokenFix");
    this.getTheme();
  },
  methods:{
    getTheme(){
      axios.get(this.$apiBaseUrl+'/api/theme/getById?id=1',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          this.border = res.data.data.theme;
        }
      })
    },
    changeTheme(theme){
      var req = {
        id:1,
        theme:theme
      }
      axios.post(this.$apiBaseUrl+'/api/theme/update',req,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.tokenFix + `${sessionStorage.getItem('token')}`
            }
          }).then(res=>{
        if(res.data.code===200){
          // this.theme = res.data.data.theme;
          this.$router.go(0);
        }
      })
    }
  }
}

</script>