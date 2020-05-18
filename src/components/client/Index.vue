<template>
  <div class="body">
    <!--顶层导航栏-->
    <div class="tool_bar">
      <div class="bar" @click="newConn">
        <img src="@/assets/icon/newCon.png" />
        <span class="icon_title">新建</span>
      </div>
      <div class="bar">
        <img src="@/assets/icon/editCon.png" />
        <span class="icon_title">编辑</span>
      </div>
      <div class="bar">
        <img src="@/assets/icon/removeCon.png" />
        <span class="icon_title">删除</span>
      </div>
      <div class="bar" @click="openConn">
        <img src="@/assets/icon/getCon.png" />
        <span class="icon_title">打开</span>
      </div>
      <div class="bar">
        <img src="@/assets/icon/disCon.png" />
        <span class="icon_title">关闭</span>
      </div>

      <router-link class="right_bar" :to="'/index'">
        <img src="@/assets/icon/return_last.png" />
        <span class="icon_title">返回</span>
      </router-link>
      <router-link class="right_bar" :to="'/index'">
        <img src="@/assets/icon/home.png" />
        <span class="icon_title">首页</span>
      </router-link>
      <div class="right_bar">
        <img src="@/assets/icon/user.png" />
        <span class="icon_title">用户</span>
      </div>
    </div>
    <!--左侧连接栏-->
    <div class="navigation_bar">
      <el-tree
        :data="connnect"
        :expand-on-click-node="true"
        class="project-tree"
        @node-click="handleNodeClick"
        unselectable="on"
        :render-content="renderContent"
      />
    </div>

    <!-- 用户创建 修改 连接弹出框 -->
    <el-dialog
      :visible.sync="savaConnDialog"
      :lock-scroll="false"
      :title="formTitle"
      :close-on-click-modal="false"
      width="30%"
    >
      <div>
        <el-form
          ref="savaConnForm"
          :model="savaConnForm"
          :rules="savaConnRules"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="name">
            <el-input
              ref="name"
              v-model="savaConnForm.name"
              placeholder="连接名"
              name="name"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="conn-name" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="host">
            <el-input
              ref="host"
              v-model="savaConnForm.host"
              placeholder="主机IP"
              name="host"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="ip" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="port">
            <el-input
              ref="port"
              v-model="savaConnForm.port"
              placeholder="端口"
              name="port"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="port" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="userName">
            <el-input
              ref="userName"
              v-model="savaConnForm.userName"
              placeholder="用户名"
              name="userName"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="user" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="savaConnForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handlesavaConn"
            >
              <i slot="prefix" @click="showPwd">
                <svg-icon icon-class="password" />
              </i>

              <i slot="suffix" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </i>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="testConn">测试连接</el-button>
          <el-button :loading="loading" type="primary" @click="handlesavaConn">保存连接</el-button>
        </span>
      </div>
    </el-dialog>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { getConnectSource, openSource, testConn } from "@/common/api";
export default {
  data() {
    const validateHost = (rule, value, callback) => {
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      let isOk = reg.test(value + "");
      if (isOk) {
        callback();
      } else {
        callback(new Error("非法的IP地址"));
      }
    };
    const validatePort = (rule, value, callback) => {
      let reg = /^(1(02[4-9]|0[3-9][0-9]|[1-9][0-9]{2})|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
      let isOk = reg.test(value + "");
      if (isOk) {
        callback();
      } else {
        callback(new Error("非法的端口号"));
      }
    };
    return {
      connnect: [
        {
          id: 1,
          label: "127.0.0.1",
          icon: "http://122.51.229.206:8080/icon/zk.png",
          children: [
            {
              id: 11,
              label: "path",
              icon: "http://122.51.229.206:8080/icon/folder.png",
              children: [
                {
                  id: 111,
                  icon: "http://122.51.229.206:8080/icon/file.png",
                  label: "file"
                }
              ]
            }
          ]
        }
      ],
      currentRoot: null,
      type: null,
      user: null,
      formTitle: "添加连接",
      savaConnRules: {
        host: [{ required: true, trigger: "blur", validator: validateHost }],
        port: [{ required: true, trigger: "blur", validator: validatePort }]
      },
      savaConnForm: {
        name: null,
        host: null,
        port: null,
        userName: null,
        password: null
      },
      savaConnDialog: false,
      passwordType: "password",
      loading: false,
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    // 自定义节点的展示效果
    renderContent(h, { node, data, store }) {
      return (
        <div>
          <img style="width: 25px;float: left;" src={data.icon} />
          <div style="margin-left: 10px;padding-buttom:50px;float: left;">
            {data.label}
          </div>
        </div>
      );
    },
    handleNodeClick(nodeData, node) {
      console.log(nodeData);
      if (nodeData.root) {
        this.currentRoot = nodeData;
      }
    },
    openConn() {},
    newConn() {
      if (!this.user) {
        this.$alert("尚未登录，创建的连接将不能保存", "警告", {
          confirmButtonText: "确定",
          callback: action => {
            this.savaConnDialog = true;
          }
        });
      } else {
        this.savaConnDialog = true;
      }
    },
    testConn() {
      this.$refs.savaConnForm.validate(valid => {
        if (valid) {
          this.loading = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handlesavaConn() {
      this.$refs.savaConnForm.validate(valid => {
        if (valid) {
          this.loading = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    }
  },
  created() {
    this.type = this.$route.name;
    this.user = this.$store.getters.user;
    if (this.user != null) {
      getConnectSource({ type: this.type }).then(resp => {
        if (resp.resCode == 0) {
          this.connnect = resp.resVal;
        } else {
          this.$message.error(resp.resMes);
        }
      });
    }
  }
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  height: 100%;
}
.tool_bar {
  width: 100%;
  height: 10%;
  float: left;
}
.navigation_bar {
  width: 18%;
  height: 100%;
  float: left;
  background-color: rgb(255, 255, 255);
}
.el-tree {
  margin-top: 10px;
}
.right_bar img {
  height: 25px;
  margin-left: 13px;
  margin-top: 5px;
}
.bar img {
  height: 25px;
  margin-left: 13px;
  margin-top: 5px;
}
.content {
  width: 82%;
  height: 87%;
  float: left;
  background-color: rgb(255, 204, 204);
}
.bar,
.right_bar {
  width: 50px;
  height: 50px;
  float: left;
  margin-left: 15px;
  margin-top: 0.5%;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.right_bar {
  float: right;
  margin-left: 0px;
  margin-right: 15px;
}
.bar:hover {
  cursor: pointer;
  background-color: #e5e5e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.336), 0 0 6px rgba(0, 0, 0, 0.2);
}
.right_bar:hover {
  cursor: pointer;
  background-color: #e5e5e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 6px rgba(0, 0, 0, 0.2);
}

.icon_title {
  font-size: 11px;
  display: block;
  text-align: center;
  color: rgb(110, 110, 110);
  font-family: Arial, Helvetica, sans-serif;
}
</style>