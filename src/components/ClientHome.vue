<template>
  <div class="body">
    <div class="block">
      <img src="../assets/image/mysql-logo.jpg" />
      <div>mysql</div>
    </div>

    <div class="block">
      <img src="../assets/image/oracle-logo.jpg" />
      <div>oracel</div>
    </div>

    <div class="block">
      <img src="../assets/image/mongo-logo.jpg" />
      <div>mongo</div>
    </div>

    <div class="block" @click="router('zookeeper')">
      <img src="../assets/image/zk-logo.jpg" />
      <div>zookeeper</div>
    </div>

    <div class="block">
      <img src="../assets/image/redis-logo.jpg" />
      <div>redis</div>
    </div>

    
  </div>
</template>

<script>
export default {
  methods: {
    router(path) {
      this.$router.push("/client/" + path);
    }
  }
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  height: 100%;
}
.block {
  width: 20%;
  height: 25%;
  position: relative;
  float: left;
  margin-left: 40px;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.192);
}
.block :hover {
  cursor: pointer;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.527), 0 0 12px rgba(0, 0, 0, 0.308);
}
.block img {
  width: 100%;
  height: 100%;
}
.block div {
  width: 100%;
  height: 20%;
  background-color: rgba(0, 114, 214, 0.39);
  float: left;
  position: absolute;
  bottom: 10%;
  font-size: 14px;
  text-align: center;
}
.block :hover div {
  background-color: rgba(0, 114, 214, 0.897);
  float: left;
  position: absolute;

  bottom: 10%;
  font-size: 14px;
}
</style>