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
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        @change="changeBaseDate"/>

                      <div v-else-if="item.type === 'time'" class="time-select">
                        <period
                          :value="during"
                          @update-time="updateTime($event)"/>
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
                    <span v-if="item.prop == 'deptSelectValue'">
                      <xh-structure-cell
                        :value="scope.row['deptSelectValue']"
                        :radio="radio"
                        cell-type="classroom"
                        placeholder="选择教室"
                        class="xh-structure-cell"
                        @value-change="structureChange($event, scope.$index)" />
                    </span>
                    <span v-else-if="item.prop == 'teacherList'">
                      <xh-user-cell
                        :radio="radio"
                        :value="scope.row['teacherList']"
                        @value-change="userChange($event, scope.$index)"/>
                    </span>
                    <span v-else-if="item.prop == 'time'">
                      <el-date-picker
                        v-model="scope.row['time']"
                        value-format="yyyy-MM-dd"
                        type="date"
                        style="width:100%;"
                        placeholder="选择日期"/>
                    </span>
                    <span v-else-if="item.prop == 'during'">
                      <period
                        :value="scope.row['during']"
                        @update-time="updateTime($event, scope.$index)"/>
                    </span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
                <el-table-column/>
              </el-table>
            </div>

          </div>
        </create-sections>
        <create-sections title="班级学员信息">
          <div class="crm-create-body">
            <div class="content create-sections-content" style="margin-top:10px;">
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

import Period from './Period'

import {
  crmClassSchduleDetail,
  crmClassSchduleShift,
  crmClassSchduleShiftSave
} from '@/api/educationmanage/classSchedule'

export default {
  name: 'ShiftHandle',
  components: {
    CreateView,
    CreateSections,
    XhStructureCell,
    XhUserCell,
    Period
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
      during: {
        startTime: '08:00',
        endTime: '10:00'
      },
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
        { prop: 'customerName', label: '上课学员' },
        { prop: 'number', label: '上课人数' },
        { prop: 'deptSelectValue', label: '教室（变更后）', width: 160 },
        { prop: 'teacherList', label: '学科老师（变更后）', width: 160 },
        { prop: 'time', label: '上课时间（变更后）', width: 160 },
        { prop: 'during', label: '时间段（变更后）', width: 220 }
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
      showShift: false,
      // 勾选将换挡数据
      checkList: []
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
        this.during = {
          startTime: data['timeSlotStart'].slice(0, 5),
          endTime: data['timeSlotEnd'].slice(0, 5)
        }
        this.deptSelectValue = [{
          classroomId: data['classroomId'],
          classroomName: data['classroomName']
        }]
        this.teacherList = [{
          userId: data['subjectTeacherId'],
          realname: data['subjectTeacherName']
        }]

        this.stuList = data.students
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
          this.list = res.data.map(item => {
            item.time = this.classTime ? this.classTime.slice(0, 10) : ''
            item.during = {
              startTime: this.during.startTime,
              endTime: this.during.endTime
            }
            item.deptSelectValue = [{
              classroomId: this.deptSelectValue.length ? this.deptSelectValue[0]['classroomId'] : null,
              classroomName: this.deptSelectValue.length ? this.deptSelectValue[0]['classroomName'] : null
            }]
            item.teacherList = [{
              userId: this.teacherList.length ? this.teacherList[0]['userId'] : null,
              realname: this.teacherList.length ? this.teacherList[0]['realname'] : null
            }]
            return item
          })
          this.showShift = true
        }).catch(err => {
          console.log(err)
        })
      }
    },

    changeDate(data, index) {
      this.$set(this.list[index], 'time', data)
    },

    changeBaseDate(val) {
      this.changeListItem('time', val)
    },

    updateTime(data, index) {
      if (arguments.length == 2) {
        this.$set(this.list[index], 'during', data)
      } else {
        this.changeListItem('during', data)
      }
    },

    /**
     * 教室选择
     */
    structureChange(data, index) {
      if (arguments.length == 2) {
        this.$set(this.list[index], 'deptSelectValue', data.value || [])
      } else {
        this.deptSelectValue = data.value || []
        this.changeListItem('classroom', data.value)
      }
    },

    /**
     * 关联老师
     */
    userChange(data, index) {
      if (arguments.length == 2) {
        this.$set(this.list[index], 'teacherList', data.value || [])
      } else {
        this.teacherList = data.value || []
        this.changeListItem('teacher', data.value)
      }
    },

    // 基本信息变更联动列表
    changeListItem(type, val) {
      if (this.showShift) {
        for (let index = 0; index < this.list.length; index++) {
          const element = this.list[index]
          if (type === 'classroom') {
            element.deptSelectValue = val || []
          } else if (type === 'teacher') {
            element.teacherList = val || []
          } else if (type === 'time') {
            element.time = val || ''
          } else if (type === 'during') {
            this.$set(element, 'during', val)
          }
        }
      }
    },

    hidenView() {
      this.$emit('hiden-view', 'shift')
    },

    // 勾选
    handleSelectionChange(data) {
      this.checkList = data
    },

    /**
     * 保存
     */
    submitForm() {
      if (!this.teacherList.length) {
        this.$message.error('请选择基本信息中的学科老师')
      } else if (!this.deptSelectValue.length) {
        this.$message.error('请选择基本信息中的教室')
      } else if (!this.classTime) {
        this.$message.error('请选择基本信息中的日期')
      } else if (!this.during.startTime || !this.during.endTime) {
        this.$message.error('请选择基本信息中的上课时段')
      }
      this.loading = true
      const { timeId } = this.selectionList[0]
      const shiftList = []
      for (let index = 0; index < this.checkList.length; index++) {
        const element = this.checkList[index]
        shiftList.push({
          timeId: element.timeId,
          classTime: element.time,
          timeSlot: `${element.during.startTime}:00-${element.during.endTime}:00`,
          classroomId: element.deptSelectValue[0].classroomId,
          subjectTeacherId: element.teacherList[0].userId
        })
      }
      const params = {
        entity: {
          timeId,
          classTime: this.classTime,
          timeSlot: `${this.during.startTime}:00-${this.during.endTime}:00`,
          classroomId: this.deptSelectValue[0].classroomId,
          subjectTeacherId: this.teacherList[0].userId
        },
        list: shiftList
      }
      crmClassSchduleShiftSave(params).then(res => {
        this.hidenView()
        this.loading = false
        this.$message.success('操作成功')
        this.$emit('save-success', { type: 'shift' })
      }).catch((err) => {
        console.log(err)
      })
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


