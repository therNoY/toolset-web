<template>
  <div class="body">
    <!--左侧导航-->
    <div class="bar">
      <el-col :span="12">
        <el-menu default-active="/index" @select="router">
          <el-menu-item index="/index">
            <i class="el-icon-menu"></i>
            <span slot="title">主页</span>
          </el-menu-item>

          <el-menu-item index="/client/home">
            <i class="el-icon-monitor"></i>
            <span slot="title">服务客户端</span>
          </el-menu-item>

          <el-menu-item index="/tools/home">
            <i class="el-icon-set-up"></i>
            <span slot="title">实用工具</span>
          </el-menu-item>

          <el-menu-item index="/extend/home">
            <i class="el-icon-s-grid"></i>
            <span slot="title">其他工具</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div class="right">
      <!--头部-->
      <div class="title">
        <div v-if="loginUser">
          <el-dropdown trigger="click" size="mini">
            <el-tag size="medium">
              {{loginUser.name}}
              <i class="el-icon-caret-bottom" />
            </el-tag>

            <el-dropdown-menu slot="dropdown" size="small">
              <router-link to="/">
                <el-dropdown-item>Home</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">退 出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else>
          <div>
            <el-link @click="registerDialog = true">开放注册</el-link>
          </div>
          <div>
            <el-link @click="loginDialog = true">登录</el-link>
          </div>
        </div>

        <el-input placeholder="搜索工具" size="small" prefix-icon="el-icon-search" v-model="homeSerch"></el-input>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <!-- 用户登录弹出框 -->
    <el-dialog :visible.sync="loginDialog" :close-on-click-modal="false" width="30%">
      <div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title_mes">用户登录</h3>
          </div>

          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
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
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" @click="showPwd">
                <svg-icon icon-class="password" />
              </i>

              <i slot="suffix" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </i>
            </el-input>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </el-dialog>

    <!-- 用户注册弹出框 -->
    <el-dialog
      :visible.sync="registerDialog"
      title="开放注册"
      :close-on-click-modal="false"
      width="30%"
    >
      <div>
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="regsiterRules"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="registerForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="user" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              ref="email"
              v-model="registerForm.email"
              placeholder="邮箱"
              name="email"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="prefix">
                <svg-icon icon-class="email" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="registerForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" @click="showPwd">
                <svg-icon icon-class="password" />
              </i>

              <i slot="suffix" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="rePassword">
            <el-input
              :key="passwordType"
              ref="rePassword"
              v-model="registerForm.rePassword"
              :type="passwordType"
              placeholder="确认密码"
              name="rePassword"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleRegister"
            >
              <i slot="prefix" @click="showPwd">
                <svg-icon icon-class="password" />
              </i>

              <i slot="suffix" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </i>
            </el-input>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleRegister"
          >注册</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("用户名必须大于3位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("密码不能少于4位"));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (
        this.registerForm.password != null &&
        this.registerForm.password != this.registerForm.rePassword
      ) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "admin"
      },
      registerForm: {
        username: "",
        email: "",
        password: "",
        rePassword: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      regsiterRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        rePassword: [
          { required: true, trigger: "blur", validator: validateRePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      homeSerch: null,
      loginDialog: false,
      registerDialog: false,
      loginUser: null
    };
  },
  created() {
    let hasUser = this.$store.getters.user;
    if (hasUser) {
      this.loginUser = hasUser;
    }
    console.warn(this.loginUser);
  },
  methods: {
    router(index, indexPath) {
      this.$router.push(index);
    },
    handleLogin() {
      this.loading = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login", this.loginForm)
            .then(resp => {
              if (resp.resCode == 0) {
                this.loginDialog = false;
                this.loginUser = resp.resVal.user;
                this.$message({
                  showClose: true,
                  message: "登录成功",
                  type: "success"
                });
                this.loginDialog = false;
              } else {
                this.$message.error(resp.resMes);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.$message.error("网络异常!!");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("register", this.registerForm)
            .then(resp => {
              console.log(resp);
              this.loading = false;
              this.$message({
                showClose: true,
                message: "注册成功",
                type: "success"
              });
              this.registerDialog = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    logout() {
      this.$store.dispatch("logout");
      this.loginUser = null;
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
  }
};
</script>

<style lang="css" scoped>
.body {
  height: 100%;
  width: 100%;
}
.bar {
  width: 15%;
  float: left;
  height: 100%;
  background-color: #ffffff;
}
.right {
  float: right;
  width: 85%;
  height: 100%;
}
.title {
  width: 100%;
  height: 6%;
  background-color: aliceblue;
}
.title .el-input {
  width: 20%;
  height: 5px;
  float: right;
  margin-right: 20px;
}
.title div {
  float: right;
  margin-top: 0.3%;
  margin-right: 20px;
}
.content {
  width: 100%;
  height: 90%;
}
.el-col-12 {
  width: 100%;
}
</style>