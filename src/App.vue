<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    window.vue = this;
  },
}
</script>

<style>
html,body,#app{
  height: 100%;
  width: 100%;
}
body {
  margin: 0;
  padding: 0;
  background-color: #F0F0F0;
}
.commom_font{
  font-size: 13px;
  color: rgb(75, 75, 75);
}
.collect_item_type{
  font-size: 12px;
  float: left;
  display: block;
}
</style>
