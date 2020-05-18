<template>
  <div class="body">
    <svg-icon icon-class="return_last" @click="goBack" />
    <svg-icon icon-class="home" @click="goHome" />
    <svg-icon icon-class="tools_user" @click="clickUser" />
  </div>
</template>

<script>
export default {
  props: ["isLogin"],
  methods: {
    goBack() {
      this.$router.go(-1); //返回上一层
    },
    goHome() {
      this.$router.push("/"); //返回上一层
    },
    clickUser() {
      if(this.isLogin) {
        alert("登录");
      }else{
        alert("未登录")
      }
    }
  },
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  background-color: #f0f8ff;
}

.svg-icon {
  width: 1.5em !important;
  height: 1.5em !important;
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  cursor: pointer;
}
</style>