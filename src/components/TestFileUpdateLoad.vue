<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <div style="wi">
      <uploader
        ref="uploader"
        :options="options"
        :autoStart="false"
        @file-added="onFileAdded"
        @file-complete="onfileComplete"
        @file-success="onFileSuccess"
        @file-progress="onFileProgress"
        @file-error="onFileError"
        class="uploader-app"
      >
        <uploader-btn id="global-uploader-btn" :directory="true" ref="uploadBtn">选择上传录音</uploader-btn>
        <uploader-list v-show="panelShow"></uploader-list>
        <!-- <uploader-files></uploader-files> -->
      </uploader>
      <el-button @click="collapse = ! collapse" size="mini" type="primary">{{collapse ? '展开':'折叠' }}</el-button>
    </div>

    <div v-show="collapse">
      <div style="width:100%"  v-for="(upFile,index) in uploadFileList" :key="index">
        <div class="updateFile" v-if="upFile.show">
          <div class="updateFileFont">{{upFile.name}}</div>
          <el-progress
            v-if="getFileUpStatus(upFile) == null"
            class="updateFileProgress"
            :percentage="Math.round((upFile._prevUploadedSize/upFile.size)*100)"
          ></el-progress>
          <el-progress
            v-else
            class="updateFileProgress"
            :percentage="Math.round((upFile._prevUploadedSize/upFile.size)*100)"
            :status="getFileUpStatus(upFile)"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mergeFileRequest } from "../common/api";
import uuidv1 from 'uuid/v1' 

export default {
  data() {
    return {
      // 参数
      options: {
        target: "http://localhost:8099/upload/chunk", // 目标上传 URL
        chunkSize: 1024 * 1024 * 2, //分块大小 1M
        fileParameterName: "file", //上传文件时文件的参数名，默认file
        maxChunkRetries: 0, //最大自动失败重试上传次数
        testChunks: true, //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: () => {},
        generateUniqueIdentifier: function(){
          return uuidv1();
        },
        headers: {
          // 在header中添加的验证，请根据实际业务来
          Authorization: "Bearer " + "testToken"
        }
      },
      uploadFileList: [],
      // 接受的文件
      collapse: false,
      panelShow: false //选择文件后，展示上传panel
    };
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
    getFileUpStatus() {
      return function(upFile) {
        if (upFile.completed) {
          return "success";
        } else if (upFile.paused) {
          return "warning";
        } else if (upFile.error) {
          return "exception";
        } else {
          return null;
        }
      };
    }
  },
  methods: {
    onFileAdded(file) {
      console.log("添加成功");
      this.panelShow = true;
      file.show = true;
      this.uploadFileList.push(file);
    },
    onfileComplete(rootFile) {
      setTimeout(() => {
        console.log("=============上传完成:准备消失=========");
        console.log(rootFile);
        rootFile.cancel();
      }, 2500);
    },
    // 文件发送完毕后合并文件
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      // 后台报错
      if (res.code == 1) {
        return;
      }
      // 205表示需要合并
      if (res.code == 205) {
        // 发送merge请求，参数为identifier和filename，这个要注意需要和后台的Chunk类中的参数名对应，否则会接收不到~
        // mergeFileRequest({
        //   identifier: file.uniqueIdentifier,
        //   filename: file.name,
        //   relativePath: file.relativePath,
        //   rootFileId: rootFile.id,
        // }).then(response => {
        //   setTimeout(() => {
        //     console.log("=============单个文件上传成功： 准备消失=========");
        //     console.log(file);
        //     console.log(this.uploadFileList);

        //     for (let i = 0; i < this.uploadFileList.length; i++) {
        //       const f = this.uploadFileList[i];
        //       if (file.name == f.name) {
        //         this.uploadFileList[i].show = false;
        //         return;
        //       }
        //     }
        //   }, 1000);
        // });
      }
    },
    // 文件进度的回调
    onFileProgress(rootFile, file, chunk) {
      console.log(
        `上传文件 ${file.name}，chunk：${chunk.startByte /
          1024 /
          1024} ~ ${chunk.endByte / 1024 / 1024}`
      );
    },
    onFileError(rootFile, file, response, chunk) {
      console.warn("--------上传文件错误--------");
      file.cancel();
    },
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    },
    fileListShow() {},
    error(msg) {
      this.$notify({
        title: "错误",
        message: msg,
        type: "error",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="css" scoped>
.updateFile {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
}
.updateFileFont {
  width: 100%;
  float: left;
  font-size: 12px;
  color: rgb(48, 48, 48);
  margin-top: 10px;
}
.updateFileProgress {
  width: 100%;
  float: left;
}
</style>