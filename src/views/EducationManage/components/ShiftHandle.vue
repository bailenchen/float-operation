<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">班级换挡</div>
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
            <div class="content create-sections-content">
              <flexbox
                :gutter="0"
                align="stretch"
                wrap="wrap"
                style="padding: 10px 8px 0;">
                <flexbox-item
                  v-for="(item, index) in baseInfoList"
                  :span="false ? 12 : 0.25"
                  :key="index">
                  <flexbox
                    align="stretch"
                    direction="column"
                    class="b-cell-b">
                    <div class="b-cell-name">{{ item.label }}</div>
                    <div class="b-cell-value">
                      <xh-structure-cell
                        v-if="item.type === 'dept'"
                        :value="deptSelectValue"
                        :radio="radio"
                        cell-type="classroom"
                        placeholder="选择教室"
                        class="xh-structure-cell"
                        @value-change="structureChange" />

                      <xh-user-cell
                        v-else-if="item.type === 'user'"
                        :radio="radio"
                        :value="teacherList"
                        @value-change="userChange"/>

                      <el-date-picker
                        v-else-if="item.type === 'date'"
                        v-model="classTime"
                        type="date"
                        style="width:100%;"
                        placeholder="选择日期"/>

                      <div v-else-if="item.type === 'time'" class="time-select">
                        <el-time-select
                          v-model="startTime"
                          :picker-options="{
                            start: '08:00',
                            step: '00:60',
                            end: '19:00'
                          }"
                          placeholder="起始时间"
                          @change="changeTime"/>
                        <!-- <span>至</span> -->
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

                      <span v-else>{{ base[item.prop] }}</span>
                    </div>
                  </flexbox>
                </flexbox-item>
              </flexbox>
              <el-button type="primary" style="margin:10px 0;" size="mini" @click="queryShift">批量换挡</el-button>
              <el-table
                v-if="showShift"
                id="crm-table"
                :row-height="40"
                :data="list"
                :height="350"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleSelectionChange">
                <el-table-column
                  show-overflow-tooltip
                  type="selection"
                  align="center"
                  width="55"/>
                <el-table-column
                  v-for="(item, index) in fieldLists"
                  :key="index"
                  :fixed="index==0"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.prop == 'name'">{{ scope.row.name }}</span>
                    <span v-else-if="item.prop == 'time'">{{ scope.row.time }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
                <el-table-column width="90" align="center" label="教室（变更后）">
                  <template slot-scope="scope">
                    <el-button size="mini">请假</el-button>
                    <!-- <el-input v-model="item."/> -->
                  </template>
                </el-table-column>
                <el-table-column width="90" align="center" label="学科老师（变更后）">
                  <template slot-scope="scope">
                    <el-button size="mini">请假</el-button>
                  </template>
                </el-table-column>
                <el-table-column width="90" align="center" label="上课时间（变更后）">
                  <template slot-scope="scope">
                    <el-button size="mini">请假</el-button>
                  </template>
                </el-table-column>
                <el-table-column width="90" align="center" label="时间段（变更后）">
                  <template slot-scope="scope">
                    <el-button size="mini">请假</el-button>
                  </template>
                </el-table-column>
                <el-table-column/>
              </el-table>
            </div>

          </div>
        </create-sections>
        <create-sections title="班级学员信息">
          <div class="crm-create-body">
            <div class="content create-sections-content">
              <el-table
                id="crm-table"
                :row-height="40"
                :data="stuList"
                :height="350"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  v-for="(item, index) in classInfoLists"
                  :key="index"
                  :fixed="index==0"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.prop == 'name'">{{ scope.row.name }}</span>
                    <span v-else-if="item.prop == 'time'">{{ scope.row.time }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
                <el-table-column/>
              </el-table>
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
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import {
  XhStructureCell,
  XhUserCell
} from '@/components/CreateCom'

import {
  crmClassSchduleDetail,
  crmClassSchduleShift } from '@/api/educationmanage/classSchedule'

export default {
  name: 'ShiftHandle',
  components: {
    CreateView,
    CreateSections,
    XhStructureCell,
    XhUserCell
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
      radio: true,

      baseInfoList: [
        { prop: 'deptName', label: '中心' },
        { prop: 'className', label: '班级名称' },
        { prop: 'subjectTeacherName', label: '学科老师', type: 'user' },
        { prop: 'classTime', label: '上课时间', type: 'date' },
        { prop: 'classroomName', label: '教室', type: 'dept' },
        { prop: 'subjectName', label: '科目' },
        { prop: 'gradeName', label: '年级' },
        { prop: 'timeSlot', label: '上课时段', type: 'time' },
        { prop: 'classType', label: '班级类型' },
        { prop: 'remarks', label: '备注' }
      ],
      // 时间段
      startTime: '08:00',
      endTime: '10:00',
      teacherList: [],
      deptSelectValue: [],
      base: {},
      classTime: '',

      // 学员合同表
      list: [],
      stuList: [],
      fieldLists: [
        { prop: 'classroomName', label: '教室' },
        { prop: 'gradeName', label: '年级' },
        { prop: 'subjectName', label: '科目' },
        { prop: 'subjectTeacherName', label: '学科老师' },
        { prop: '', label: '状态' },
        { prop: 'classTime', label: '上课时间' },
        { prop: 'timeSlot', label: '时间段' },
        { prop: 'number', label: '上课学员上课人数' }
      ],

      classInfoLists: [
        { prop: 'customerName', label: '姓名' },
        { prop: 'num', label: '合同号' },
        { prop: 'subjectName', label: '科目' },
        { prop: 'gradeName', label: '年级' },
        { prop: 'sumCourse', label: '合同课次' },
        { prop: 'endCourse', label: '结课课次' },
        { prop: 'alreadyCourse', label: '已排课次' }
      ],
      showShift: false
    }
  },
  computed: {
    maxEndTime() {
      const maxt = parseInt(this.startTime) + 2
      const maxv = String(maxt).length == 2 ? `${maxt}:00` : `0${maxt}:00`
      return maxv
    }
  },
  created() {
    this.queryBaseStudentInfo()
  },
  methods: {
    // 查询基本信息与学员信息
    queryBaseStudentInfo() {
      this.loading = true
      crmClassSchduleDetail({ timeId: this.selectionList[0].timeId }).then(res => {
        const data = res.data
        this.base = data
        this.classTime = data['classTime'].slice(0, 10) || ''
        this.startTime = data['timeSlotStart'].slice(0, 5)
        this.endTime = data['timeSlotEnd'].slice(0, 5)
        this.teacherList = [{
          userId: data['subjectTeacherId'],
          realname: data['subjectTeacherName']
        }]


        this.stuList = data.students
        console.log(res)
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },

    // 查询换挡列表
    queryShift() {
      if (!this.showShift) {
        crmClassSchduleShift({ classId: this.selectionList[0].classId }).then(res => {
          this.list = res.data
          this.showShift = true
        }).catch(err => {
          console.log(err)
        })
      }
    },

    /**
     * 教室选择
     */
    structureChange(data) {
      console.log(data, 'BBBBBBBBBBBBBBBBBB')
      // this.deptNumber = data.value.length ? data.value[0].deptNumber : ''
      // this.form.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
    },

    /**
     * 关联老师
     */
    userChange(data) {
      // const ids = ['']
      // const names = []
      // data.value.forEach(item => {
      //   ids.push(item.userId)
      //   names.push(item.realname)
      // })
      // this.form.relatedTeachers = String(ids)
      // this.form.classroomName = `${this.deptNumber}-${String(names)}`
      // this.teacherList = data.value || []
    },

    changeTime() {
      this.endTime = ''
    },

    hidenView() {
      this.$emit('hiden-view', 'shift')
    },

    // 勾选
    handleSelectionChange(data) {
      console.log(data)
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

.b-cell-b {
  width: auto;
  padding: 8px 0;
  .b-cell-name {
    width: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    flex-shrink: 0;
    color: #777;
  }
  .b-cell-value {
    font-size: 13px;
    color: #333;
    line-height: 1.2;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.handle-bar {
  position: relative;
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

.crm-create-flex {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  margin: 5px 0;
}

/* 事项布局 */
.input-item {
  margin-bottom: 10px;

  .el-input {
    width: 300px;
  }

  .el-icon-remove {
    color: #ff6767;
    cursor: pointer;
    margin-left: 2px;
    display: none;
  }
}

.input-item:hover {
  .el-icon-remove {
    display: inline;
  }
}

.require-item {
  color: #f56c6c;
  font-style: normal;
}

/deep/ .el-table--border {
  border: 1px solid #EBEEF5;
}

/deep/ .user-container {
  margin: 0;
}

/deep/ .el-date-editor.el-input {
  width: 49%;
}
</style>


