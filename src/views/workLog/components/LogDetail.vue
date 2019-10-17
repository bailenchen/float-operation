<template>
  <slide-view
    v-loading="loading"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    class="d-view"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @close="hideView">
    <div
      v-if="detail"
      direction="column"
      align="stretch"
      class="main">
      <flexbox class="detail-header">
        <div class="header-icon">
          <i class="wk wk-log" />
        </div>
        <div class="header-name">日志</div>
      </flexbox>
      <div class="main__bd">
        <div class="content">
          <div
            v-if="detail.content"
            class="content-box">
            <div class="content-title">
              今日工作内容：
            </div>
            <div class="content-text">{{ detail.content }}</div>
          </div>
          <div
            v-if="detail.tomorrow"
            class="content-box">
            <div class="content-title">
              明日工作的内容：
            </div>
            <div class="content-text">{{ detail.tomorrow }}</div>
          </div>
          <div
            v-if="detail.question"
            class="content-box">
            <div class="content-title">
              遇到的问题：
            </div>
            <div class="content-text">{{ detail.question }}</div>
          </div>
        </div>

        <picture-list-view
          v-if="detail.img.length !== 0"
          :list="detail.img" />

        <flexbox v-if="detail.sendUserList && detail.sendUserList.length" class="send-list">
          <span class="send-list__label">发送给：</span>
          <span
            v-for="(item, index) in detail.sendUserList"
            :key="index"
            class="send-list__user">
            <el-tooltip
              placement="bottom"
              effect="light"
              popper-class="tooltip-change-border">
              <div slot="content">
                <span>{{ item.realname }}</span>
              </div>
              <div
                v-photo="item"
                v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
                :key="item.img"
                class="div-photo item-img" />
            </el-tooltip>
          </span>
        </flexbox>

        <!-- 附件 -->
        <div v-if="detail.file.length" class="section">
          <div class="section__hd">
            <i class="wukong wukong-file" />
            <span>附件</span>
            <span>({{ detail.file.length }})</span>
          </div>
          <div class="section__bd">
            <file-cell
              v-for="(file, fileIndex) in detail.file"
              :key="fileIndex"
              :data="file"
              :cell-index="fileIndex" />
          </div>
        </div>

        <!-- 相关信息 -->
        <div
          v-if="Object.keys(relatedListData).length > 0"
          class="section">
          <div class="section__hd">
            <i class="wukong wukong-relevance" />
            <span>相关信息</span>
          </div>
          <div class="section__bd">
            <div
              v-for="(items, key) in relatedListData"
              :key="key">
              <related-business-cell
                v-for="(item, itemIndex) in items"
                :data="item"
                :cell-index="itemIndex"
                :type="key"
                :key="itemIndex"
                :show-foot="false"
                @click.native="checkRelatedDetail(key, item)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <c-r-m-full-screen-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :id="relatedID" />
  </slide-view>
</template>

<script>
import { journalQueryByIdAPI } from '@/api/oamanagement/journal'

import SlideView from '@/components/SlideView'
import PictureListView from '@/components/PictureListView'
import FileCell from '@/views/OAManagement/components/fileCell'
import RelatedBusinessCell from '@/views/OAManagement/components/relatedBusinessCell'

export default {
  // 日志详情
  name: 'LogDetail',
  components: {
    SlideView,
    PictureListView,
    FileCell,
    RelatedBusinessCell,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  props: {
    id: [String, Number],
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
      detail: null,

      // 相关详情的查看
      relatedID: '',
      relatedCRMType: '',
      showRelatedDetail: false
    }
  },
  computed: {
    /**
     * 相关信息
     */
    relatedListData() {
      const tempsData = {}
      const keys = ['contacts', 'customer', 'business', 'contract']
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        const list = this.detail[`${key}List`] || []
        if (list.length > 0) {
          tempsData[key] = list
        }
      }
      return tempsData
    }
  },
  watch: {
    id: function(val) {
      this.detail = null
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },

  beforeDestroy() {},

  methods: {
    /**
     * 详情
     */
    getDetail() {
      this.loading = true
      journalQueryByIdAPI({ logId: this.id })
        .then(res => {
          console.log(res)
          this.detail = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.hideView()
        })
    },

    /**
     * 查看相关信息详情
     */
    checkRelatedDetail(crmType, item) {
      this.relatedID = item[crmType + 'Id']
      this.relatedCRMType = crmType
      this.showRelatedDetail = true
    },

    /**
     * 关闭页面
     */
    hideView() {
      this.$emit('close')
      this.$emit('hide-view')
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  height: 100%;

  &__bd {
    height: calc(100% - 40px);
    overflow: auto;
  }
}

// 日志内容

.content {
  margin-top: 30px;
  .content-box {
    font-size: 14px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 15px;
    }
    .content-title {
      font-size: 13px;
      color: #666;
      margin-bottom: 10px;
    }
    .content-text {
      color: #333;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

.detail-header {
  .header-icon {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: $xr-border-radius-base;
    margin-right: 20px;
    background-color: #5864ff;
    .wk {
      color: white;
      font-size: 26px;
    }
  }
  .header-name {
    font-size: 16px;
    color: #333333;
    flex: 1;
    font-weight: 600;
  }
}

.send-list {
  padding: 8px 0  ;
  &__label {
    color: #333;
    font-size: 12px;
  }

  &__user {
    position: relative;
    display: inline-block;

  .item-img {
      width: 32px;
      height: 32px;
      border-radius: 16px;
    }
  }

  &__user + &__user {
    margin-left: 7px;
  }
}

.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 60px;
  bottom: 0px;
  right: 0px;
  padding: 15px;
  background-color: white;
}

// 详情其他模块
.section {
  padding: 10px 0;

  &__hd {
    span {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .wk {
      color: #363636;
      font-size: 15px;
      margin-right: 5px;
    }
  }

  &__bd {
    margin-top: 15px;
    padding-left: 25px;
  }
}

</style>
