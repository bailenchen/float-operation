<template>
  <div
    v-show="visible"
    class="full-container">
    <slide-view
      v-if="showDetail"
      :show-close="false"
      class="d-view"
      @close="hiddenView">
      <div class="sm-main">
        <div class="sm-main__hd">
          <span class="title">{{ title }}</span>
          <el-button
            v-if="permissionSave"
            icon="el-icon-plus"
            class="notice-btn"
            type="text"
            @click="createNotice">新建公告</el-button>
        </div>

        <div class="menu">
          <el-badge
            v-for="(item, index) in menuList"
            :key="index"
            :value="unreadNums[item.countKey]"
            :hidden="!unreadNums[item.countKey] || unreadNums[item.countKey] == 0"
            :max="99">
            <el-button
              :class="{'is-current': menuLabel == item.label}"
              type="primary"
              @click.native="menuClick(item.label)">{{ item.name }}</el-button>
          </el-badge>
        </div>

        <div class="sm-main__bd">
          <div
            v-infinite-scroll="getList"
            infinite-scroll-disabled="scrollDisabled">
            <message-cell
              v-for="(item, index) in list"
              :key="index"
              :data="item"
              :data-index="index"
              @detail="checkCRMDetail"
              @download="downloadError"
              @read="readMessageClick"/>
          </div>
          <p
            v-if="loading"
            class="scroll-bottom-tips">加载中...</p>
          <p
            v-if="noMore"
            class="scroll-bottom-tips">没有更多了</p>
        </div>

        <div class="sm-main__ft">
          <el-button
            icon="el-icon-check"
            type="text"
            @click="allMarkDoneClick">全部标记为已读</el-button>
        </div>
      </div>
    </slide-view>

    <new-dialog
      v-if="announcementAddShow"
      @onSubmit="announcementSubmiteSuccess"
      @close="announcementAddShow = false" />

    <!-- CRM详情 -->
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="relationCrmType"
      :id="relationID" />
  </div>
</template>

<script>
import {
  systemMessageListAPI,
  systemMessageReadAPI,
  systemMessageReadAllAPI } from '@/api/common'
import {
  crmDownImportErrorAPI
} from '@/api/customermanagement/common'

import SlideView from '@/components/SlideView'
import NewDialog from '@/views/OAManagement/notice/newDialog'
import MessageCell from './MessageCell'

import { getMaxIndex } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  // 导航头部系统消息
  name: 'SystemMessage',
  components: {
    SlideView,
    NewDialog,
    MessageCell,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    unreadNums: Object
  },
  data() {
    return {
      showDetail: false,
      // 1 任务 2 日志 3 oa审批 4公告 5 日程 6 客户管理
      menuLabel: 'all',
      menuList: [{
        name: '全部',
        label: 'all',
        countKey: 'allCount'
      }, {
        name: '公告',
        label: 4,
        countKey: 'announceCount'
      }, {
        name: '审批',
        label: 3,
        countKey: 'examineCount'
      }, {
        name: '任务',
        label: 1,
        countKey: 'taskCount'
      }, {
        name: '日志',
        label: 2,
        countKey: 'logCount'
      }, {
        name: '客户管理',
        label: 6,
        countKey: 'crmCount'
      }],

      // 公告
      announcementAddShow: false,

      // 列表
      list: [],
      loading: false,
      noMore: false,
      page: 1,

      // CRM详情
      showFullDetail: false, // 查看相关客户管理详情
      relationID: '', // 相关ID参数
      relationCrmType: '' // 相关类型
    }
  },
  computed: {
    ...mapGetters(['oa']),
    permissionSave() {
      return this.oa && this.oa.announcement && this.oa.announcement.save
    },
    title() {
      return this.unreadNums.allCunt > 0 ? `通知（${this.unreadNums.allCunt}）` : '通知'
    },

    scrollDisabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible(val) {
      this.showDetail = val
      if (val) {
        document.body.appendChild(this.$el)
        this.$el.addEventListener('click', this.handleDocumentClick, false)
        this.$el.style.zIndex = getMaxIndex()
        this.refreshList()
      }
    },
    showDetail(val) {
      if (!val) {
        setTimeout(() => {
          this.$emit('update:visible', false)
        }, 350)
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.appendChild(this.$el)
      this.$el.addEventListener('click', this.handleDocumentClick, false)
      this.$el.style.zIndex = getMaxIndex()
    }
  },

  beforeDestroy() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
      this.$el.removeEventListener('click', this.handleDocumentClick, false)
    }
  },
  methods: {
    /**
     * 头部
     */

    /**
     * 新建公告
     */
    createNotice() {
      this.announcementAddShow = true
    },

    announcementSubmiteSuccess() {
      this.refreshList()
    },

    /**
     * 身体
     */

    /**
     * 菜单点击
     */
    menuClick(label) {
      this.menuLabel = label
      this.refreshList()
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.list = []
      this.noMore = false
    },

    /**
     * 获取列表
     */
    getList() {
      this.loading = true
      systemMessageListAPI({
        page: this.page,
        limit: 15,
        label: this.menuLabel == 'all' ? '' : this.menuLabel
      })
        .then(res => {
          this.loading = false
          if (!this.noMore) {
            this.list = this.list.concat(res.data.list)
            this.page++
          }
          this.noMore = res.data.lastPage
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },



    /**
     * 查看详情
     */
    checkCRMDetail(type, id) {
      this.relationID = id
      this.relationCrmType = type
      this.showFullDetail = true
    },

    /**
     * 下载错误数据
     */
    downloadError(messageId) {
      crmDownImportErrorAPI({ messageId })
        .then(res => {
          var blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          let fileName = res.headers['content-disposition'].split('filename=')[1]
          fileName = fileName.replace(/\"/g, '')
          downloadElement.download =
            decodeURI(
              fileName
            ) || '' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(() => {
        })
    },

    /**
     * 读取消息
     */
    readMessageClick(messageId, index) {
      systemMessageReadAPI({ messageId })
        .then(res => {
          this.list[index].isRead = 1
          this.$emit('update-count')
        })
        .catch(() => {
        })
    },

    /**
     * 全部标记完成
     */
    allMarkDoneClick() {
      systemMessageReadAllAPI()
        .then(res => {
          this.list.forEach(item => {
            item.isRead = 1
          })
          this.$emit('update-count')
        })
        .catch(() => {
        })
    },

    hiddenView() {
      this.showDetail = false
    },

    handleDocumentClick(e) {
      e.stopPropagation()
      if (this.$el == e.target) {
        this.showDetail = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.full-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.d-view {
  position: fixed;
  width: 500px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background-color: white;
  /deep/ .el-card__body {
    height: 100%;
  }
}

.sm-main {
  height: 100%;
  position: relative;

  &__hd {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #333;
    background-color: #f7f8fa;

    .title {
      font-weight: 600;
    }

    .notice-btn {
      float: right;
      margin-top: 10px;
    }
  }

  &__bd {
    height: calc(100% - 110px);
    overflow-y: auto;
  }

  &__ft {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 50px;
    background-color: #f7f8fa;
    text-align: center;
    line-height: 50px;
  }
}

// 菜单
.menu {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;
  height: 60px;
  // line-height: 60px;
  border-top: 1px solid $xr-border-color-base;
  // border-bottom: 1px solid $xr-border-color-base;

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

  .el-button--primary.is-current,
  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-badge {
    margin-top: 15px;
  }

  .el-badge + .el-badge {
    margin-left: 15px;
  }
}


.scroll-bottom-tips {
  margin: 15px 0 65px;
}
</style>
