<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">班级排课</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <flexbox
        class="crm-create-flex"
        direction="column"
        align="stretch">
        <create-sections title="基本信息">
          <div class="crm-create-body">
            <div>123</div>

          </div>
        </create-sections>
        <create-sections title="上课时间段">
          <div class="crm-create-body">
            <div class="content create-sections-content">
              <div class="time-wrap">
                <flexbox
                  class="crm-create-flex row-set"
                  direction="row"
                  align="center">
                  <span>上课时间段：</span>
                  <div class="time-select">
                    <el-time-select
                      v-model="startTime"
                      :picker-options="{
                        start: '08:00',
                        step: '00:60',
                        end: '19:00'
                      }"
                      placeholder="起始时间"
                      @change="changeTime"/>
                    至
                    <el-time-select
                      v-model="endTime"
                      :picker-options="{
                        start: '08:00',
                        step: '00:60',
                        end: maxEndTime,
                        minTime: startTime,
                      }"
                      placeholder="结束时间"/>
                  </div>
                </flexbox>
                <flexbox
                  class="crm-create-flex row-set"
                  direction="row"
                  align="center">
                  <span>上课日期：</span>
                  <el-input v-model="date" style="width:45%;margin-right:10px;" placeholder="请输入内容"/>
                  <el-button type="primary" size="mini" @click="selectDate">添加日期</el-button>
                  <el-button type="primary" size="mini" @click="reset">重置</el-button>
                </flexbox>
                <flexbox
                  class="crm-create-flex row-set"
                  direction="row"
                  wrap="wrap"
                  align="center">
                  <span>提交排课日期：</span>
                  <el-button
                    v-for="(item, index) in 5"
                    :key="index"
                    :type="index == activeWeek ? 'primary' : ''"
                    size="mini"
                    @click="selectWeek(index)">
                    连排{{ 4 * (index + 1) }}周
                  </el-button>
                </flexbox>
                <flexbox
                  class="crm-create-flex row-set"
                  direction="row"
                  wrap="wrap"
                  align="center">
                  <span>自定义连排周数：</span>
                  <el-select v-model="weeks" clearable placeholder="请选择">
                    <el-option
                      v-for="item in weekList"
                      :key="item"
                      :label="item"
                      :value="item"/>
                  </el-select>&nbsp;&nbsp;周&nbsp;&nbsp;
                  <el-button type="primary" size="mini" @click="clearWeek">清除连排</el-button>
                </flexbox>
                <flexbox
                  class="crm-create-flex time-rank"
                  direction="row"
                  wrap="wrap"
                  justify="flex-start"
                  align="left">
                  <div v-for="(item,index) in dateList" :key="index" class="date-item" style="width: 33%">
                    {{ item }}
                    <i
                      v-if="dateList.length > 1"
                      class="el-icon-remove"
                      @click="deleteDate(item, index)"/>
                  </div>
                </flexbox>
              </div>
            </div>
          </div>
        </create-sections>
      </flexbox>
      <div
        class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="submitForm">保存</el-button>
      </div>
    </flexbox>

    <el-dialog :visible.sync="dateVisible" append-to-body title="添加日期">
      <div class="date-wrap">
        <el-date-picker
          v-model="addSingleDate"
          type="date"
          value-format="yyyy-MM-dd"
          style="margin-right:10px;"
          placeholder="选择日期"/>

        <el-date-picker
          v-model="addDateRange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelDate">确 定</el-button>
      </div>
    </el-dialog>
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import { getDateStr } from '@/utils/dateDiff'
// import {
//   sysConfigDataDictarySaveAPI
// } from '@/api/systemManagement/SystemCustomer'

export default {
  name: 'RankCourse',
  components: {
    CreateView,
    CreateSections
  },
  props: {
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,

      // 时间段
      startTime: '08:00',
      endTime: '10:00',

      date: '',
      // 添加日期
      dateVisible: false,
      addSingleDate: '',
      addDateRange: [],
      storeDate: [], // 存储日期

      activeWeek: null,
      weekList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weeks: null,

      // 排课列表
      dateList: []
    }
  },
  computed: {
    maxEndTime() {
      const maxt = parseInt(this.startTime) + 2
      const maxv = String(maxt).length == 2 ? `${maxt}:00` : `0${maxt}:00`
      return maxv
    }
  },
  watch: {
    weeks(val) {
      if (val) {
        this.activeWeek = null
      }
    }
  },
  created() {

  },
  methods: {
    hidenView() {
      this.$emit('hiden-view', 'schedule')
    },

    changeTime() {
      this.endTime = ''
    },

    // 选择连排
    selectWeek(index) {
      this.activeWeek = index
      this.weeks = null
      console.log(index)
    },

    // 清除连排
    clearWeek() {
      this.activeWeek = null
      this.weeks = null
    },

    // 删除日期
    deleteDate() {

    },

    // 选择日期
    selectDate() {
      this.addSingleDate = ''
      this.addDateRange = []
      this.dateVisible = true
    },

    // 确定选择的日期
    confirmSelDate() {
      // 将日期段转化为单个日期
      let comDate = []
      if (this.addDateRange.length) {
        const everyDay = getDateStr(this.addDateRange[0], this.addDateRange[1], 0).split(',') // 没有开始日期和结束日期 .split(',')
        comDate = [...comDate, ...everyDay]
      }
      if (this.addSingleDate) {
        comDate.push(this.addSingleDate)
      }
      // 过滤重复的日期
      this.storeDate = Array.from(new Set([...this.storeDate, ...comDate]))
      this.dateList = this.storeDate
      console.log(this.dateList, 'bbbbbb')
      this.dateVisible = false
    },

    // 重置
    reset() {
      this.date = ''
      this.activeWeek = null
      this.weeks = null
    },

    /**
     * 保存
     */
    submitForm() {

    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
}

.form-label {
  margin: 5px 0;
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-all;
}

.create-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  padding-left: 12px;
  position: relative;
  margin-left: 15px;
  margin-bottom: 10px;
}

.create-name::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  height: 14px;
  border-radius: 2px;
  width: 4px;
  background-color: $xr-color-primary;
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 10px;
}

.handle-bar {
  position: absolute;
  bottom: 0;
  right: 0;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

.justify-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.content-body {
  height: calc(100% - 30px);
  // min-height: 250px;
  padding: 10px 20px 30px;
  overflow-y: auto;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  margin: 5px 0;
}

.el-icon-remove {
  color: #ff6767;
  cursor: pointer;
  margin-left: 2px;
  display: none;
}

.date-item:hover {
  .el-icon-remove {
    display: inline;
  }
}

.require-item {
  color: #f56c6c;
  font-style: normal;
}

.time-wrap {
  padding: 10px 10px 15px;
}

.row-set {
  line-height: 50px;
}

.time-rank {
  line-height: 40px;
}

.date-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>


