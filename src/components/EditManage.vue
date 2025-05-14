<style scoped>

</style>

<template>
  <div style="display: flex;align-content: center">
    <div style="font-size: 16px;margin-right: 10px">系统主题：</div>
    <RadioGroup v-model="border">
      <Radio @click="changeTheme" label="亮色" border></Radio>
      <Radio @click="changeTheme" label="暗色" border></Radio>
    </RadioGroup>
  </div>
</template>

<script>
export default {
  name:'EditManage',
  data(){
    return{
      border: '暗色'
    }
  },
  methods:{
    changeTheme(){
      //添加入数据库
    }
  }
}

</script>