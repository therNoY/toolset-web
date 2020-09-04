<template>
  <div class="body">
    <my_title class="title" :isLogin="isLogin"></my_title>

    <!-- 左边的历史收藏栏 -->
    <div class="left_body">
      <el-input
        size="mini"
        class="serch_history"
        placeholder="Filter"
        prefix-icon="el-icon-search"
        v-model="serchTxt"
        @input="serchChange"
      ></el-input>

      <el-tabs type="border-card" @tab-click="handleClickLeftBar">
        <el-tab-pane label="历史">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(h,hi) in history" :key="hi" :title="h.name" :name="h.id">
              <div v-for="(c,i) in h.children" :key="i">
                <div class="historyLab" @click="clickHistory(c)">
                  <b class="historyType" :style="getTypeColor(c.type)">{{c.type}}</b>
                  <div class="historyUrl">{{c.label}}</div>
                </div>
                <div class="historyOpIcon">
                  <svg-icon icon-class="delete" @click="deletetory(h, c,hi, i)" />
                </div>
                <div class="historyOpIcon">
                  <svg-icon icon-class="editHis" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            收藏
            <i class="el-icon-folder-add" @click="addCollectDialog = true" style="font-size:15px"></i>
          </span>

          <el-tree
            :data="collects"
            :expand-on-click-node="false"
            class="project-tree"
            node-key="id"
            :default-expanded-keys="expandedKey"
            @node-click="handleNodeClick"
            unselectable="on"
            :render-content="showCollectTree"
          />
        </el-tab-pane>
        <el-tab-pane label="任务">任务</el-tab-pane>
      </el-tabs>
    </div>
    <!-- 请求信息栏 -->
    <div class="main_body">
      <!--url展示栏-->
      <el-tabs
        v-model="showRequestName"
        type="border-card"
        editable
        @tab-click="handelItemClick"
        @edit="handleTabsEdit"
      >
        <!-- 请求栏 -->
        <el-tab-pane :key="request.id+ ''" v-for="request in editList" :name="request.id + ''">
          <span slot="label" style="font-size:12px">
            <el-badge is-dot v-if="request.lastVersionId != -1"></el-badge>
            <i
              class="el-icon-edit"
              v-if="currentEdit.id == request.id && request.status == 2"
              @click="changeNameDialog = true"
            >{{getShortUrl(request)}}</i>
            <span v-else>{{getShortUrl(request)}}</span>
          </span>
          <div class="sendTitle">
            <el-input
              style="width: 83%;"
              placeholder="请输入内容"
              v-model="request.label"
              class="input-with-select"
              @input="urlChange"
            >
              <el-select
                style="width: 100px;"
                @change="updateCurrentItem"
                v-model="request.type"
                slot="prepend"
              >
                <el-option
                  v-for="requestType in requestTypes"
                  :key="requestType"
                  :label="requestType"
                  :value="requestType"
                ></el-option>
              </el-select>
              <el-button style="width: 100px;" slot="append" @click="doSendHttp">send</el-button>
            </el-input>
            <el-button style="float:left;margin-left:1%" @click="saveCurrentEdit">保存</el-button>
            <el-button style="float:right; " @click="saveCurrentEdit">另存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 请求信息 -->
      <div
        v-if="editList.length > 0"
        style="font-size:13px; float:left; margin-left:15px; margin-top:5px"
      >
        <span>显示：</span>
        <el-checkbox v-model="sendMesShow">请求详情</el-checkbox>
        <el-checkbox v-model="respShow">返回详情</el-checkbox>
      </div>

      <el-container v-show="sendMesShow" class="sendMes" v-if="editList.length > 0">
        <el-main v-if="currentEdit.httpReqDetail">
          <el-tabs v-model="getCurrentItemShow" @tab-click="handleItemBodySelect">
            <!-- 请求参数？后面 -->
            <el-tab-pane label="params" name="params">
              <div class="params">
                <div class="params_des">
                  <div style="width: 3%">&nbsp;</div>
                  <div size="mini" style="width: 30%">KEY</div>
                  <div size="mini" style="width: 30%">VALUE</div>
                  <div size="mini" style="width: 37%">DESCRIPTION</div>
                </div>
                <div class="params_show" v-for="p in currentEdit.httpReqDetail.params" :key="p.id">
                  <el-checkbox
                    v-model="p.s"
                    style="width: 2%; margin-right:1%; float:left"
                    @change="updateCurrentItem"
                  ></el-checkbox>
                  <el-input
                    v-model="p.k"
                    size="mini"
                    style="width: 30%; margin-bottom: 2px;"
                    @input="updateCurrentItem"
                    placeholder="key"
                  ></el-input>
                  <el-input
                    v-model="p.v"
                    size="mini"
                    style="width: 30%; margin-bottom: 2px;"
                    @input="updateCurrentItem"
                    placeholder="value"
                  ></el-input>
                  <el-input
                    v-model="p.d"
                    size="mini"
                    style="width: 37%; margin-bottom: 2px;"
                    @input="updateCurrentItem"
                    placeholder="description"
                  ></el-input>
                </div>
              </div>
              <div class="add_params">
                <el-button size="mini" @click="addItemPara">添加</el-button>
              </div>
            </el-tab-pane>
            <!-- 验证部分 -->
            <el-tab-pane class="item_auth_show" label="authorization" name="authorization">
              <el-select
                v-model="currentEdit.httpReqDetail.auth.k"
                size="mini"
                @change="updateCurrentItem"
              >
                <el-option
                  v-for="authType in authTypes"
                  :key="authType"
                  :label="authType"
                  :value="authType"
                ></el-option>
              </el-select>

              <div
                class="auth_body"
                v-if="currentEdit.httpReqDetail.auth.k == 'No Auth'"
              >This request does not use any authorization.</div>
              <div
                class="auth_body"
                v-else-if="currentEdit.httpReqDetail.auth.k == 'Basic Auth'"
              >In development ...</div>
              <div class="auth_body" v-else-if="currentEdit.httpReqDetail.auth.k == 'Bearer Token'">
                <div style="float: left; margin-right: 5%;margin-top: 5px;">Token:</div>
                <div style="float: left; width:70%">
                  <el-input
                    size="mini"
                    v-model="currentEdit.httpReqDetail.auth.v"
                    @input="updateCurrentItem"
                  ></el-input>
                </div>
              </div>
            </el-tab-pane>
            <!-- 请求头 -->
            <el-tab-pane label="headers" name="headers">
              <div style="width:80%; float:left">
                <div class="headers_des">
                  <div style="width: 3%">&nbsp;</div>
                  <div size="mini" style="width: 30%">KEY</div>
                  <div size="mini" style="width: 30%">VALUE</div>
                  <div size="mini" style="width: 37%">DESCRIPTION</div>
                </div>
                <div
                  class="headers_show"
                  v-for="(header,index) in currentEdit.httpReqDetail.headers"
                  :key="index"
                >
                  <el-checkbox
                    v-model="header.s"
                    style="width: 2%; margin-right:1%; float:left"
                    @change="updateCurrentItem"
                  ></el-checkbox>
                  <div style="width: 30%; margin-bottom: 2px; float:left">
                    <el-autocomplete
                      class="inline-input"
                      v-model="header.k"
                      size="mini"
                      @input="updateCurrentItemAndGiveSuggest(index)"
                      :fetch-suggestions="getCommonHeaders"
                      placeholder="key"
                    ></el-autocomplete>
                  </div>

                  <el-input
                    v-model="header.v"
                    size="mini"
                    style="width: 30%; margin-bottom: 2px;"
                    @input="updateCurrentItem"
                    placeholder="value"
                  ></el-input>
                  <el-input
                    v-model="header.d"
                    size="mini"
                    style="width: 37%; margin-bottom: 2px;"
                    @input="updateCurrentItem"
                    placeholder="description"
                  ></el-input>
                </div>
              </div>

              <div style="float: right;">
                <el-button size="mini" @click="addItemPara">添加</el-button>
              </div>
            </el-tab-pane>
            <!-- 请求体 -->
            <el-tab-pane label="body" name="body">
              <div v-if="errJson">
                <el-input
                  v-show="editBody"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 18}"
                  v-model="getEditJsonBody"
                  style="width:60%"
                  @input="updateCurrentItem"
                ></el-input>
                <json-viewer
                  v-show="!editBody"
                  :value="getJsonOrString(currentEdit.httpReqDetail.body)"
                  :expand-depth="4"
                  copyable
                  sort
                ></json-viewer>
                <div style="margin-bottom: 10px;color:red;font-size: 13px;">错误的json格式</div>
              </div>
              <div v-else>
                <el-input
                  v-show="editBody"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 18}"
                  placeholder="please input body"
                  v-model="getEditJsonBody"
                  style="margin-bottom: 10px;width:60%"
                  @input="updateCurrentItem"
                ></el-input>
                <json-viewer
                  v-show="!editBody"
                  :value="getJsonOrString(currentEdit.httpReqDetail.body)"
                  :expand-depth="4"
                  copyable
                  sort
                ></json-viewer>
              </div>
              <el-button v-if="editBody" @click="editBody = !editBody" size="mini">格式化</el-button>
              <el-button v-else @click="editBody = !editBody" size="mini">编辑</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>

      <!--返回结果-->
      <el-container
        v-show="respShow"
        v-loading="sendHttpIng"
        class="response"
        v-if="editList.length > 0"
      >
        <el-main>
          <el-tabs v-model="respDefalutShow">
            <el-tab-pane class="respBody" label="body" name="body">
              <div v-if="currentEdit.respBody">
                <div v-if="currentEdit.contentType.indexOf('application/json') == 0">
                  <json-viewer
                    :value="getJsonOrString(currentEdit.respBody)"
                    :expand-depth="5"
                    copyable
                    sort
                  ></json-viewer>
                </div>
                <div
                  style="font-size:12px"
                  v-else-if="currentEdit.contentType.indexOf('text/html') == 0"
                  v-html="currentEdit.respBody"
                />
                <div v-else v-html="currentEdit.respBody"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="headers" name="headers">
              <div v-if="currentEdit.respHeaders">
                <div class="params_des" style="float:left">
                  <div style="width: 3%">&nbsp;</div>
                  <div size="mini" style="width: 30%">KEY</div>
                  <div size="mini" style="width: 30%;margin-left:5%">VALUE</div>
                </div>
                <div
                  v-for="(head,index) in currentEdit.respHeaders"
                  :key="index"
                  style="width: 100%;float:left;margin-bottom:2px"
                >
                  <el-input v-model="head.k" size="mini" style="width: 30%;margin-left:3%"></el-input>
                  <el-input v-model="head.v" size="mini" style="width: 30%;margin-left:5%"></el-input>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="cookie" name="cookie">
              <div v-if="currentEdit.respCookies">
                <div class="params_des" style="float:left">
                  <div style="width: 3%">&nbsp;</div>
                  <div size="mini" style="width: 30%">KEY</div>
                  <div size="mini" style="width: 30%;margin-left:5%">VALUE</div>
                </div>
                <div
                  v-for="(cookie,index) in currentEdit.respCookies"
                  :key="index"
                  style="width: 100%;float:left;margin-bottom:2px"
                >
                  <el-input v-model="cookie.k" size="mini" style="width: 30%;margin-left:3%"></el-input>
                  <el-input v-model="cookie.v" size="mini" style="width: 30%;margin-left:5%"></el-input>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="默认请求头" name="addDefaultHeaders">
              <div v-if="currentEdit.respAddHeaders">
                <div class="params_des" style="float:left">
                  <div style="width: 3%">&nbsp;</div>
                  <div size="mini" style="width: 30%">KEY</div>
                  <div size="mini" style="width: 30%;margin-left:5%">VALUE</div>
                </div>
                <div
                  v-for="(head,index) in currentEdit.respAddHeaders"
                  :key="index"
                  style="width: 100%;float:left;margin-bottom:2px"
                >
                  <el-input v-model="head.k" size="mini" style="width: 30%;margin-left:3%"></el-input>
                  <el-input v-model="head.v" size="mini" style="width: 30%;margin-left:5%"></el-input>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </div>

    <!-- 增加新的收藏弹出框 -->
    <el-dialog
      :visible.sync="addCollectDialog"
      title="创建文件夹"
      :close-on-click-modal="false"
      :before-close="removeNewCollectionInfo"
      width="30%"
    >
      <div>
        <el-input placeholder="请输入名称" v-model="newCollection.name" size="mini" clearable></el-input>
        <el-input
          style="margin-top: 50px;margin-bottom:20px"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 10}"
          placeholder="请输入描述"
          v-model="newCollection.description"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="removeNewCollectionInfo">取 消</el-button>
          <el-button size="mini" type="primary" @click="addNewCollection">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 修改请求的name -->
    <el-dialog title="修改请求名称" :close-on-click-modal="false" :visible.sync="changeNameDialog">
      <el-input v-model="currentEdit.name" placeholder="请求名字" size="small"></el-input>
      <div slot="footer">
        <el-button @click="changeNameDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="changeItemName" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新建request的name -->
    <el-dialog title="新建请求" :close-on-click-modal="false" :visible.sync="newCollectRequestDialog">
      <el-input size="small" v-model="newCollectRequestName" placeholder="请求名字"></el-input>
      <div slot="footer">
        <el-button @click="newCollectRequestDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sendAddCollectRequest" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改请求的name -->
    <el-dialog
      title="保存到文件夹"
      :close-on-click-modal="false"
      :visible.sync="saveCurrentEditToCollectDialog"
    >
      <div style="float:left;width:100%">
        <el-input size="small" v-model="newCollectRequestName" placeholder="请求名字"></el-input>
      </div>

      <div style="float:left;width:100%">
        <el-tree
          :data="noItemCollects"
          :expand-on-click-node="false"
          node-key="id"
          show-checkbox
          ref="tree"
          @check="dataCheckChange"
          :check-strictly="true"
          :render-content="selectCollectTree"
        />
      </div>
      <div slot="footer">
        <el-button @click="saveCurrentEditToCollectDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sendSaveCurrentEditToCollect" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import my_title from "../Title";
import { getRealLengthOfString } from "../../../common/util/string";
import {
  getUserHttpReqHistory,
  getUserHttpReqEdit,
  saveHttpReqItem,
  updateHttpReqItem,
  updateHttpReqItemUrl,
  getCommonHeaderKey,
  addNewHttpReqItem,
  delHttpReqItem,
  delHttpReqHis,
  addNewCollections,
  getUserHttpReqCollection,
  delHttpReqCollect,
  saveHttpReqItemChange,
  updateHttpReqItemStatus,
  getUserNoItemHttpReqCollection,
  saveItemToCollect,
  delHttpReqItemFromCollect,
  sendHttp
} from "@/common/api";
export default {
  data() {
    return {
      isLogin: false,
      // 左侧导航栏
      activeNames: 0,
      serchTxt: null,
      history: null,
      // 用户收藏
      collects: [],
      noItemCollects: [],
      task: null,
      // 主要显示部分
      showRequestName: null,
      // 正在编辑的请求
      editList: [],
      // 是否展示请求栏
      sendMesShow: true,
      respShow: true,
      currentEdit: {},
      // 当前正在查看的页面
      currentItemShow: "",
      multipleSelection: ["0"],
      defaultType: "get",
      requestTypes: ["get", "post", "put", "delete"],
      authTypes: ["No Auth", "Basic Auth", "Bearer Token"],
      commonHeaders: [],
      suggestHeaders: {},
      errJson: false,
      editBody: false,
      respDefalutShow: "body",

      addCollectDialog: false,
      changeNameDialog: false,
      newCollectRequestDialog: false,
      saveCurrentEditToCollectDialog: false,
      // 要添加的请求名称
      newCollectRequestName: null,
      newCollection: {},
      sendHttpIng: false,
      // 展示收藏默认的显示内容
      expandedKey: [],
      // 将item选择添加到收藏中的id
      selectCollectKey: null
    };
  },
  components: {
    my_title
  },
  computed: {
    // 获取当前的展示 首次显示是params 计算属性在v-model 中的使用
    getCurrentItemShow: {
      get() {
        if (
          this.currentEdit != null &&
          this.currentEdit.hasOwnProperty("show")
        ) {
          return this.currentEdit.show;
        } else {
          return "params";
        }
      },
      set(val) {
        this.currentEdit.show = val;
      }
    },
    getEditJsonBody: {
      get() {
        return this.currentEdit.httpReqDetail.body;
      },
      set(val) {
        try {
          JSON.parse(val);
          this.errJson = false;
        } catch (err) {
          this.errJson = true;
        }
        this.currentEdit.httpReqDetail.body = val;
      }
    },
    // 防止URL 过长导致显示过长
    getShortUrl() {
      return function(request) {
        if (request.status == 2) {
          if (request.name.length < 25) {
            return request.name;
          } else {
            return request.name.substring(0, 25) + " ...";
          }
        } else {
          if (request.label == null) {
            return "Untitled Request";
          }
          if (request.label.length < 25) {
            return request.label;
          } else {
            return request.label.substring(0, 25) + " ...";
          }
        }
      };
    }
  },
  methods: {
    // 自定义节点的展示效果
    showCollectTree(h, { node, data, store }) {
      console.log(data);
      if (!data.collection) {
        return (
          <div
            style="width:100%; float:left"
            on-click={() => this.clickCollectItem(data)}
          >
            <b class="collect_item_type" style={this.getTypeColor(data.type)}>
              {data.type}
            </b>
            <div class="commom_font" style="float:left;margin-left:5px">
              {this.getShortCollectUrl(data)}
            </div>
            <svg-icon
              style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
              icon-class="delete"
              on-click={() => this.deleteCollectItem(data)}
            />
          </div>
        );
      } else {
        if (data.historyId == null) {
          return (
            <div style="width:100%; float:left">
              <i
                class="el-icon-folder-opened"
                style="font-size:15px; float:left"
              ></i>
              <div class="commom_font" style="float:left;margin-left:5px">
                {data.name}
              </div>
              <svg-icon
                style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
                icon-class="addDir"
                on-click={() => this.createNewChildCollection(data)}
              />
              <svg-icon
                style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
                icon-class="add"
                on-click={() => this.addCollectRequest(data)}
              />
              <svg-icon
                style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
                icon-class="delete"
                on-click={() => this.deleteCollect(data)}
              />
            </div>
          );
        } else {
          return (
            <div style="width:100%; float:left">
              <i class="el-icon-folder" style="font-size:15px; float:left"></i>
              <div class="commom_font" style="float:left;margin-left:5px">
                {data.name}
              </div>
              <svg-icon
                style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
                icon-class="add"
                on-click={() => this.addCollectRequest(data)}
              />
              <svg-icon
                style=" width: 1em !important;height: 1em !important;float: right;margin-right: 5px;"
                icon-class="delete"
                on-click={() => this.deleteCollect(data)}
              />
            </div>
          );
        }
      }
    },
    selectCollectTree(h, { node, data, store }) {
      return <div>{data.name}</div>;
    },
    handleNodeClick(nodeData, node) {
      console.log(nodeData);
      if (nodeData.root) {
        this.currentRoot = nodeData;
      }
    },
    // TODO 搜索结果
    serchChange() {
      console.log(this.serchTxt);
    },
    // url改变
    urlChange() {
      updateHttpReqItemUrl(this.currentEdit).then(resp => {
        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const edit = this.editList[i];
            if (edit.id == resp.resVal.id) {
              this.editList[i] = resp.resVal;
              this.currentEdit = this.editList[i];
              break;
            }
          }
        }
      });
    },
    // 获取type 的颜色
    getTypeColor(type) {
      if (type == "get") return "color:#32B886";
      else if (type == "post") return "color:#FFC948";
      else if (type == "delete") return "color:#ED4B48";
      else return "color:#097BED";
    },
    getShortCollectUrl(request) {
      console.log(getRealLengthOfString);
      if (request.status == 2 || request.status == 3) {
        return getRealLengthOfString(request.name, 15);
      } else {
        if (request.url == null) {
          return "Untitled Request";
        }
        return getRealLengthOfString(request.url, 15);
      }
    },
    // 点击历史
    clickHistory(request) {
      let isHava = false;
      this.editList.forEach(edit => {
        if (edit.hasOwnProperty("historyId") && edit.historyId == request.id) {
          this.showRequestName = edit.id + "";
          this.currentEdit = edit;
          console.log("历史纪录已经在编辑列表中");
          isHava = true;
        }
      });
      if (isHava) {
        return;
      }
      // 生成postItem
      this.currentEdit = request;
      this.currentEdit.historyId = request.id;
      saveHttpReqItem(this.currentEdit).then(resp => {
        if (resp.resCode == 0) {
          this.currentEdit = JSON.parse(JSON.stringify(request));
          this.currentEdit.id = resp.resVal;
          this.editList.push(this.currentEdit);
          this.showRequestName = this.currentEdit.id + "";
        }
      });
    },
    changeItemName() {
      updateHttpReqItem(this.currentEdit).then(resp => {
        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const item = this.editList[i];
            if (item.id == this.currentEdit.id) {
              this.editList[i] = resp.resVal;
              this.changeNameDialog = false;
              return;
            }
          }
        }
        this.changeNameDialog = false;
      });
    },
    // 收藏中的item
    clickCollectItem(item) {
      let isHava = false;
      this.editList.forEach(edit => {
        if (edit.id == item.id * -1) {
          this.currentEdit = edit;
          this.showRequestName = this.currentEdit.id + "";
          console.log("item已经在edit中了");
          isHava = true;
        }
      });
      if (isHava) {
        return;
      }
      // 生成postItem
      console.log("修改edit的状态");
      updateHttpReqItemStatus({ id: item.id, status: 2 }).then(resp => {
        if (resp.resCode == 0) {
          this.editList.push(resp.resVal);
          this.currentEdit = this.editList[this.editList.length - 1];
          this.showRequestName = this.currentEdit.id + "";
        }
      });
    },
    dataCheckChange(data) {
      this.$refs.tree.setCheckedKeys([data.id]);
      this.selectCollectKey = data.id;
    },
    // 删除历史纪录
    deletetory(h, c, hi, i) {
      delHttpReqHis({ id: c.id }).then(resp => {
        if (resp.resCode == 0) {
          h.children.splice(i, 1);
          if (h.children.length == 0) {
            this.history.splice(hi, 1);
          }
        } else {
          this.message.error(resp.resVal);
        }
      });
    },
    // 处理tab 编辑
    handleTabsEdit(targetName, action) {
      console.log(action);
      console.log(targetName);
      if (action === "add") {
        // 添加一个空标签
        addNewHttpReqItem().then(resp => {
          if (resp.resCode == 0) {
            this.editList.push(resp.resVal);
            this.currentEdit = resp.resVal;
            this.showRequestName = this.currentEdit.id + "";
          }
        });
      }
      if (action === "remove") {
        let editIndex;

        for (let i = 0; i < this.editList.length; i++) {
          const item = this.editList[i];
          if (targetName == item.id) {
            editIndex = i;
            break;
          }
        }
        // 删除一个item
        console.log("remove" + targetName);
        if (
          this.editList[editIndex].status == 2 &&
          this.editList[editIndex].lastVersionId != -1
        ) {
          // 保存已经修改的collect item 提示不保存
          this.$confirm("是否保存 不保存将会丢失最近修改", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "保存",
            cancelButtonText: "不保存"
          })
            .then(() => {
              saveHttpReqItemChange({ id: targetName, remove: true }).then(
                resp => {
                  if (resp.resCode == 0) {
                    this.editList.splice(editIndex, 1);
                    this.getUserCollection();
                  }
                }
              );
            })
            .catch(action => {
              if (action == "cancel") {
                // 直接关闭 不提示
                delHttpReqItem({ id: targetName }).then(resp => {
                  if (resp.resCode == 0) {
                    this.editList.splice(editIndex, 1);
                  }
                });
              }
            });
        } else if (
          this.editList[editIndex].status == 2 &&
          this.editList[editIndex].lastVersionId == -1
        ) {
          // 直接关闭 不提示
          delHttpReqItem({ id: targetName }).then(resp => {
            if (resp.resCode == 0) {
              this.editList.splice(editIndex, 1);
            }
          });
        } else {
          this.$confirm("是否保存到收藏，否则将会永久删除", "提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "保存",
            cancelButtonText: "直接删除"
          })
            .then(() => {
              this.saveCurrentEditToCollect();
            })
            .catch(action => {
              if (action == "cancel") {
                console.log("直接删除");
                this.removeEditItem(targetName);
              }
            });
        }
      }
    },
    // 点击每个item
    handelItemClick(key, keyPath) {
      this.currentEdit = this.editList[key.index];
      this.currentEdit.showP = false;
      console.log(this.currentEdit);
    },
    // 移除一个正在编辑的item
    removeEditItem(id) {
      delHttpReqItem({ id: id }).then(resp => {
        if (resp.resCode == 0) {
          let index = 0;
          for (let i = 0; i < this.editList.length; i++) {
            const item = this.editList[i];
            if (id == item.id) {
              index = i;
              break;
            }
          }
          this.editList.splice(index, 1);
        }
      });
    },
    // 移除一个收藏中的item
    deleteCollectItem(item) {
      delHttpReqItemFromCollect({ id: item.id }).then(resp => {
        let id = Math.abs(item.id);

        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const edit = this.editList[i];
            if (edit.id == id) {
              this.editList.splice(i, 1);
              break;
            }
          }

          this.getUserCollection();
        }
      });
    },
    // 处理点击tag 显示是否选择
    handleItemBodySelect(key, keyPath) {
      if (key.label == this.currentItemShow) {
        console.log("正在查看这个不做操作");
        return;
      }
      this.currentItemShow = key.label;
    },
    // 点击新加一列请求头
    addItemPara() {
      console.error(this.currentEdit);
      let currentShow = this.currentEdit.show
        ? this.currentEdit.show
        : "params";
      if (currentShow == "params") {
        let addItem = { k: "", v: "", s: true, d: "" };
        this.currentEdit.httpReqDetail.params.push(addItem);
      } else if (currentShow == "headers") {
        let addItem = { k: "", v: "", s: true, d: "" };
        this.currentEdit.httpReqDetail.headers.push(addItem);
      }
      console.log(this.currentEdit);
      updateHttpReqItem(this.currentEdit).then(resp => {
        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const edit = this.editList[i];
            if (edit.id == resp.resVal.id) {
              this.editList[i] = resp.resVal;
              this.currentEdit = this.editList[i];
              break;
            }
          }
        }
      });
    },
    // 更新当前的编辑
    saveCurrentEdit() {
      if (this.currentEdit.status == 2) {
        saveHttpReqItemChange({ id: this.currentEdit.id, remove: false }).then(
          resp => {
            if (resp.resCode == 0) {
              for (let i = 0; i < this.editList.length; i++) {
                const edit = this.editList[i];
                if (edit.id == this.currentEdit.id) {
                  this.editList[i] = resp.resVal;
                  this.currentEdit = this.editList[i];
                  break;
                }
              }
              this.getUserCollection();
            }
          }
        );
      } else {
        this.saveCurrentEditToCollect();
      }
    },
    // 更新item
    updateCurrentItem() {
      updateHttpReqItem(this.currentEdit).then(resp => {
        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const edit = this.editList[i];
            if (edit.id == resp.resVal.id) {
              this.editList[i] = resp.resVal;
              this.currentEdit = this.editList[i];
              break;
            }
          }
        }
      });
    },
    updateCurrentItemAndGiveSuggest(index) {
      let k = this.currentEdit.httpReqDetail.headers[index].k;
      if (k != null) {
        let suggestV = null;
        let suggestD = null;
        this.suggestHeaders.forEach(sh => {
          if (k == sh.key) {
            suggestV = sh.defaultValue;
            suggestD = sh.des;
          }
        });
        if (suggestV != null) {
          this.currentEdit.httpReqDetail.headers[index].v = suggestV;
          this.currentEdit.httpReqDetail.headers[index].d = suggestD;
        }
      }
      this.updateCurrentItem();
    },
    // 添加一个新的收藏
    addNewCollection() {
      addNewCollections(this.newCollection).then(resp => {
        if (resp.resCode == 0) {
          this.$message.success("添加成功");
        }
        this.addCollectDialog = false;
        this.getUserCollection();
        if (this.newCollection.historyId) {
          this.expandedKey = [];
          this.expandedKey.push(this.newCollection.historyId);
        }
        this.newCollection = {};
      });
    },

    // 添加一个收藏夹里的请求
    addCollectRequest(collect) {
      this.newCollectRequestDialog = true;
      this.newCollectRequestCollectId = collect.id;
    },

    sendAddCollectRequest() {
      addNewHttpReqItem({
        collectId: this.newCollectRequestCollectId,
        name: this.newCollectRequestName
      }).then(resp => {
        if (resp.resCode == 0) {
          this.editList.push(resp.resVal);
          this.currentEdit = resp.resVal;
          this.showRequestName = this.currentEdit.id + "";
          this.newCollectRequestDialog = false;
          this.getUserCollection();
        }
      });
    },

    // 请求头推荐结果
    getCommonHeaders(queryString, cb) {
      var commonHeaders = this.commonHeaders;
      var results = queryString
        ? commonHeaders.filter(this.createFilter(queryString))
        : commonHeaders;
      // 调用 callback 返回建议列表的数据
      console.log(results);
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 准备发送当前的http
    doSendHttp() {
      this.sendHttpIng = true;
      sendHttp({ id: this.currentEdit.id })
        .then(resp => {
          console.log(resp);
          if (resp.resCode == 0) {
            for (let i = 0; i < this.editList.length; i++) {
              const edit = this.editList[i];
              if (edit.id == resp.resVal.id) {
                this.editList[i] = resp.resVal;
                this.currentEdit = this.editList[i];
                break;
              }
            }
            this.getUserHistory();
          } else {
            this.$message.error(resp.resVal);
          }
          this.sendHttpIng = false;
        })
        .catch(err => {
          this.sendHttpIng = false;
        });
    },

    // 获取用户的历史纪录
    getUserHistory() {
      getUserHttpReqHistory().then(resp => {
        if (resp.resCode == 0) {
          this.history = resp.resVal;
        } else {
          this.$message.error(resp.resMes);
        }
      });
    },
    // 创建一个父类收藏的子文件
    createNewChildCollection(pc) {
      console.log(pc);
      this.newCollection.historyId = pc.id;
      this.addCollectDialog = true;
    },
    //  删除新的请求信息
    removeNewCollectionInfo() {
      this.addCollectDialog = false;
      this.newCollection = {};
    },

    // 将当前编辑的结果保存到收藏中
    saveCurrentEditToCollect() {
      // 首先获取没有item的文件夹
      getUserNoItemHttpReqCollection().then(resp => {
        if (resp.resCode == 0) {
          this.saveCurrentEditToCollectDialog = true;
          this.noItemCollects = resp.resVal;
        } else {
          this.$message.error(resp.resMes);
        }
      });
    },
    sendSaveCurrentEditToCollect() {
      this.saveCurrentEditToCollectDialog = false;

      let reqJson = {};
      reqJson.itemId = this.currentEdit.id;
      reqJson.name = this.newCollectRequestName;
      reqJson.collectId = this.selectCollectKey;
      reqJson.remove = false;
      saveItemToCollect(reqJson).then(resp => {
        if (resp.resCode == 0) {
          for (let i = 0; i < this.editList.length; i++) {
            const edit = this.editList[i];
            if ((edit.id = this.currentEdit.id)) {
              this.editList[i] = resp.resVal;
              this.currentEdit = resp.resVal;
              break;
            }
          }
          this.getUserCollection();
        }
      });
    },

    // 获取用户请求信息
    getUserCollection() {
      getUserHttpReqCollection().then(resp => {
        if (resp.resCode == 0) {
          this.collects = resp.resVal;
          if (this.currentEdit && this.currentEdit.collectionsId) {
            this.expandedKey = [];
            this.expandedKey.push(this.currentEdit.collectionsId);
          }
        } else {
          this.$message.error(resp.resMes);
        }
      });
    },

    // 删除用户请求
    deleteCollect(collect) {
      if (collect.children) {
        this.$confirm("操作将会永久删除文件夹内所有内容", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          this.deleteUserCollect(collect);
        });
      } else {
        this.deleteUserCollect(collect);
      }
    },

    // 删除用户收藏
    deleteUserCollect(collection) {
      delHttpReqCollect({ id: collection.id }).then(resp => {
        this.getUserCollection();
        if (collection.historyId) {
          this.expandedKey = [];
          this.expandedKey.push(collection.historyId);
        }
      });
    },

    // 尝试获取json 获取不到返回字符串
    getJsonOrString(val) {
      let json = null;
      try {
        json = JSON.parse(val);
      } catch (err) {
        json = val;
      }
      return json;
    },

    // 处理点击左侧bar条
    handleClickLeftBar() {}
  },

  created() {
    if (this.$store.getters.user != null) {
      console.log("工具界面用户已经登录");
      this.isLogin = true;
    }
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#FFFFFF");
  },

  mounted() {
    if (this.isLogin) {
      console.log("查询用户搜索历史");

      // 初始化历史纪录
      this.getUserHistory();

      // 初始化用户收藏
      this.getUserCollection();

      getUserHttpReqEdit().then(resp => {
        if (resp.resCode == 0) {
          this.editList = resp.resVal;
          if (this.editList != null && this.editList.length > 0) {
            this.showRequestName =
              this.editList[this.editList.length - 1].id + "";
            this.currentEdit = this.editList[this.editList.length - 1];
          }
        } else {
          this.$message.error(resp.resMes);
        }
      });
    } else {
    }

    getCommonHeaderKey().then(resp => {
      if (resp.resCode == 0) {
        this.commonHeaders = resp.resVal.headerKeyList;
        this.suggestHeaders = resp.resVal.commonHeaderList;
      }
    });
  },

  destroyed() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#F0F0F0");
  }
};
</script>

<style lang="css" scoped>
.body {
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  height: 7%;
  float: left;
}
.left_body {
  width: 20%;
  height: 93%;
  float: left;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.527);
}
.main_body {
  height: 93%;
  width: 79.5%;
  float: right;
  padding-left: 2px;
  padding-top: 2px;
  background-color: rgb(255, 255, 255);
}
.serch_history {
  float: left;
  width: 90%;
  margin-left: 10px;
  margin-top: 10px;
}
.el-input {
  float: left;
}
.el-tabs {
  float: left;
  width: 99%;
  margin-top: 5px;
}
.historyLab {
  float: left;
  width: 80%;
  height: 100%;
  border-bottom: 1px;
  margin-bottom: 2px;
  cursor: pointer;
  font-size: 10px;
}
.historyType {
  float: left;
  width: 19%;
  height: 100%;
}
.historyUrl {
  float: left;
  width: 77%;
  margin-left: 4px;
  word-wrap: break-word;
  word-break: normal;
}
.historyOpIcon {
  float: right;
  width: 10%;
}
.sendTitle {
  width: 100%;
}
.params {
  width: 80%;
  float: left;
}
.add_params {
  float: right;
}
.params_des,
.headers_des {
  width: 100%;
}
.params_des div,
.headers_des div {
  float: left;
  font-size: 13px;
  margin-bottom: 2px;
  color: rgb(61, 61, 61);
}
.sendMes {
  width: 100%;
  height: 300px;
  padding-right: 10px;
}
.params_show {
  width: 100%;
  margin-bottom: 2px;
}
.item_auth_show {
  width: 100%;
  float: left;
  margin-top: 20px;
}
.item_auth_show .el-select {
  width: 15%;
  margin-right: 5%;
  float: left;
}
.item_auth_show .auth_body {
  width: 70%;
  float: left;
  font-size: 13px;
  color: rgb(63, 63, 63);
}
.el-autocomplete {
  width: 100%;
}
.response {
  float: left;
  width: 100%;
  height: 400px;
}
.respBody {
  width: 90%;
  word-break: break-all;
}
.svg-icon {
  width: 1.5em !important;
  height: 1.5em !important;
  float: left;
  margin-left: 5px;
  margin-top: 3px;
  cursor: pointer;
}
.collectionIcon {
  width: 1em !important;
  height: 1em !important;
  float: right;
  margin-right: 5px;
}
.el-tabs__item {
  width: 50px !important;
}
</style>