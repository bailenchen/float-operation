<template>
  <slide-view class="d-view"
              v-loading="loading"
              :listenerIDs="listenerIDs"
              :noListenerIDs="noListenerIDs"
              :noListenerClass="noListenerClass"
              @side-close="hideView"
              :body-style="{padding: 0, height: '100%'}">
    <flexbox class="t-section">
      <img class="t-img"
           :src="crmIcon" />
      <div class="t-name">跟进记录</div>
      <img @click="hideView"
           class="t-close"
           src="@/assets/img/task_close.png" />
    </flexbox>
    <div id="follow-log-content"
         class="t-content">
      <follow-record-cell v-for="(item, index) in list"
                          :item="item"
                          :crmType="crmType"
                          :index="index"
                          :key="index"
                          @on-handle="cellHandle"></follow-record-cell>
      <div class="load">
        <el-button type="text"
                   :loading="loadMoreLoading">{{loadMoreLoading ? '加载更多' : '没有更多了'}}</el-button>
      </div>
    </div>
  </slide-view>
</template>

<script>
import FollowRecordCell from '@/views/customermanagement/components/followLog/components/FollowRecordCell'
import SlideView from '@/components/SlideView'
import { crmIndexGetRecordListAPI } from '@/api/customermanagement/workbench'

export default {
  /** 跟进记录列表 */
  name: 'record-list',

  components: {
    FollowRecordCell,
    SlideView
  },

  props: {
    crmType: String,
    params: Object,
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    }
  },

  data() {
    return {
      loading: false,
      loadMoreLoading: true,
      // 判断是否发请求
      isPost: false,
      page: 1,
      list: []
    }
  },

  watch: {
    params() {
      this.refreshList()
    }
  },

  computed: {
    crmIcon() {
      if (this.crmType === 'customer') {
        return require('@/assets/img/customer_detail.png')
      } else if (this.crmType === 'leads') {
        return require('@/assets/img/clue_detail.png')
      } else if (this.crmType === 'business') {
        return require('@/assets/img/business_detail.png')
      } else if (this.crmType === 'contacts') {
        return require('@/assets/img/contacts_detail.png')
      } else if (this.crmType === 'contract') {
        return require('@/assets/img/contract_detail.png')
      } else if (this.crmType === 'receivables') {
        return require('@/assets/img/money_detail.png')
      } else if (this.crmType === 'product') {
        return require('@/assets/img/product_detail.png')
      }
      return ''
    }
  },

  mounted() {
    // 分批次加载
    let dom = document.getElementById('follow-log-content')
    dom.onscroll = () => {
      let scrollOff = dom.scrollTop + dom.clientHeight - dom.scrollHeight
      //滚动条到底部的条件
      if (Math.abs(scrollOff) < 10 && this.loadMoreLoading == true) {
        if (!this.isPost) {
          this.isPost = true
          this.page++
          this.getList()
        } else {
          this.loadMoreLoading = false
        }
      }
    }
    this.getList()
  },

  methods: {
    refreshList() {
      this.page = 1
      this.list = []
      this.getList()
    },

    /**
     * 获取列表
     */
    getList() {
      this.loading = true
      crmIndexGetRecordListAPI({ page: this.page, limit: 15, ...this.params })
        .then(res => {
          this.list = this.list.concat(res.data.list)
          if (res.data.list.length < 15) {
            this.loadMoreLoading = false
          } else {
            this.loadMoreLoading = true
          }
          this.isPost = false
          this.loading = false
        })
        .catch(() => {
          this.isPost = false
          this.loading = false
        })
    },

    /**
     * 行布局删除
     */
    cellHandle(data) {
      if (data.type == 'delete') {
        this.list.splice(data.data.index, 1)
        this.$emit('handle')
      }
    },

    /**
     * 点击关闭按钮隐藏视图
     */
    hideView() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
.t-section {
  position: relative;
  padding: 10px 17px;
  min-height: 60px;
  line-height: 40px;
  .t-img {
    display: block;
    width: 35px;
    height: 35px;
    margin-right: 10px;
  }
  .t-name {
    font-size: 14px;
    color: #333333;
    flex: 1;
  }

  .t-close {
    display: block;
    float: right;
    width: 40px;
    height: 40px;
    margin-left: 20px;
    padding: 10px;
    cursor: pointer;
  }
}

.load {
  color: #999;
  font-size: 13px;
  margin: 0 auto 15px;
  text-align: center;
  .el-button,
  .el-button:focus {
    color: #ccc;
    cursor: auto;
  }
}

.d-view {
  position: fixed;
  width: 950px;
  top: 0;
  bottom: 0;
  right: 0;
}

.t-content {
  margin: 0 30px;
  height: calc(100% - 80px);
  overflow-y: auto;
}
</style>
