<template>
  <el-dialog
    :visible="dialogVisible"
    :title="`导入${typeName}`"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="750px"
    @close="dialogClose">

    <div class="dialog-body">
      <el-steps
        :active="stepsActive"
        simple>
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :status="item.status" />
      </el-steps>

      <!-- step 1 -->
      <div
        v-if="stepsActive === 1"
        class="step-section">
        <div class="sections">
          <div class="sections__title">一、请按照数据模板的格式准备要导入的数据。<span
            class="download"
            @click="downloadTpl">点击下载《{{ typeName }}导入模板》</span></div>
          <div class="sections__tips">导入文件请勿超过2MB（约10,000条数据）</div>
        </div>

        <div class="sections">
          <div class="sections__title">二、请选择需要导入的文件</div>
          <div class="content">
            <flexbox class="file-select">
              <el-input
                v-model="file.name"
                :disabled="true"/>
              <el-button
                type="primary"
                @click="selectFile">选择文件</el-button>
            </flexbox>
          </div>
        </div>
      </div>

      <!-- step 2 -->
      <div
        v-loading="loading"
        v-else-if="stepsActive === 2"
        :element-loading-text="importLoadingText"
        element-loading-spinner="el-icon-loading"
        class="step-section">
        <div class="step-section__tips">当前数据正在导入，您可以点击【最小化】隐藏该页面，数据导入不受影响。</div>
      </div>

      <!-- step 3 -->
      <div
        v-loading="loading"
        v-else-if="stepsActive === 3"
        class="step-section">
        <div class="result-info">
          <i class="wk wk-success result-info__icon" />
          <p class="result-info__des">数据导入完成</p>
          <p v-if="resultData" class="result-info__detail">导入总数据<span class="result-info__detail--all">{{ resultData.totalSize }}</span>条，<template v-if="resultData.updateSize">覆盖<span class="result-info__detail--suc">{{ resultData.updateSize }}</span>条，</template>导入成功<span class="result-info__detail--suc">{{ resultData.totalSize - resultData.errSize }}</span>条，导入失败<span class="result-info__detail--err">{{ resultData.errSize }}</span>条</p>
          <el-button
            v-if="resultData && resultData.errSize > 0"
            class="result-info__btn--err"
            type="text"
            @click="downloadErrData">下载错误数据</el-button>
        </div>
      </div>
    </div>

    <flexbox
      slot="footer"
      class="dialog-footer">
      <flexbox-item>
        <el-popover
          v-model="popoverVisible"
          placement="top"
          width="800"
          popper-class="no-padding-popover"
          trigger="click"
          content="popover">
          <el-button
            slot="reference"
            type="text">
            查看历史导入记录
          </el-button>
        </el-popover>
      </flexbox-item>
      <el-button
        v-if="showCancel"
        @click="dialogClose">
        取消
      </el-button>
      <el-button
        v-if="confirmBtnText"
        type="primary"
        @click="handleConfirm">
        {{ confirmBtnText }}
      </el-button>
    </flexbox>

    <input
      id="importInputFile"
      type="file"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="uploadFile">
  </el-dialog>
</template>

<script>
export default {
  name: 'RecordImport',
  data() {
    return {
      loading: false,
      dialogVisible: true,
      popoverVisible: false,

      stepsActive: 1,
      stepList: [
        { icon: 'wk wk-upload', title: '上传文件', status: 'wait' },
        { icon: 'wk wk-data-import', title: '导入数据', status: 'wait' },
        { icon: 'wk wk-success', title: '导入完成', status: 'wait' }
      ],

      reqMap: {
        leadsRecord: { uploadFn: null, tplFn: null }
      },

      file: { name: '' },
      processData: {},
      resultData: {}
    }
  },
  computed: {
    typeName() {
      return {
        customer: 'LEADS跟进记录'
      }[this.crmType]
    },
    showCancel() {
      return this.stepsActive !== 2
    },
    confirmBtnText() {
      return {
        1: '立即导入',
        2: '最小化',
        3: '确定'
      }[this.stepsActive]
    },
    importLoadingText() {
      if (this.processData.count) {
        return `数据导入中（当前已导入${this.processData.count}条）`
      }
      return '数据导入中'
    }
  },
  mounted() {
  },
  methods: {
    dialogClose() {
      this.dialogVisible = false
    },
    handleConfirm() {},

    /**
     * 下载模板
     */
    downloadTpl() {
      const request = this.reqMap[this.type].tplFn
      request().then(res => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download =
            decodeURI(
              res.headers['content-disposition'].split('filename=')[1]
            ) || '' // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch(() => {})
    },

    selectFile() {
      document.getElementById('importInputFile').click()
    },

    uploadFile() {},

    downloadErrData() {}
  }
}
</script>

<style scoped lang="scss">
  /deep/ .el-steps {
    margin-bottom: 15px;

    .el-step__title {
      font-size: 14px;
    }

    .el-step.is-simple .el-step__arrow::before,
    .el-step.is-simple .el-step__arrow::after {
      height: 10px;
      width: 2px;
    }

    .el-step.is-simple .el-step__arrow::after {
      transform: rotate(45deg) translateY(3px);
    }
    .el-step.is-simple .el-step__arrow::before {
      transform: rotate(-45deg) translateY(-2px);
    }
  }

  #importInputFile {
    display: none;
  }

  .step-section {
    min-height: 200px;
    position: relative;

    /deep/ .el-loading-spinner {
      top: 45%;
      .el-icon-loading {
        font-size: 40px;
        color: #999;
      }

      .el-loading-text {
        color: #333;
        margin: 8px 0;
      }
    }

    &__tips {
      color: #999;
      font-size: 12px;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      text-align: center;
      z-index: 3000;
    }
  }

  .sections {
    font-size: 14px;
    color: #333;

    &__title {
      font-weight: 600;
    }

    &__tips {
      padding-left: 30px;
      margin: 8px 0 15px;
      color: #999;
      font-size: 12px;
      line-height: 1.4;
    }

    .download {
      cursor: pointer;
      color: #2362FB;
    }

  }

  .sections__tips + .content {
    padding-top: 0;
  }

  .content {
    padding: 10px 10px 10px 30px;
    .el-select, .user-cell {
      width: 400px;
    }
  }
  .file-select {
    .el-input {
      width: 400px;
    }
    button {
      margin-left: 20px;
    }
  }

  // 结果信息
  .result-info {
    text-align: center;
    padding-top: 80px;

    &__icon {
      font-size: 40px;
      color: $xr-color-primary;
    }

    &__des {
      margin-top: 15px;
      color: #333;
      font-size: 14px;
    }

    &__detail {
      margin-top: 15px;
      font-size: 12px;
      color: #666;
      &--all {
        color: #333;
        font-weight: 600;
      }

      &--suc {
        color: $xr-color-primary;
        font-weight: 600;
      }

      &--err {
        color: #f94e4e;
        font-weight: 600;
      }
    }

    &__btn--err {
      margin-top: 10px;
    }
  }
</style>
