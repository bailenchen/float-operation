<template>
  <div v-loading="loading" class="visit-remind-set">
    <div class="content-title">
      <span>{{ title }}</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="save">保存</el-button>
    </div>
    <div class="content-body">
      <div class="tips">设置回访提醒后，到期会自动提醒，合同生效是指到达合同开始时间</div>
      <div class="set-content">
        <el-radio
          v-model="status"
          :label="0">不提醒</el-radio>
        <el-radio
          v-model="status"
          :label="1">提醒</el-radio>
        <div
          v-if="status == 1"
          class="time-set">
          <span>合同生效后</span>
          <el-input-number
            v-model="value"
            :precision="0"
            :min="0"
            :controls="false" />
          <span>天提醒</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QueryReminderSettings,
  UpdateLeadsReminderSettings,
  UpdateStudentReminderSettings
} from '@/api/systemManagement/params'

export default {
  name: 'VisitRemindSet',
  props: {
    type: {
      type: String,
      required: true,
      validator: v => {
        return ['leadsVisit', 'studentVisit'].includes(v)
      }
    }
  },
  data() {
    return {
      loading: false, // 展示加载中效果

      settingId: null,
      value: 0, // 天数
      status: 0 // 是否提醒 0、不提醒 1、提醒
    }
  },
  computed: {
    title() {
      return this.type === 'leadsVisit' ? 'LEADS承诺到访提醒设置' : '学员回访提醒设置'
    }
  },
  watch: {
    type: {
      handler() {
        this.getDetail()
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      this.loading = true
      QueryReminderSettings({
        type: this.type === 'leadsVisit' ? 2 : 1
      }).then(res => {
        this.loading = false
        this.settingId = res.data.settingId
        this.value = res.data.value
        this.status = parseInt(res.data.status)
      })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 保存操作
     */
    save() {
      this.loading = true
      const params = {}
      if (this.status == 1) {
        params.value = this.value
        params.status = 1
      } else {
        params.status = 0
      }
      params.settingId = this.settingId
      const reqMap = {
        leadsVisit: UpdateLeadsReminderSettings,
        studentVisit: UpdateStudentReminderSettings
      }
      reqMap[this.type](params)
        .then(res => {
          this.loading = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.content-title > span {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-left: 20px;
}

.content-body {
  height: calc(100% - 57px);
  padding: 30px;
  overflow-y: auto;
}

/* 合同 样式*/
.tips {
  font-size: 13px;
  color: #999;
}

.el-radio {
  display: block;
  padding: 10px 0;
}

.set-content {
  margin-top: 20px;
}

.time-set {
  padding-left: 20px;
  margin-top: 5px;

  .el-input {
    width: 200px;
  }

  span {
    margin-left: 5px;
    color: #333333;
    font-size: 13px;
  }
}
</style>
