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
            <xr-avatar
              :name="item.realname"
              :size="32"
              :src="item.img"
              :id="item.userId"
              :disabled="false"
              trigger="hover" />
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

        <div v-if="detail.getBulletin" class="section">
          <div class="section__hd">
            <i class="wk wk-briefing" />
            <span>销售简报</span>
          </div>
          <div class="section__bd">
            <report-menu
              :list="reportList"
              @select="reportSelect" />
          </div>
        </div>
      </div>
    </div>
    <c-r-m-full-screen-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :id="relatedID" />

    <!-- 销售简报列表 -->
    <report-list
      :show.sync="reportListShow"
      :title="reportData.title"
      :placeholder="reportData.placeholder"
      :crm-type="reportData.crmType"
      :request="reportData.request"
      :params="reportData.params"
      :record-request="reportData.recordRequest"
      :field-list="fieldReportList"
      :paging="reportData.paging"
      :sortable="reportData.sortable"/>

  </slide-view>
</template>

<script>
import {
  journalQueryByIdAPI,
  journalQueryRecordCountAPI,
  journalQueryBulletinByTypeAPI } from '@/api/oamanagement/journal'

import SlideView from '@/components/SlideView'
import PictureListView from '@/components/PictureListView'
import FileCell from '@/views/OAManagement/components/fileCell'
import RelatedBusinessCell from '@/views/OAManagement/components/relatedBusinessCell'
import ReportMenu from './ReportMenu'
import ReportList from '@/views/customermanagement/workbench/components/reportList'

export default {
  // 日志详情
  name: 'LogDetail',
  components: {
    SlideView,
    PictureListView,
    FileCell,
    RelatedBusinessCell,
    ReportMenu,
    ReportList,
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
      showRelatedDetail: false,

      // 简报信息
      reportList: [
        {
          type: 'customer',
          key: 'customerCount',
          info: '今日新增客户',
          name: '今日新增客户 0'
        },
        {
          type: 'business',
          key: 'businessCount',
          info: '今日新增商机',
          name: '今日新增商机 0'
        },
        {
          type: 'contract',
          key: 'contractCount',
          info: '今日新增合同',
          name: '今日新增合同 0'
        },
        {
          type: 'receivables',
          key: 'receivablesMoney',
          info: '今日新增回款',
          name: '今日新增回款 0'
        },
        {
          type: 'record',
          key: 'recordCount',
          info: '今日新增跟进记录',
          name: '今日新增跟进记录 0'
        }
      ],

      // 简报预览
      reportListShow: false,
      fieldReportList: null,
      reportData: {
        title: '',
        placeholder: '',
        crmType: '',
        request: null,
        recordRequest: journalQueryBulletinByTypeAPI,
        params: null,
        paging: true,
        sortable: false
      }
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
          this.detail = res.data
          if (this.detail.getBulletin) {
            this.reportList = this.reportList.map(item => {
              item.name = `${item.info} ${this.detail.bulletin[item.key]}`
              return item
            })
          }
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
    },

    /**
     * 简报预览
     */
    reportSelect(item, data) {
      data = this.detail

      if (item.type) {
        this.reportData.title = `销售简报-${item.info}`
        this.reportData.placeholder = {
          customer: '请输入客户名称',
          business: '请输入商机名称',
          contract: '请输入合同名称',
          receivables: '请输入回款编号',
          record: ''
        }[item.type]


        this.reportData.crmType = item.type
        // data 存在 是已添加日志预览  不存在为页面顶部 销售简报预览
        this.reportData.params = data ? { logId: data.logId } : { today: 1 }

        // type   1 客户 2 商机 3 合同 4 回款 5 跟进记录
        this.reportData.params.type = {
          customer: 1,
          business: 2,
          contract: 3,
          receivables: 4,
          record: 5
        }[item.type]

        if (item.type == 'record') {
          this.fieldReportList = [
            {
              label: '模块',
              prop: 'crmType',
              width: 300
            },
            {
              label: '新增跟进记录数',
              prop: 'count'
            }
          ]
          this.reportData.request = journalQueryRecordCountAPI
          this.reportData.paging = false
          this.reportData.sortable = false
        } else {
          this.fieldReportList = this.getReportFieldList(item.type)
          this.reportData.request = journalQueryBulletinByTypeAPI
          this.reportData.paging = true
          this.reportData.sortable = 'custom'
        }

        this.reportListShow = true
      }
    },

    /**
     * type   1 客户 2 商机 3 合同 4 回款 5 跟进记录
     *
     * 表头数据
     * 客户：客户名称、成交状态、最后跟进时间、创建时间、负责人
     * 商机：商机名称、商机阶段、最后跟进时间、创建时间、负责人
     * 合同：合同名称、合同状态、创建时间、公司签约人
     * 回款：回款编号、回款时间、负责人
     */
    getReportFieldList(type) {
      return {
        customer: [
          {
            label: '客户名称',
            prop: 'customerName'
          },
          {
            label: '成交状态',
            prop: 'dealStatus'
          },
          {
            label: '最后跟进时间',
            prop: 'lastTime'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '负责人',
            prop: 'ownerUserName'
          }
        ],
        business: [
          {
            label: '商机名称',
            prop: 'businessName'
          },
          {
            label: '商机阶段',
            prop: 'statusName'
          },
          {
            label: '最后跟进时间',
            prop: 'lastTime'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '负责人',
            prop: 'ownerUserName'
          }
        ],
        contract: [
          {
            label: '合同名称',
            prop: 'num'
          },
          {
            label: '合同状态',
            prop: 'checkStatus'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '公司签约人',
            prop: 'companyUserName'
          }
        ],
        receivables: [
          {
            label: '回款编号',
            prop: 'number'
          },
          {
            label: '回款时间',
            prop: 'returnTime'
          },
          {
            label: '负责人',
            prop: 'ownerUserName'
          }
        ]
      }[type]
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
