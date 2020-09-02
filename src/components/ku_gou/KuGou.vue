<template>
  <div>
    <el-input v-model="serchName" placeholder="要搜索的歌曲的名字"></el-input>
    <el-button type="primary" @click="serch()">搜索</el-button>
    <el-button v-if="multipleSelection.length>0" type="primary" @click="addInfosToEs()">添加ES</el-button>
    <el-table :data="musicList" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fileName" label="歌名" width="180"></el-table-column>
      <el-table-column prop="singerName" label="歌手" width="180"></el-table-column>
      <el-table-column prop="albumName" label="专辑名称"></el-table-column>
      <el-table-column prop="duration" label="时长"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="play(scope.$index, scope.row)">播放</el-button>
          <el-button size="mini" @click="addInfoToEs(scope.$index, scope.row)">添加ES</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getKuGouList,
  getKuGouMusic,
  addInfoToEs,
  addInfosToEs
} from "../../common/api";

export default {
  data() {
    return {
      serchName: null,
      musicList: [],
      multipleSelection: []
    };
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val);
      
      this.multipleSelection = val;
    },
    serch() {
      let agrs = {};
      agrs.name = this.serchName;
      getKuGouList(agrs).then(resp => {
        this.musicList = resp.resVal;
      });
    },
    addInfoToEs(index, info) {
      console.log(index, info);

      let args = {};
      args.hash = info.fileHash;
      addInfoToEs(args).then(resp => {
        if (resp.respCode == 0) {
          this.$message.success("添加成功");
        }
      });
    },
    addInfosToEs() {
      let hashs = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const element = this.multipleSelection[i];
        hashs.push(element.fileHash)
      }
      console.log(hashs);
      addInfosToEs(hashs).then(resp => {
        if (resp.respCode == 0) {
          this.$message.success("添加成功");
        }
      });
    },
    play(index, info) {
      let hash = info.fileHash;
      let routeData = this.$router.resolve({
        name: "ShowHome",
        query: { hash: hash }
      });
      window.open(routeData.href, "_self");
      // window.open(routeData.href, "_blank");
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