<template>
  <div class="html-style">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  height: 100%;
}
.html-style{
  width: 100%;
  height: 100%;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
