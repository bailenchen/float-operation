<template>
  <div v-loading="showLoading" class="create-log">
    <el-tabs v-model="activeTab" @tab-click="handleTabToggle">
      <el-tab-pane label="日报" name="day" />
      <el-tab-pane label="周报" name="week" />
      <el-tab-pane label="月报" name="month" />
    </el-tabs>

    <el-form>
      <el-form-item
        v-for="(item, index) in textFormKeyList"
        :key="index"
        :label="item.label">
        <el-input
          v-model="form[item.key]"
          :autosize="{
            minRows: 2,
            maxRows: 10
          }"
          type="textarea"
          resize="none"
          placeholder="请输入内容" />
      </el-form-item>
    </el-form>

    <div class="add-control">
      <div class="control-item">
        <span class="icon wk wk-picture" />
        <span>图片</span>
      </div>
      <div class="control-item">
        <span class="icon wk wk-file" />
        <span>附件</span>
      </div>
      <div class="control-item">
        <span>发送给：</span>
        <div class="add-box">
          <span class="add-icon el-icon-plus" />
        </div>
      </div>
      <div class="others">
        <el-button
          size="small"
          type="primary"
          @click="handleCreate">
          发布
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  journalAdd
  // journalEdit
} from '@/api/oamanagement/journal'

export default {
  name: 'CreateLog',
  data() {
    return {
      form: {},
      textFormKeyList: [],
      activeTab: 'day',
      showLoading: false,
      categoryIdMap: {
        day: 1, // 日报
        week: 2, // 周报
        month: 3 // 月报
      }
    }
  },
  created() {
    this.handleTabToggle()
  },
  methods: {
    /**
     * 日志类型 tab 切换
     */
    handleTabToggle() {
      const map = {
        day: ['今日', '明日'],
        week: ['本周', '下周'],
        month: ['本月', '下月']
      }
      const arr = map[this.activeTab]
      this.textFormKeyList = [
        { label: `${arr[0]}工作的内容：`, key: 'content' },
        { label: `${arr[1]}工作的内容：`, key: 'tomorrow' },
        { label: '遇到的问题：', key: 'question' }
      ]
    },

    /**
     * 保存日志
     */
    handleCreate() {
      console.log('save', this.form)
      this.showLoading = true
      journalAdd({
        ...this.form,
        categoryId: this.categoryIdMap[this.activeTab]
      }).then(() => {
        this.showLoading = false
        this.form = {}
        this.$emit('update')
        this.$message.success('添加成功')
      }).catch(() => {
        this.showLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .el-tabs__header {
    margin: 0;
  }
  /deep/ .el-tabs__nav-wrap {
    padding: 0 18px;
  }

  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
  }

  .create-log {
    .el-form {
      padding: 0 18px;
      margin-top: 15px;
      /deep/ .el-form-item {
        font-size: 14px;
        margin-bottom: 10px;
        .el-form-item__label {
          font-size: 12px;
          line-height: 1.5;
          color: #999;
        }
      }
      .el-textarea {
        /deep/ .el-textarea__inner {
          border: 0 none;
          padding: 0 5px;
        }
      }
    }

    .add-control {
      padding: 5px 18px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .control-item {
        color: #666;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .icon {
          margin-right: 5px;
        }
        .add-box {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          border: 1px dotted #666;
          border-radius: 50%;
          .add-icon {
            width: 12px;
          }
        }
      }
      .others {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .el-button--small {
          padding: 7px 14px;
        }
      }
    }
  }
</style>
