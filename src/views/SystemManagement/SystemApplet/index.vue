<template>
  <div v-loading="loading" class="applet-authorization">
    <template v-if="hasAuth">
      <xr-header
        ref="xrHeader"
        :show-search="showSearch"
        placeholder="请输入手机号/员工姓名"
        label="名片小程序管理"
        icon-class="wk wk-contacts"
        icon-color="#19B5F6"
        @search="searchClick"/>
      <div class="applet-box">
        <!-- 左边导航 -->
        <div
          v-loading="appletMenuLoading"
          class="nav">
          <div class="nav__hd">
            小程序
          </div>
          <!-- 左侧列表 -->
          <div class="applet-nav-box">
            <div
              v-for="(item, index) in leftList"
              :key="index"
              :class="{'is-select' : item.type == menuActive}"
              class="menu-item"
              @click="appletaMenuSelect(item)">
              <i :class="item.icon"/>
              <span class="appleta-name">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右边内容 -->
        <div v-if="menuActive === 'card'" class="content-box">
          <el-tabs v-model="menuChildIndex">
            <el-tab-pane
              label="员工信息"
              name="user"
              lazy>
              <div
                v-loading="userLoading"
                class="content-table">
                <flexbox class="content-table-header">
                  <div class="content-table-header-reminder">
                    <reminder
                      v-if="showReminder"
                      :content="getReminderContent()"/>
                    <flexbox
                      v-else
                      class="selection-bar">
                      <div class="selected—title">已选中 <span class="selected—count">{{ selectList.length }}</span> 项</div>
                      <flexbox class="selection-items-box">
                        <el-button
                          v-for="(item, index) in handleList"
                          :icon="item.icon | wkIconPre"
                          :key="index"
                          type="primary"
                          @click.native="selectionBarClick(item.type)">{{ item.name }}</el-button>
                      </flexbox>
                    </flexbox>
                  </div>
                  <el-button
                    size="medium"
                    type="primary"
                    @click="addEmployees"> 关联员工 </el-button>
                </flexbox>
                <el-table
                  :data="tableData"
                  :height="tableHeight"
                  style="width: 100%"
                  @selection-change="handleRowSelect">
                  <el-table-column type="selection" width="55"/>
                  <el-table-column
                    v-for="(item, index) in tableList"
                    :prop="item.field"
                    :width="item.width"
                    :label="item.label"
                    :key="index"
                    :formatter="tableFormatter"
                    show-overflow-tooltip/>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.card == 0" type="text" class="el-button--primity button-handle" @click="setCard(scope.row)">设为用户默认访问名片</el-button>
                      <el-button v-else type="text" class="el-button--warning button-handle" @click="cancelCard(scope.row)">移除用户默认访问名片</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="p-contianer">
                  <el-pagination
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size.sync="pageSize"
                    :total="total"
                    class="p-bar"
                    background
                    layout="prev, pager, next, sizes, total, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"/>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="名片海报"
              name="poster"
              lazy>
              <poster/>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div v-else-if="menuActive === 'web'" class="content-box">
          <el-tabs v-model="menuChildIndex">
            <el-tab-pane
              label="设置官网"
              name="setting"
              lazy>
              <official-website :show="menuActive === 'web'"/>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
      <!-- 关联员工 -->
      <relate-empoyee
        :visible.sync="relateEmpoyeeShow"
        @save="employeesSave"/>
    </template>
    <template v-else-if="hasAuth != null">
      <div class="auth-content">
        <iframe
          ref="authIframe"
          :src="authUrl"
          frameborder="0"
          @load="iframeLoad"/>
        <div class="auth-bar">
          <el-button
            type="primary"
            @click="getAuth">已授权</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  visitingCardSetSaveCardAPI,
  visitingCardDeleteByUserIdAPI,
  wechatPreauthcodeAPI,
  visitingCardCheckAuthAPI,
  visitingCardRelieveAPI,
  systemUserMiNiListAPI } from '@/api/systemManagement/poster'

import RelateEmpoyee from './components/relateEmpoyee'
import OfficialWebsite from './components/officialWebsite'
import Reminder from '@/components/reminder'
import XrHeader from '@/components/xr-header'
import Poster from './components/poster'

export default {
  components: {
    RelateEmpoyee,
    Reminder,
    Poster,
    OfficialWebsite,
    XrHeader
  },

  data() {
    return {
      hasAuth: null,
      loading: false,
      leftList: [
        { type: 'card', name: '名片', icon: 'wk wk-contacts' },
        { type: 'web', name: '官网', icon: 'wk wk-my-task' }
      ],
      menuActive: 'card',
      handleList: [
        { name: '删除', type: 'delete', icon: 'delete' }
      ],
      showReminder: true,
      selectList: [],
      authUrl: '',
      search: '',
      tableData: [], // 与角色关联的员工
      tableHeight: document.documentElement.clientHeight - 305, // 表的高度
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,
      tableList: [
        { label: '员工姓名', field: 'realname', width: '115px' },
        { label: '手机号', field: 'mobile', width: '115px' },
        { label: '性别', field: 'sex', width: '115px' },
        { label: '部门', field: 'deptName', width: '115px' },
        { label: '岗位', field: 'post', width: '115px' }
      ],
      applet: {}, // 操作角色的框 关联的信息
      appletList: [], // 角色列表 list属性 是信息

      menuChildIndex: 'user', // 角色员工  角色权限 切换 默认左边
      relateEmpoyeeShow: false,
      appletMenuLoading: false,
      userLoading: false
    }
  },

  computed: {
    showSearch() {
      return this.menuActive === 'card' && this.menuChildIndex == 'user'
    }
  },

  watch: {

  },

  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 305
    }
    this.getAuth()
  },
  methods: {
    /**
     * 获取是否授权
     */
    getAuth() {
      this.loading = true
      visitingCardCheckAuthAPI().then(res => {
        this.hasAuth = res.auth
        if (this.hasAuth) {
          this.loading = false
          this.getUserList()
        } else {
          this.$message.error('请先扫码授权')
          this.getAuthUrl()
        }
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * iframe加载
     */
    iframeLoad(data) {
      if (this.$refs.authIframe.src) {
        this.loading = false
      }
    },

    /**
     * 展示class
     */
    appletaMenuSelect(val) {
      this.menuActive = val.type
      this.menuChildIndex = this.menuActive == 'web' ? 'setting' : 'user'
    },

    /**
     * 获取授权
     */
    getAuthUrl() {
      if (!this.authUrl) {
        this.loading = true
        wechatPreauthcodeAPI().then(res => {
          this.authUrl = res.data
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },

    /**
     * 关联员工
     */
    addEmployees() {
      this.relateEmpoyeeShow = true
    },

    /**
     * 角色说明文字
     */
    getReminderContent() {
      return '关联的员工，可在个人中心查看属于自己的名片小程序码'
    },

    /**
     * 表头勾选
     */
    handleRowSelect(val) {
      if (val.length > 0) {
        this.showReminder = false
        this.selectList = val
      } else {
        this.showReminder = true
        this.selectList = []
      }
    },

    /**
     * 表头操作
     */
    selectionBarClick(type) {
      this.$confirm('确定删除选中的关联员工？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userLoading = true
          visitingCardRelieveAPI(this.selectList.map(item => {
            return item.userId
          })).then(res => {
            this.$message.success('删除成功')
            this.userLoading = false
            this.getUserList()
          }).catch(() => {
            this.userLoading = false
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    /**
     * 搜索操作
     */
    searchClick(search) {
      this.search = search
      this.refreshUserList()
    },

    /**
     * 关联员工确定
     */
    employeesSave(val) {
      this.relateEmpoyeeShow = false
      this.refreshUserList()
    },

    /**
     * 员工列表
     */
    getUserList() {
      this.userLoading = true
      const params = {}
      if (this.search) {
        params.search = this.search
      }
      systemUserMiNiListAPI({
        ...params,
        page: this.currentPage,
        limit: this.pageSize,
        realname: this.searchInput
      })
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.totalRow
          this.userLoading = false
        })
        .catch(() => {
          this.userLoading = false
        })
    },

    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.refreshUserList()
    },

    /**
     * 更改当前页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },

    /**
     * 刷新员工列表
     */
    refreshUserList() {
      this.currentPage = 1
      this.getUserList()
    },

    /**
     * 设为用户默认展示图片
     */
    setCard(row) {
      this.userLoading = true
      visitingCardSetSaveCardAPI({
        userId: row.userId
      }).then(res => {
        this.userLoading = false
        this.$message.success('操作成功')
        row.card = 1
      }).catch(() => {
        this.userLoading = false
      })
    },

    /**
     * 移出默认
     */
    cancelCard(row) {
      this.userLoading = true
      visitingCardDeleteByUserIdAPI({ userId: row.userId }).then(res => {
        this.userLoading = false
        this.$message.success('移除成功')
        row.card = 0
      }).catch(() => {
        this.userLoading = false
      })
    },

    /**
     * 列表信息格式化
     */
    tableFormatter(row, column) {
      if (column.property == 'sex') {
        return { 1: '男', 2: '女' }[row.sex]
      }
      return row[column.property]
    }
  }
}
</script>

<style lang="scss" scoped>
.applet-authorization {
  padding: 0 15px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.applet-box {
  height: calc(100% - 60px);
  overflow: hidden;
  position: relative;
}
.appleta-name {
    padding-left: 5px;
}
.nav {
  width: 280px;
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.nav__hd {
  position: relative;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid $xr-border-line-color;

  .el-button {
    position: absolute;
    top: 10px;
    right: 15px;
  }
}

.content-box {
  background: #fff;
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  margin-left: 295px;
  height: 100%;
  overflow: hidden;
  padding-top: 10px;
  position: relative;
}
.content-table {
  position: relative;
  overflow: hidden;
}
.content-table > .el-button {
  float: right;
  margin-bottom: 15px;
  margin-right: 30px;
}
.content-box .content-table-span {
  color: #2362FB;
  margin-left: 5px;
  cursor: pointer;
}

.content-table-header {
  padding: 0 15px 5px;
  .content-table-header-reminder {
    flex: 1;
    margin-right: 5px;
  }
}

/* 权限管理 */
.jurisdiction-content {
  height: calc(100% - 61px);
  position: relative;
  overflow: hidden;
}
.content-left {
  height: 100%;
  margin-right: 250px;
  overflow: hidden;
}
.content-right {
  width: 250px;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
}
.jurisdiction-box {
  padding-bottom: 15px;
  height: calc(100% - 61px);
  overflow: hidden;
  position: relative;
}

.applet-authorization /deep/ .el-tree-node__expand-icon {
  display: none;
}
.data-radio {
  padding: 5px 30px;
}
.data-radio .el-radio {
  display: block;
  margin: 20px 0;
}
/* 新建角色 */
.applet-nav-box {
  line-height: 30px;
  overflow-y: auto;
  padding: 20px 0;
  height: calc(100% - 50px);
}
// 菜单
.menu-item {
  color: #333;
  font-size: 13px;
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  position: relative;
  .icon-close {
    position: absolute;
    top: 0;
    right: 8px;
    z-index: 1;
    display: none;
  }
}

.menu-item:hover,
.menu-item.is-select {
  background-color: $xr--background-color-base;
}

.menu-item:hover::before,
.menu-item.is-select::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 2px;
  background-color: #5383ed;
}

.applet-nav-box .menu-item:hover .icon-close {
  display: block;
  float: right;
}

/** 分页布局 */
.p-contianer {
  position: relative;
  background-color: white;
  height: 44px;
  .p-bar {
    float: right;
    margin: 5px 100px 0 0;
    font-size: 14px !important;
  }
}

.el-tabs /deep/ .el-tabs__header {
  padding: 0 17px;
  margin: 0 0 15px !important;
}

.el-tabs /deep/ .el-tabs__item {
  font-size: 13px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.el-tabs {
    height: 100%;
    /deep/ .el-tabs__content {
        height: calc(100% - 55px);
    }

    /deep/ .el-tab-pane {
      height: 100%;
    }
}

/** 勾选操作 */
.selection-bar {
  font-size: 12px;
  height: 30px;
  padding: 0 20px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    color: #333;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}
.selection-items-box {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;

  .el-button {
    color: #666;
    background-color: $xr--background-color-base;
    border-color: $xr--background-color-base;
    font-size: 12px;
    height: 28px;
    border-radius: 14px;
    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-button + .el-button {
    margin-left: 15px;
  }
}

.el-button--warning {
  /deep/ span {
    color: red;
  }
}

.auth-content {
  height: 100%;
  iframe {
    width: calc(100% - 20px);
    height: calc(100% - 80px);
    margin: 20px;
  }

  .auth-bar {
    text-align: center;
  }
}

// 操作按钮
.button-handle {
  font-size: 13px;
}
@import '../styles/table.scss';
</style>
