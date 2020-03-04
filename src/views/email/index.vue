<template>
  <div class="main">
    <email-list-head
      :search.sync="search"
      :email-type="emailType"
      :title="sideNavTitle"
      :is-no-read="isNoRead"
      placeholder="搜索邮件"
      @goBack="goBack"
      @on-search="emailSearch">
      <template v-if="!isNoRead">
        <div slot="header" class="record-receive">
          （共有<span>{{ allNumber }}</span>封邮件<span v-if="receiveNumber">，其中<span class="blue-font" @click="noRead"> 未读邮件 </span>{{ receiveNumber }}封</span>）
          <!-- <el-button type="text" class="blue-font" @click="allRead">全部标为已读</el-button> -->
        </div>
      </template>
    </email-list-head>
    <div class="email-container">
      <email-table-head
        ref="crmTableHead"
        :email-go-to="emailGoTo"
        :operat-list="tableHeadList"
        :email-type="emailType"
        @change="operatList"/>
      <div v-loading="loading" class="parent-table">
        <div class="head-table" style="width:100%">
          <table border="0px" cellpadding="0px" cellspacing="0" class="table-head">
            <thead>
              <tr class="table-row head-bg">
                <th class="tb-head" style="width:55px">
                  <div >
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckedAll"/>
                  </div>
                </th>

                <th class="tb-email-head" style="width:57px">
                  <div >
                    <i
                      class="wk wk-email"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                    <i
                      class="el-icon-paperclip"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                  </div>
                </th>
                <!-- <th class="tb-head" width="55px">
                  <div style="width:55px">
                    <i
                      class="el-icon-paperclip"
                      style="cursor: not-allowed; color: #9DA9C2;"/>
                  </div>
                </th> -->
                <th class="tb-h-align head-font-color " style="width:150px">
                  <div ref="sent">
                    <b>{{ isSender ? '收件人' : '发件人' }}</b>
                  </div>
                </th>
                <th class="tb-h-align head-font-color">
                  <div ref="theme">
                    <b>主题</b>

                  </div>
                </th>
                <th class="tb-h-align head-font-color " style="width:100px">
                  <div ref="time">
                    <b>时间</b>
                  </div>
                </th>

                <th class="end-column" style="width:55px">
                  <div >
                    <i
                      class="el-icon-star-off"
                      style="cursor: not-allowed;"/>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div :style="{ height: tableHeight + 'px' }" :class="{ 'empty-list':lists && lists.length == 0 }" class="table-container">

          <template v-for="(item, index) in lists">
            <div v-if="item.first" :key="`title${index}`" class="row-title block-title">
              <div class="cell">
                {{ getEmailDateSectionTitle(item) }}<span class="number" @click="selectCurrent(index, item.numIndex)">（{{ item.numIndex }}&nbsp;封）</span>
              </div>
            </div>
            <table
              :key="`row${index}`"
              :style="{backgroundColor: item.checked ? '#e9efff': '', width: `${tableWidth}px`}"
              :class="{ 'rowbg': !Number.isInteger(item.bgIndex/2), 'hoverbg': index === bgIndex,'un-read': !item.isRead }"
              class="content-table"
              border="0px"
              cellpadding="0px"
              cellspacing="0"
              @mouseenter="bgIndex = index"
              @mouseleave="bgIndex = -1">
              <tbody>
                <tr class="table-row">
                  <td class="tb-head first-cell" style="width:55px">
                    <div>
                      <el-checkbox v-model="item.checked" @change="handleCheckedPart"/>
                    </div>
                  </td>

                  <td class="tb-email-head" style="width:57px;">
                    <div @click="handleRead(item)">
                      <i
                        :class="['wk', item.isRead ? 'wk-open-email' : 'wk-email']"
                        :style="{ color: item.isRead ? '#9DA9C2' : '#E69900' }"
                        style="cursor: pointer;"/>
                      <i
                        v-if="item.fileNum && item.fileNum > 0"
                        class="el-icon-paperclip"
                        style="cursor: pointer; color: #9DA9C2;"/>
                    </div>
                  </td>
                  <!-- <td class="tb-head">
                    <div style="width:55px">
                      <i
                        v-if="item.fileList && item.fileList.length > 0"
                        class="el-icon-paperclip"
                        style="cursor: pointer; color: #E69900;"/>
                    </div>
                  </td> -->
                  <td class="tb-h-align font-color" style="width:150px">
                    <div
                      class="text-one-line"
                      style="cursor: pointer;"
                      @click.stop="clickRow(item, index)">
                      <el-popover
                        v-if="emailType !== 'goTo'"
                        :open-delay="1000"
                        placement="bottom"
                        title=""
                        width="300"
                        popper-class="no-padding-popover"
                        trigger="hover">
                        <flexbox class="sender_pover">
                          <div class="user_img">
                            {{ item.handleSender.slice(-2) }}
                          </div>

                          <div class="sender_msg">
                            <div>{{ item.handleSender }}</div>
                            <div class="sender_text">{{ isSender ? item.receiptEmails : item.senderEmail }}</div>
                          </div>

                          <el-button type="text" @click="getDealingsEmail(item.handleSender, item)">往来邮件</el-button>
                        </flexbox>
                        <span slot="reference"> {{ item.handleSender }}</span>
                      </el-popover>
                      <div v-else>{{ item.handleSender }}</div>
                    </div>
                  </td>
                  <td class="tb-h-align">
                    <div
                      :title="item.theme"
                      class="text-one-line"
                      style="cursor: pointer;"
                      @click.stop="clickRow(item, index)"
                    >
                      <span class="content-theme">{{ item.theme }}</span>
                      <span class="content-detail">&nbsp;-&nbsp;</span>
                      <span class="content-detail" v-html="handlContent(item)"/>
                    </div>
                  </td>
                  <td class="tb-h-align font-color " style="width: 100px;">
                    <div :class="!item.isRead ? 'un-read' : ''">
                      {{ fifterTime(item.createTime) }}
                    </div>
                  </td>

                  <td class="tb-h-align" style="width: 55px;">
                    <div @click="handleStar(item)">
                      <i
                        v-if="item.isStart"
                        class="el-icon-star-on"
                        style="cursor: pointer; color: #FAC23D;font-size: 18px;"/>
                      <i v-else style="cursor: pointer;" class="el-icon-star-off"/>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <span v-if="lists && lists.length == 0" class="no-data">暂无数据</span>
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

import EmailDetail from './EmailDetail'

import table from './mixins/table'
import { mapGetters } from 'vuex'
import { formatTime } from '@/utils'

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
      allNumber: 0, // 收件箱数量
      receiveNumber: 0, // 收件箱未读数量
      emailType: 'receive',
      isNoRead: false, // 未读邮件筛选
      lists: [],
      showDview: false,
      rowObj: '',
      rowIndex: '',
      rowItem: {},
      emailGoTo: '',
      bgIndex: -1,
      refashShow: true, // 页面宽度变化时，表格动态更新
      tableWidth: ''
      // emailDate: '12' // 用来比较邮箱日期，是否显示信封数标题
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'emailNum']),
    isSender() {
      if (this.emailType === 'sent' || this.emailType === 'draft') {
        return true
      }
      return false
    },
    sideNavTitle() {
      return {
        receive: '收件箱',
        star: '星标邮件',
        draft: '草稿箱',
        sent: '已发送',
        deleted: '已删除',
        spam: '垃圾邮件',
        goTo: '往来邮箱'
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
  watch: {
    emailNum: {
      handler(val) {
        this.queryEmailNum()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (document.getElementsByClassName('table-head')[0]) {
        this.tableWidth = document.getElementsByClassName('table-head')[0].offsetWidth
      }
    })
    window.onresize = () => {
      if (document.getElementsByClassName('table-head')[0]) {
        this.tableWidth = document.getElementsByClassName('table-head')[0].offsetWidth
      }
    }
  },

  beforeDestroy() {},

  created() {
    this.emailType = this.$route.params.type
    this.queryEmailNum()
    this.getEmailList()
  },
  beforeRouteUpdate(to, from, next) {
    this.emailType = to.params.type
    this.$refs.crmTableHead.headSelectionChange([])
    this.checkLists = []
    this.isNoRead = false
    if (this.emailType != 'writeLetter') {
      this.lists = []
      if (this.emailType == 'receive') {
        this.queryEmailNum()
        this.emailGoTo = ''
      } else if (to.params.type === 'goTo') {
        this.emailGoTo = to.query.email
      } else {
        this.emailGoTo = ''
      }
      this.getEmailList()
    }
    next()
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.type === 'goTo') {
        vm.emailGoTo = to.query.email
        // 保证页面刷新时，请求正确
        vm.getEmailList()
      } else {
        vm.emailGoTo = ''
      }
    })
  },
  methods: {
    /**
     * 数量查询
     */
    queryEmailNum() {
      if (this.emailType === 'receive') {
        this.receiveNumber = this.emailNum.inBoxUnreadCount
        this.allNumber = this.emailNum.inBoxCount
      } else if (this.emailType === 'star') {
        this.receiveNumber = this.emailNum.starUnreadCount
        this.allNumber = this.emailNum.starCount
      } else if (this.emailType === 'sent') {
        this.receiveNumber = this.emailNum.sendUnreadCount
        this.allNumber = this.emailNum.sendCount
      } else if (this.emailType === 'deleted') {
        this.receiveNumber = this.emailNum.deleteUnreadCount
        this.allNumber = this.emailNum.deleteCount
      } else if (this.emailType === 'spam') {
        this.receiveNumber = this.emailNum.ljUnreadCount
        this.allNumber = this.emailNum.ljCount
      } else {
        // 草稿箱没有未读邮件
        this.allNumber = this.emailNum.draftsCount
      }
    },

    /**
     * 点击每行
     */
    clickRow(item, index) {
      if (this.emailType === 'draft') {
        localStorage.setItem('crm-emailContent', JSON.stringify(item))
        this.$router.push({ path: '/email/index/writeLetter' })
        return
      }

      item.page = this.currentPage
      item.limit = this.pageSize
      item.search = this.search


      this.idLists = [item.id]
      this.rowItem = item
      this.showDview = true
      if (item.isRead == 0) {
        item.isRead = 1
        this.submitMoreHandle(1, 'detail')
      }
    },

    /**
     * 未读邮件
     */
    noRead() {
      this.isNoRead = true
      this.getEmailList()
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
    operatList(type, item) {
      if (type == 'star' || type == 'read' || type == 'delete' || type == 'rootDel') {
        var isdo = true
      } else {
        var isdo = false
      }
      this.idLists = []
      for (let index = 0; index < this.checkLists.length; index++) {
        const element = this.checkLists[index]
        this.idLists.push(element.id)
      }

      this.isConfirm(type, item, isdo)
    },

    /**
     * 删除后刷新列表
     */
    refreshList() {
      this.showDview = false
      this.getEmailList()
    },

    /**
     * 格式化时间
     */
    fifterTime(time) {
      return formatTime(new Date(time))
    },

    /**
     * 处理内容
     */
    handlContent(item) {
      let content = item.content
      content = content.replace(/(\n)/g, '')
      content = content.replace(/(\t)/g, '')
      content = content.replace(/(\r)/g, '')
      content = content.replace(/<\/?[^>]*>/g, '')
      content = content.replace(/(^\s*)|(\s*$)/g, '')
      // content = content.replace(/&nbsp;/ig, '')
      if (content.length > 100) {
        content = content.substring(0, 100)
      }
      return content
    },

    /**
     * 返回收件箱
     */
    goBack() {
      this.isNoRead = false
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
    cursor: pointer;
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
  overflow-y: auto;
  overflow-x: hidden;
}

.row-title {
  width: 100%;
  height: 29px;
  line-height: 29px;
  display: block;
  text-align: left;
  font-size: 12px;
  color: #333333;
  border-bottom: 1px solid #e4e4e4;
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
  cursor: pointer;
}

.table-row {
  height: 29px;
  line-height: 29px;
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
table {
  table-layout: fixed;
  width: 100%;
}

.tb-head {
  text-align: center;
}

.tb-email-head {
  text-align: initial;
  padding: 0 10px;
}

tr > td {
  height: 24px;
}

.end-column {
  border-right: 0 !important;
  padding-left: 9px;
  text-align: left;
}

.head-font-color {
  font-weight: 600;
  font-size: 12px;
  color: #333333;
}

.font-color {
  font-size: 12px;
}

.tb-h-align {
  text-align: left;
  padding-left: 10px;
}

.rowbg {
  background-color: #fafafa;
}

.content-table {
  border-bottom: 1px solid #e4e4e4;
  .content-theme,
  .content-detail {
    font-size: 12px;
    color: #999;
  }

  &.un-read {
    .font-color {
      font-weight: bolder;
      color: #333333 !important;
    }
    .content-theme {
      font-weight: bold;
      color: #333;
    }
    .content-detail {
      font-weight: normal;
      color: #999;
    }
  }
}

.star:before {
  color: #FAC23D;
}

.sender_pover {
  width: 100%;
  height: 80px;
}
.sender_msg {
  margin-left: 20px;
}
.sender_text {
  overflow: hidden;
  color: #999;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 150px;
}
.user_img {
  background-color: #2362FB;
  width: 36px;
  height: 36px;
  text-align: center;
  color: #fff;
  line-height: 36px;
  border-radius: 3px;
  margin-left: 10px;
}

/deep/.el-icon-star-on,.el-icon-star-off {
  display: inline-block;
  vertical-align: middle;
}
/deep/.el-icon-star-on {
 margin-left: -2px;
}
.hoverbg {
  background-color: #e9efff;
}

.wk-open-email {
  font-size: 18px;
}
</style>
