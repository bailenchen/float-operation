<template>
  <div class="log-item">
    <div class="main">
      <div class="user">
        <div
          v-photo="data.createUser"
          v-lazy:background-image="$options.filters.filterUserLazyImg(data.createUser.img)"
          :key="data.createUser.img"
          class="user-img div-photo" />
        <div class="box">
          <div class="username">
            {{ data.realname }}
          </div>
          <div class="time">
            创建日志于 {{ data.createTime }} <!--{{ data.isRead === 1 ? '已读' : '未读' }}-->
          </div>
          <div class="comment-status">
            <span class="icon wk wk-task" />
            <span>{{ getCategory(data.categoryId) }}-{{ data.replyList.length === 0 ? '未点评' : '已点评' }}</span>
            <span v-if="data.replyList.length === 0" class="dot" />
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="data.content" class="content-box">
          <div class="content-title">
            今日工作内容：
          </div>
          <div class="content-text">{{ data.content }}</div>
        </div>
        <div v-if="data.tomorrow" class="content-box">
          <div class="content-title">
            明日工作的内容：
          </div>
          <div class="content-text">{{ data.tomorrow }}</div>
        </div>
        <div v-if="data.question" class="content-box">
          <div class="content-title">
            遇到的问题：
          </div>
          <div class="content-text">{{ data.question }}</div>
        </div>
      </div>

      <picture-list-view
        v-if="data.img.length !== 0"
        :list="data.img" />

      <file-list-view
        v-if="data.file.length !== 0"
        :list="data.file" />

      <div v-if="allDataLen > 0" class="related-list">
        <div class="title">
          <span class="wk wk-tag icon" />
          <span>关联业务({{ allDataLen }})</span>
        </div>
        <!--<related-business :all-data="allData" />-->
        <related-business-list :data="allData" />
      </div>

      <comment-list
        v-if="data.replyList.length > 0"
        :id="data.logId"
        :list="data.replyList" />
    </div>

    <div class="footer">
      <el-dropdown
        trigger="click"
        @command="handleCommand">
        <i class="icon el-icon-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        icon="el-icon-s-comment"
        size="small">
        回复
      </el-button>
    </div>
  </div>
</template>

<script>
// API
import {
  journalDelete,
  journalSetread
} from '@/api/oamanagement/journal'

import PictureListView from '@/components/PictureListView'
import FileListView from '@/components/FileListView'
// import RelatedBusiness from '@/components/RelatedBusiness'
import RelatedBusinessList from '@/components/RelatedBusinessList'
import CommentList from './commentList'

export default {
  name: 'LogItem',
  components: {
    PictureListView,
    FileListView,
    RelatedBusinessList,
    CommentList
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isWaiting: false
    }
  },
  computed: {
    allData() {
      return {
        business: this.data ? this.data.businessList : [],
        contacts: this.data ? this.data.contactsList : [],
        contract: this.data ? this.data.contractList : [],
        customer: this.data ? this.data.customerList : []
      }
    },
    allDataLen() {
      let res = 0
      if (!this.data) return res
      const keys = ['businessList', 'contactsList', 'contractList', 'customerList']
      keys.forEach(key => {
        res += this.data[key].length || 0
      })
      return res
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.data.isRead === 1) return
      this.$bus.on('load-more-work-log', clientHeight => {
        if (this.isWaiting) return
        if (this.calcVisible(clientHeight)) {
          this.isWaiting = true
          setTimeout(() => {
            this.isWaiting = false
            if (this.calcVisible(clientHeight)) {
              this.readLog()
            }
          }, 3000)
        }
      })
    })
  },
  beforeDestroy() {
    this.$bus.off('load-more-work-log')
  },
  methods: {
    getCategory(categoryId) {
      const map = {
        1: '日报',
        2: '周报',
        3: '月报'
      }
      return map[categoryId]
    },
    /**
     * 编辑/删除
     * @param action
     * @param index
     */
    handleCommand(action, index) {
      if (action === 'delete') {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          journalDelete({ logId: this.data.logId }).then(() => {
            this.$message.success('删除成功!')
            this.$emit('delete')
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      }
    },

    /**
     * 判断当前组件是否完全可见
     */
    calcVisible(boxHeight) {
      if (this.data.isRead === 1) return false
      const domRect = this.$el.getBoundingClientRect()
      return boxHeight > (domRect.top + domRect.height)
    },

    /**
     * 日志标记为已读
     */
    readLog() {
      if (this.data.isRead === 1) return
      this.$emit('read')
      journalSetread({
        logId: this.data.logId
      }).then(() => {
        this.$bus.off('load-more-work-log')
      }).catch()
    }
  }
}
</script>

<style scoped lang="scss">
.log-item {
  .main {
    .user {
      color: #333;
      font-size: 14px;
      padding: 10px 15px 5px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .user-img {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 12px;
      }
      .box {
        flex: 1;
        margin-top: -10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .username {
          margin-right: 30px;
        }
        .time {
          flex: 1;
          font-size: 12px;
          color: #999;
        }
        .comment-status {
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .icon {
            font-size: 14px;
            color: #2772FF;
            margin-right: 5px;
          }
          .dot {
            width: 5px;
            height: 5px;
            background-color: #D21111;
            border-radius: 50%;
            margin-left: 5px;
            display: inline-block;
          }
        }
      }
    }

    .content {
      margin: 0 15px 0 68px;
      .content-box {
        font-size: 12px;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 15px;
        }
        .content-title {
          color: #999;
          margin-bottom: 10px;
        }
        .content-text {
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      }
    }

    .picture-list-view {
      margin: 0 15px 10px 68px;
    }
    .file-list-view {
      width: 960px;
      margin: 0 15px 10px 68px;
    }
    .related-list {
      margin: 0 15px 10px 68px;
      .title {
        font-size: 12px;
        margin-bottom: 10px;
        .icon {
          color: #8A94A6;
          font-size: 12px;
          margin-right: 5px;
        }
      }
      .related-business-list {
        width: 940px;
        margin-left: 20px;
      }
    }
    .comment-list {
      border-top: 1px solid #e6e6e6;
    }
  }

  .footer {
    width: 100%;
    height: 50px;
    background-color: #F4F7FF;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .icon {
      font-size: 16px;
      color: #666;
      cursor: pointer;
    }
    .el-button {
      margin-left: 16px;
      &.el-button--small {
        padding: 7px 10px;
      }
    }
  }
}
</style>
