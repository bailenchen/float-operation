<template>
  <div class="main">
    <email-list-head
      :search.sync="search"
      :email-type="emailType"
      :title="sideNavTitle"
      placeholder="搜索邮件"
      @on-search="emailSearch">
      <template>
        <div v-if="emailType == 'receive'" slot="header" class="record-receive">
          （收件箱有<span class="blue-font">{{ receiveNumber }}</span>封未读）
          <span class="blue-font">全部标为已读</span>
        </div>
      </template>
    </email-list-head>
    <div class="email-container">
      <email-table-head
        ref="crmTableHead"
        :operat-list="tableHeadList"
        :email-type="emailType"
        @change="operatList"/>
      <div v-loading="loading" class="parent-table">
        <div class="head-table" style="width:100%">
          <table border="0px" cellpadding="0px" cellspacing="0" class="table-head">
            <thead>
              <tr class="table-row head-bg">
                <th class="tb-head">
                  <div style="width:55px">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @click="1" @change="handleCheckedAll"/>
                  </div>
                </th>
                <th class="tb-head">
                  <div style="width:55px">
                    <i
                      class="wk wk-focus-on"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                  </div>
                </th>
                <th class="tb-head">
                  <div style="width:55px">
                    <i
                      class="wk wk-email"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                  </div>
                </th>
                <th class="tb-head" width="55px">
                  <div style="width:55px">
                    <i
                      class="el-icon-paperclip"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                  </div>
                </th>
                <th class="tb-h-align head-font-color sent-column">
                  <div ref="sent" class="sent-column" style="width:100%">
                    发件人
                  </div>
                </th>
                <th class="tb-h-align head-font-color subject-column">
                  <div ref="theme" class="subject-column" style="width:100%">
                    主题
                  </div>
                </th>
                <th class="tb-h-align head-font-color end-column time-column">
                  <div ref="time" class="time-column" style="width:100%">
                    时间
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div :style="{ width: tableWidth + 'px', height: tableHeight + 'px' }" :class="{ 'empty-list': lists.length == 0 }" class="table-container">

          <template v-for="(item, index) in lists">
            <div v-if="item.first" :key="`title${index}`" class="row-title block-title">
              <div class="cell">
                {{ getEmailDateSectionTitle(item) }}<span class="number">（{{ item.numIndex }}&nbsp;封）</span>
              </div>
            </div>
            <table :key="`row${index}`" :class="{ 'rowbg': !Number.isInteger(item.bgIndex/2) }" border="0px" cellpadding="0px" cellspacing="0">
              <tbody>
                <tr class="table-row">
                  <td class="tb-head first-cell">
                    <div style="width:55px">
                      <el-checkbox v-model="item.checked" @change="handleCheckedPart"/>
                    </div>
                  </td>
                  <td class="tb-head">
                    <div style="width:55px;" @click="handleStar(item)">
                      <i
                        :class="{ 'star': item.isStar }"
                        class="wk wk-focus-on"
                        style="cursor: pointer; color: #9DA9C2;"/>
                    </div>
                  </td>
                  <td class="tb-head">
                    <div style="width:55px" @click="handleRead(item)">
                      <i
                        :class="{ 'read': item.isRead }"
                        class="wk wk-email"
                        style="cursor: pointer; color: #9DA9C2;"/>
                    </div>
                  </td>
                  <td class="tb-head">
                    <div style="width:55px">
                      <i
                        v-if="item.fileList.length > 0"
                        class="el-icon-paperclip"
                        style="cursor: pointer; color: #9DA9C2;"/>
                    </div>
                  </td>
                  <td class="tb-h-align font-color sent-column">
                    <div :title="item.sendUser" :style="{ width: calcCellWidth('sent') + 'px' }" class="sent-column1" @click.stop="clickRow(item, index)">
                      {{ item.sendUser }}
                      <!-- :style="{ width: calcCellWidth('sent') + 'px' }" -->
                    </div>
                  </td>
                  <td class="tb-h-align font-color subject-column">
                    <div :title="item.theme" :style="{ width: calcCellWidth('theme') + 'px' }" class="subject-column1">
                      {{ item.theme }}
                      <!-- :style="{ width: calcCellWidth('theme') + 'px' }" -->
                    </div>
                  </td>
                  <td class="tb-h-align font-color end-column time-column">
                    <div :style="{ width: calcCellWidth('time') + 'px' }" class="time-column1">
                      {{ item.sendDate }}
                      <!-- :style="{ width: calcCellWidth('time') + 'px' }" -->
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <span v-if="lists.length == 0" class="no-data">暂无数据</span>
        </div>
      </div>
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
    <!-- 相关详情页面 -->
    <email-detail
      :visible.sync="showDview"
      :email-type="emailType"
      :row-item="rowItem"
      class="d-view"
      @close="hideView"
      @update-list="refreshList"/>

  </div>
</template>

<script>
import { emailNumAPI } from '@/api/email/email'

import EmailDetail from './EmailDetail'

import table from './mixins/table'

export default {
  // 列表
  name: 'Index',
  components: {
    EmailDetail
  },
  // props: {},
  mixins: [table],
  data() {
    return {
      // 展示加载loading
      loading: false,
      receiveNumber: 0, // 收件箱数量
      emailType: 'receive',
      lists: [],
      showDview: false,
      rowObj: '',
      rowIndex: '',
      rowItem: {},
      tableWidth: ''
      // emailDate: '12' // 用来比较邮箱日期，是否显示信封数标题
    }
  },
  computed: {
    calcCellWidth() {
      return function(cell) {
        console.log(this.$refs.sent.offsetWidth, 'ff')
        if (cell == 'sent') {
          return this.$refs.sent.offsetWidth - 1
        } else if (cell == 'theme') {
          return this.$refs.theme.offsetWidth - 1
        } else if (cell == 'time') {
          return this.$refs.time.offsetWidth - 1
        }
      }
    },
    sideNavTitle() {
      return {
        receive: '收件箱',
        star: '星标邮件',
        draft: '草稿箱',
        sent: '已发送',
        deleted: '已删除',
        spam: '垃圾邮件'
      }[this.emailType]
    },
    tableHeadList() {
      const handleInfos = {
        star: {
          name: '标为星标',
          type: 'star',
          icon: 'transfer'
        },
        cancelStar: {
          name: '取消星标',
          type: 'cancelStar',
          icon: 'transfer'
        },
        read: {
          name: '标为已读',
          type: 'read',
          icon: 'transform'
        },
        noRead: {
          name: '标为未读',
          type: 'noRead',
          icon: 'transform'
        },
        delete: {
          name: '删除邮件',
          type: 'delete',
          icon: 'transform'
        },
        rootDel: {
          name: '彻底删除',
          type: 'rootDel',
          icon: 'export'
        },
        // newEmail: {
        //   name: '标为新邮件',
        //   type: 'newEmail',
        //   icon: 'delete'
        // },
        draft: {
          name: '草稿',
          type: 'draft',
          icon: 'seas'
        }
      }
      return {
        receive: [
          handleInfos['star'], handleInfos['cancelStar'], handleInfos['read'],
          handleInfos['noRead'], handleInfos['delete'], handleInfos['rootDel']
        ],
        star: [],
        draft: [],
        sent: [],
        deleted: [],
        spam: []
      }[this.emailType]
    }
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.tableWidth = document.getElementsByClassName('table-head')[0].offsetWidth
    })
    window.onresize = () => {
      return (() => {
        this.tableWidth = document.getElementsByClassName('table-head')[0].offsetWidth
      })()
    }
  },

  beforeDestroy() {},

  created() {
    this.emailType = this.$route.params.type
    this.queryEmailNum()
    this.getEmailList()
    console.log(this.emailType, this.$route, 'leixing')
  },

  beforeRouteUpdate(to, from, next) {
    this.emailType = to.params.type
    console.log(this.emailType, 'lx')
    this.$refs.crmTableHead.headSelectionChange([])
    if (this.emailType != 'writeLetter') {
      this.lists = []
      if (this.emailType == 'receive') {
        this.queryEmailNum()
      }
      this.getEmailList()
    }
    next()
  },

  methods: {
    /**
     * 数量查询
     */
    queryEmailNum() {
      emailNumAPI().then((res) => {
        this.receiveNumber = res.data.unreadCount
        console.log('数量差', res)
      }).catch(() => {

      })
    },

    /**
     * 点击每行
     */
    clickRow(item, index) {
      this.showDview = true
      item.page = this.currentPage
      item.limit = this.pageSize
      item.search = this.search
      this.rowItem = item
      console.log(item, index, 'item')
    },

    /**
     * 关闭详情
     */
    hideView() {
      this.showDview = false
    },

    /**
     * 操作勾选的列表
     */
    operatList(type) {
      var listapi = {
        star: 'FLAGGED',
        cancelStar: 'FLAGGED',
        read: 'SEEN',
        noRead: 'SEEN',
        delete: 'LOGICDELETE',
        rootDel: 'DELETED'
      }[type]
      if (type == 'star' || type == 'read' || type == 'delete' || type == 'rootDel') {
        var isdo = true
      } else {
        var isdo = false
      }
      this.idLists = []
      for (let index = 0; index < this.checkLists.length; index++) {
        const element = this.checkLists[index]
        this.idLists.push(element.messageId)
      }

      this.isConfirm(type, listapi, isdo)
      console.log(type, 'leixing')
    },

    /**
     * 删除后刷新列表
     */
    refreshList() {
      this.showDview = false
      this.getEmailList()
    }


  }
}
</script>

<style lang="scss" scoped>
@import './styles/table.scss';

.record-receive {
  display: inline-block;
  color: #666666;
  font-size: 14px;
  .blue-font {
    color: #2362FB;
  }
}

.el-main {
  overflow: hidden !important;
}

.no-data {
  line-height: 60px;
  width: 100%;
  color: #999;
  text-align: center;
}

.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.table-container {
  width: 100%;
  min-width: 1100px;
  overflow-y: auto;
  overflow-x: hidden;
}

.parent-table {
  min-width: 1100px;
  overflow-x: auto;
}

.row-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: block;
  text-align: left;
  font-size: 12px;
  color: #333333;
  .number {
    color: #2362FB;
  }
}

.first-cell {
   width: 55px !important;
   box-sizing: border-box;
}

.cell {
  margin-left: 16px;
}

.table-row {
  height: 40px;
  line-height: 40px;
}

.head-bg {
  background: rgb(246, 248, 250);
}

.head-bg th {
  border-right: 1px solid #E6E6E6;
  border-bottom: 1px solid #E6E6E6;
}

.block-title {
  background: #F5F5F5;
}

// 表
.tb-head {
  text-align: center;
}

tr > td {
  height: 40px;
}

.end-column {
  border-right: 0 !important;
}

.head-font-color {
  font-weight: 600;
  font-size: 12px;
  color: #333333;
}

.font-color {
  font-size: 12px;
  color: #666666;
}

.tb-h-align {
  text-align: left;
  padding-left: 10px;
}

.rowbg {
  background: rgba(246, 248, 250, 1);
}

.star:before {
  color: #FAC23D;
}

.read:before {
  color: #2362FB;
}

.sent-column, .subject-column, .time-column {
  text-align: left;
}

.sent-column {
  width: 14%;
  min-width: 154px;
}

.subject-column {
  width: 70%;
  min-width: 770px;
}

.time-column {
  width: 16%;
  min-width: 176px;
}

.sent-column1, .subject-column1, .time-column1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sent-column1 {
  color: #2362FB;
  cursor: pointer;
}

</style>
