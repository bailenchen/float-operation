<template>
  <slide-view
    v-loading="loading"
    :listener-ids="['workbench-main-container']"
    :no-listener-class="noListenerClass"
    class="d-view"
    @close="hideView">
    <flexbox class="detail-header">
      <div
        :style="{ backgroundColor: detailIcon.color }"
        class="header-icon">
        <i :class="['wk', 'wk-' + detailIcon.icon]" />
      </div>
      <div class="header-name">{{ categoryName }}</div>
    </flexbox>
    <div v-if="disputeInfoZero" class="detail-body">
      <!-- 正义内容 -->
      <div class="b-cell-b">
        <div class="b-cell-name">争议内容</div>
        <div class="b-cell-value">{{ disputeInfoZero.reddsss }}</div>
      </div>
      <!-- 附件 -->
      <div v-if="disputeInfoZero.name" class="section">
        <div class="section__hd">
          <i class="wukong wukong-file" />
          <span>附件</span>
        </div>
        <div class="section__bd">
          <flexbox class="cell">
            <div
              class="cell-body text-one-line cursor-pointer">
              <span>{{ disputeInfoZero.name.length > 20 ? disputeInfoZero.name.substring(0, 20) + '...' : disputeInfoZero.name }}</span>
            </div>
            <div class="cell-foot">
              <span
                class="xr-text-btn primary"
                @click="downloadHandle(disputeInfoZero.batchId)">下载</span>
            </div>
          </flexbox>
        </div>
      </div>
    </div>

    <!-- 审核信息 -->
    <div class="examine-section">
      <!-- <examine-info
        :id="id"
        :record-id="detailData.examineRecordId"
        class="create-sections-content"
        examine-type="oa_examine"
        @on-handle="examineHandle" /> -->

      <examine-info
        :id="id"
        :record-id="recordId"
        :owner-user-id="ownerUserId"
        class="examine-info"
        examine-type="crm_dispute"
        @on-handle="examineHandle"/>
    </div>

  </slide-view>
</template>

<script>
import { downloadAdjunct, crmExamineFlowRecordList } from '@/api/customermanagement/common'

import SlideView from '@/components/SlideView'
import ExamineInfo from '@/components/Examine/ExamineInfo'

import { downloadExcelWithResData } from '@/utils/index'

export default {
  name: 'DisputeDetail', // 争议详情
  components: {
    SlideView,
    ExamineInfo
  },
  props: {
    // recordId: this.recordId,
    //     ownerUserId: this.ownerUserId
    recordId: {
      type: Number
    },
    ownerUserId: {
      type: Number
    },
    id: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      noListenerClass: ['d-view'],
      categoryName: '争议审批',
      file: {
        name: '附件文件'
      },
      disputeInfoZero: null,
      detailData: {
        examineRecordId: 75,
        ownerUserId: 16400
      }
      // fileList: [
      //   {
      //     batchId: '76103c371b3ebffa2ffc3969dbc8d239',
      //     createTime: '2020-09-17 15:15:30',
      //     createUserId: 16397,
      //     createUserName: '程亚',
      //     fileId: 213,
      //     filePath: '/file/downFile?fileId=b33761589ca64739a54730194709f33f',
      //     fileType: 'file',
      //     name: '1.md',
      //     size: 0
      //   }

      // ]
    }
  },
  computed: {
    detailIcon() {
      return {
        color: '#3ABCFB',
        icon: 'wk wk-l-record'
      }
      // return this.getCategoryIcon(this.detail.icon)
    }
  },
  created() {
    this.getDetial()
  },
  methods: {
    getDetial() {
      const params = {
        // customerId: this.id
        recordId: this.recordId,
        ownerUserId: this.ownerUserId
      }
      console.log('获取数据111')
      console.log(params)

      crmExamineFlowRecordList(params)
        .then(res => {
          console.log('争议日志')
          console.log(res)
          this.disputeInfoZero = res.data[0]
        })
        .catch(err => {
          console.log(err)
        })
    },

    downloadHandle(batchId) {
      downloadAdjunct({ 'batchId': batchId })
        .then(res => {
          downloadExcelWithResData(res)
        }, err => {
          console.log(err)
        })
    },
    examineHandle() {
      console.log('处理')
    },
    hideView() {
      // console.log('隐藏')
      this.$emit('hide-view')
    }
  }
}
</script>

<style lang="scss" scoped>
.d-view{
  background-color: white;
  padding: 15px;
}

.header-icon {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 4px;
  margin-right: 20px;
  .wk {
    color: white;
    font-size: 26px;
  }
}

.detail-header .header-name{
    font-size: 16px;
    color: #333333;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-weight: 600;
}

.detail-body {
  flex: 1;
  padding-top: 30px;
  overflow-y: auto;
  width: 100%;
  .b-cell-b {
    width: auto;
    padding: 8px;
    line-height: 22px;
    .b-cell-name {
      width: 100px;
      margin-right: 10px;
      font-size: 12px;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      color: #666;
      line-height: 22px;
    }
    .b-cell-value{
      font-size: 14px;
      color: #333;
      line-height: 22px;
    }
  }
  .section {
    padding: 10px 0;
    .section__hd span{
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .section__bd {
      margin-top: 15px;
      padding-left: 25px;
      .cell {
        padding: 8px;
        background-color: #f8faff;
        border-radius: 4px;
        position: relative;
        margin-bottom: 5px;
      }
    }
    .cell-foot {
      margin-left: 14px;
    }
  }
}

.examine-info {
  border: 1px solid #E4E4E4;
}
</style>
