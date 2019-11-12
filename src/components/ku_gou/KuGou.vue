<template>
  <div>
    <el-input v-model="serchName" placeholder="要搜索的歌曲的名字"></el-input>
    <el-button type="primary" @click="serch()">搜索</el-button>
    <el-table :data="musicList" style="width: 100%" @row-click="play">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fileName" label="歌名" width="180"></el-table-column>
      <el-table-column prop="singerName" label="歌手" width="180"></el-table-column>
      <el-table-column prop="albumName" label="专辑名称"></el-table-column>
      <el-table-column prop="duration" label="时长"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getKuGouList, getKuGouMusic } from "@/config/getData";

export default {
  data() {
    return {
      serchName: null,
      musicList: []
    };
  },
  methods: {
    async serch() {
      let agrs = {};
      agrs.name = this.serchName;
      let res = await getKuGouList(this, agrs);
      this.musicList = res.data;
    },
    play(row, column, event) {
      let hash = row.fileHash;
      let routeData = this.$router.resolve({
        name: "KuGouPlay",
        query: { hash: hash }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style lang="css" scoped>
.block {
  float: left;
  width: 100%;
}
.el-button {
  float: left;
  margin-left: 10px;
}
.el-input {
  width: 300px;
  float: left;
}
.show-res {
  width: 100%;
  float: left;
  margin-bottom: 10px;
}
</style>