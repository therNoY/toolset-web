<template>
  <div class="body">
    <el-input v-model="serchName" placeholder="要搜索的文件名字"></el-input>
    <el-button type="primary" @click="serch()">搜索</el-button>
    <div style="float:right">
      <el-input v-model="baiduUrl" placeholder="资源URL"></el-input>
      <a href="#" @click="getBDResouce()">百度云资源解析</a>
    </div>
    <!--展示搜索信息-->
    <div
      class="show-res"
      v-for="(source, index) in sourceList"
      :key="index"
      @click="goDownLoad(source.url, source.key)"
    >
      <span class="a-style">{{source.name}}</span>
    </div>
    <!--分页-->
    <div class="block">
      <el-pagination
        @size-change="handleCurrentChange"
        @current-change="handleCurrentChange"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="150"
      ></el-pagination>
    </div>

    <el-dialog title="输入验证码" v-if="sourceList.length > 0" :visible.sync="imgVisible" width="60%">
      <img :src="verificaImg" alt />
      <el-input v-model="verificaCode"></el-input>
      <el-button type="primary" @click="VerifyionCode">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSourceList,
  getRealUrl,
  getVerification,
  verifyion
} from "../common/api";
export default {
  data() {
    return {
      serchName: null,
      sourceList: [],
      imgVisible: false,
      baiduUrl: null,
      validator: {},
      verificaImg: null,
      verificaCode: null
    };
  },
  methods: {
    getBDResouce() {
      let theUrl = this.baiduUrl.replace("&", "??");
      let args2 = { url: theUrl };
      lgetVerification(args2).then(res2 => {
        if (res2.realDownloadURL != null && res2.response20 == null) {
          alert(res2.realDownloadURL);
          console.log(res2.realDownloadURL);
        } else if (res2.realDownloadURL == null && res2.response20 != null) {
          this.validator = res2;
          this.verificaImg = res2.response20.img;
          this.imgVisible = true;
        } else {
          console.warn("<······未控制的流程······>");
        }
      });
    },
    serch(num) {
      let serchName = this.serchName;
      if (num != undefined) {
        serchName = serchName + "_" + num;
      }
      getSourceList({ name: serchName }).then(res => {
        this.sourceList = res;
      });
    },

    goDownLoad(url, key) {
      // TODO 解析 key
      if (key != null) {
        alert("没有该文件");
        return;
      }
      let args = { url: url, key: key };
      getRealUrl(args).then(res => {
        if (res.key != null) {
          alert("没有该文件");
          return;
        }
        let theUrl = res.url.replace("&", "??");
        let args2 = { url: theUrl };
        console.log(args2);

        getVerification(args2).then(res2 => {
          if (res2.realDownloadURL != null && res2.response20 == null) {
            alert(res2.realDownloadURL);
            console.log(res2.realDownloadURL);
          } else if (res2.realDownloadURL == null && res2.response20 != null) {
            this.validator = res2;
            this.verificaImg = res2.response20.img;
            this.imgVisible = true;
          } else {
            console.warn("<······未控制的流程······>");
          }
        });
      });
    },

    VerifyionCode() {
      this.imgVisible = false;
      this.validator.postData.vcode_input = this.verificaCode;
      this.validator.postData.vcode_str = this.validator.response20.vcode;
      verifyion(this.validator).then(resp => {
        alert(resp);
        console.log(resp);
      });
    },

    handleCurrentChange(val) {
      this.serch(val);
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