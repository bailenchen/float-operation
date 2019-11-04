<template>
  <div class="applet-authorization">
    <xr-header
      ref="xrHeader"
      :show-search="false"
      label="小程序管理"
      icon-class="wk wk-contacts"
      icon-color="#19B5F6"/>
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
            :class="{'is-select' : item.id == appletActive.id}"
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
      <div class="content-box">
        <el-tabs v-model="mainMenuIndex">
          <el-tab-pane
            v-if="appletActive.id === 1"
            label="员工信息"
            name="user">
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
                  <el-input
                    v-model="search"
                    placeholder="请输入内容"
                    class="search"
                    @keyup.enter.native="searchClick">
                    <el-button
                      slot="append"
                      type="primary"
                      @click.native="searchClick">搜索</el-button>
                  </el-input>
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
                  show-overflow-tooltip/>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <span class="el-icon-edit content-table-span"
                      @click="editBtn(scope.row)"></span> -->
                    <el-button type="text" class="el-button--primity">设为用户默认访问名片</el-button>
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
            v-if="appletActive.id === 1"
            label="名片海报"
            name="poster">
            <poster/>
          </el-tab-pane>
          <el-tab-pane
            v-if="appletActive.id === 2"
            label="设置官网"
            name="setting">
            <official-website/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 关联员工 -->
    <relate-empoyee
      :visible.sync="relateEmpoyeeShow"
      :role-id="roleId"
      @save="employeesSave"/>
  </div>
</template>

<script>
import { usersList } from '@/api/common'
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
      leftList: [
        { id: 1, name: '名片', icon: 'wk wk-contacts' },
        { id: 2, name: '官网', icon: 'wk wk-my-task' }
      ],
      appletActive: { id: 1, name: '名片', icon: 'wk wk-contacts' },
      handleList: [
        { name: '导出', type: 'export', icon: 'export' },
        { name: '删除', type: 'delete', icon: 'delete' }
      ],
      showReminder: true,
      selectList: [],
      search: '',
      roleId: 343,
      tableData: [{}], // 与角色关联的员工
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

      mainMenuIndex: 'user', // 角色员工  角色权限 切换 默认左边
      relateEmpoyeeShow: false,
      appletMenuLoading: false,
      userLoading: false
    }
  },

  computed: {
  },

  watch: {},

  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 305
    }
    this.getUserList()
  },
  methods: {
    /** 展示class */
    appletaMenuSelect(val) {
      this.appletActive = val
      if (val.id === 2) {
        this.mainMenuIndex = 'setting'
      } else if (val.id === 1) {
        this.mainMenuIndex = 'user'
      }
    },
    /** 关联员工 */
    addEmployees() {
      this.relateEmpoyeeShow = true
    },
    /**
     * 角色说明文字
     */
    getReminderContent() {
      return '关联的员工，可在个人中心查看属于自己的名片小程序码'
    },
    /** 表头勾选 */
    handleRowSelect(val) {
      if (val.length > 0) {
        this.showReminder = false
        this.selectList = val
      } else {
        this.showReminder = true
        this.selectList = []
      }
    },
    /** 表头操作 */
    selectionBarClick(type) {},
    /** 搜索操作 */
    searchClick() {},
    /**
     * 关联员工确定
     */
    employeesSave(val) {
      this.relateEmpoyeeShow = false
      this.getUserList()
    },
    /**
     * 员工列表
     */
    getUserList() {
      this.userLoading = true
      usersList({
        page: this.currentPage,
        limit: this.pageSize,
        roleId: 343,
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
.title {
  font-size: 18px;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  margin: 10px 0;
  color: #333;
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
.jurisdiction-content-checkbox {
  border-right: 1px dashed $xr-border-line-color;
  height: calc(100% - 47px);
  overflow-y: scroll;
  padding: 20px;
}
.jurisdiction-content-checkbox
  .el-tree
  /deep/
  .el-tree-node
  > .el-tree-node__content {
  margin-bottom: 20px;
  width: 150px;
}
.jurisdiction-content-checkbox /deep/ .el-tree .el-tree-node {
  white-space: inherit;
  margin-bottom: 5px;
}
.jurisdiction-content-checkbox
  /deep/
  .el-tree
  > .el-tree-node
  > .el-tree-node__children
  > .is-expanded
  > .el-tree-node__children
  > .is-expanded {
  display: inline-block;
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
.input-applet {
  padding: 10px 0 20px;
  width: 100%;
}
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
.jurisdiction-edit {
  text-align: right;
  padding: 10px 30px;
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 3;
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

// .el-tabs /deep/ .el-tabs__nav-wrap::after {
//   display: none !important;
// }

.el-tabs /deep/ .el-tabs__header {
  padding: 0 17px;
  margin: 0 0 15px !important;
}

.el-tabs /deep/ .el-tabs__item {
  font-size: 13px !important;
  height: 40px !important;
  line-height: 40px !important;
}

.node-label {
  font-weight: bold;
  font-size: 15px;
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
.search {
    width: 300px;
    position: absolute;
    top: 0px;
    left: 50%;
}
/deep/.el-input-group__append {
    color: #FFFFFF !important;
    background-color: #2362FB !important;
    border-color: #2362FB !important;
}
@import '../styles/table.scss';
</style>
