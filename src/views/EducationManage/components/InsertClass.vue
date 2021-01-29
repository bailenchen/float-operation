<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">学员插班</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <flexbox
        class="crm-create-flex"
        direction="column"
        align="stretch">
        <create-sections title="班级基本信息">
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
                    <div class="b-cell-name">{{ item.name }}</div>
                    <div class="b-cell-value">{{ item.value }}</div>
                  </flexbox>
                </flexbox-item>
              </flexbox>
            </div>

          </div>
        </create-sections>
        <create-sections v-if="crmType === 'class'" title="上课时间段">
          <div class="crm-create-body" style="margin-top:10px;">
            <div class="content create-sections-content">
              <el-table
                id="crm-table"
                ref="multipleTable"
                :row-height="40"
                :data="list"
                :height="350"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  show-overflow-tooltip
                  type="selection"
                  align="center"
                  width="55"/>
                <el-table-column
                  v-for="(item, index) in timeLists"
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
        <create-sections title="学员名称" class="student-wrap">
          <add-student
            :base-info="selectionList[0]"
            :time-list="checkList"
            :original-time-list="list"
            :stu-type="markTime"
            :crm-type="crmType"
            :current-date="currentDate"
            @added-stu="getStuInfo"/>
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
import AddStudent from './AddStudent'

import { crmClassSchduleConfirmInfo, crmClassSchduleInsertClassSave } from '@/api/educationmanage/classSchedule'
import { crmClassQueryInsertBaseInfo } from '@/api/educationmanage/class'
import { objDeepCopy } from '@/utils'

export default {
  name: 'InsertClass',
  components: {
    CreateView,
    CreateSections,
    AddStudent
  },
  props: {
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,

      fieldObj: {
        deptName: '中心',
        className: '班级名称',
        subjectTeacherName: '学科老师',
        classTime: '上课时间',
        classroomName: '教室',
        subjectName: '科目',
        gradeName: '年级',
        timeSlot: '上课时段',
        coachTypeName: '辅导方式',
        classTypeName: '班级类型',
        remarks: '备注',
        totalNumber: '满班人数'
      },
      baseInfoList: [],

      // 上课时段
      list: [],
      timeLists: [
        { prop: 'num', label: '序号', width: 50 },
        { prop: 'dateTime', label: '日期/时间', width: 170 },
        { prop: 'customerName', label: '上课学员', width: 170 },
        { prop: 'maxs', label: '实际学员/最大人数', width: 170 }
      ],
      checkList: [],
      markTime: '',

      // 已经添加的数据
      addedList: [],

      currentDate: []
    }
  },
  computed: {

  },
  created() {
    this.queryBaseInfo()
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view', 'insert_class')
    },

    // 获取基本信息与学员信息
    queryBaseInfo() {
      this.loading = true
      const request = {
        class: crmClassQueryInsertBaseInfo,
        classschedule: crmClassSchduleConfirmInfo,
        teacher: crmClassSchduleConfirmInfo
      }[this.crmType]
      const { timeId, classId, classTime } = this.selectionList[0]
      const params = this.crmType === 'class' ? { classId } : { timeId }
      request(params).then(res => {
        const data = res.data
        for (const key in this.fieldObj) {
          if (Object.hasOwnProperty.call(this.fieldObj, key)) {
            const element = this.fieldObj[key]
            if (this.crmType === 'class') {
              if (!(key == 'classTime' || key == 'timeSlot')) {
                this.baseInfoList.push({
                  name: element,
                  value: this.handleValue(key, data)
                })
              }
            } else if (this.crmType === 'classschedule' || this.crmType === 'teacher') {
              this.currentDate = []
              this.currentDate.push(classTime)
              this.baseInfoList.push({
                name: element,
                value: this.handleValue(key, data)
              })
            }
          }
        }

        // 上课时间段列表
        if (this.crmType === 'class') {
          const totalNumber = []
          this.list = data.list.filter((item, index) => {
            item.num = index + 1
            item.dateTime = item.classTime ? `${item.classTime.slice(0, 10)} ${item.timeSlotStart.slice(0, 5)}~${item.timeSlotEnd.slice(0, 5)}` : ''
            item.customerId = []
            let actual = 0
            item.customerName = item.students.map(ite => {
              item.customerId.push(ite.customerId)
              if (ite.classStatus === 1) {
                actual++
              }
              return `${ite.customerName}(${ite.classStatusName})`
            }).join(',')
            item.actual = actual
            item.totalNumbers = item.totalNumber
            totalNumber.push(item.totalNumbers - actual)
            item.maxs = `${item.actual}/${item.totalNumbers}`
            return item.actual !== item.totalNumbers
          })
          if (!this.list.length) {
            this.markTime = 'notime'
          }
          this.selectionList[0].totalNumbers = Math.min(...totalNumber)
        }
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },

    handleValue(key, data) {
      if (key === 'classTime') {
        if (data.classTime) {
          return data.classTime.slice(0, 10)
        } else {
          return '--'
        }
      } else if (key === 'timeSlot') {
        if (data.timeSlotStart && data.timeSlotEnd) {
          return `${data.timeSlotStart.slice(0, 5)}~${data.timeSlotEnd.slice(0, 5)}`
        } else {
          return '--'
        }
      } else {
        return data[key]
      }
    },

    getStuInfo(data) {
      this.addedList = data
    },

    // 勾选
    handleSelectionChange(data) {
      // if (this.addedList.length) {
      //   const filterData = []
      //   const useData = []
      //   for (let index = 0; index < data.length; index++) {
      //     const element = data[index]
      //     for (let indexs = 0; indexs < this.addedList.length; indexs++) {
      //       const item = this.addedList[indexs]
      //       console.log(element, item.customerId)
      //       if (element.customerId.includes(item.customerId)) {
      //         filterData.push(element)
      //       } else {
      //         useData.push(element)
      //       }
      //     }
      //   }
      //   if (filterData.length) {
      //     this.toggleSelection(filterData)
      //   }
      //   if (filterData.length > 1) {
      //     return this.$message.error('勾选的数据中包含已存在学员')
      //   } else if (filterData.length == 1) {
      //     return this.$message.error('该学员已存在')
      //   }

      //   this.checkList = useData
      // } else {
      this.checkList = data
      // }
      this.currentDate = []
      if (this.crmType === 'class') {
        for (let index = 0; index < this.checkList.length; index++) {
          const element = this.checkList[index]
          this.currentDate.push(element.classTime)
        }
      }
    },

    // 校正勾选时间段
    toggleSelection(filterData) {
      if (filterData.length) {
        filterData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    /**
     * 保存
     */
    submitForm() {
      const { timeId, batchId, classId, classroomId, classTime, timeSlot, subjectTeacherId, actualNumber, totalNumber } = this.selectionList[0]
      const bstudentList = []
      const newList = objDeepCopy(this.addedList)
      const customerIds = []
      newList.forEach(item => {
        customerIds.push(item.customerId)
      })
      // 去重
      const newCustomerIds = Array.from(new Set(customerIds))
      for (let index = 0; index < newCustomerIds.length; index++) {
        const element = newCustomerIds[index]
        const stuList = []
        for (let indexs = 0; indexs < this.addedList.length; indexs++) {
          const selement = this.addedList[indexs]
          if (element == selement.customerId) {
            stuList.push({
              customerId: selement.customerId,
              rId: selement.rId,
              classtimeBatchId: batchId
            })
          }
        }
        bstudentList.push({
          list: stuList
        })
      }
      // 班级中的时间段
      const timeLists = []
      if (this.crmType == 'class') {
        if (!this.checkList.length) {
          return this.$message.error('请勾选上课时间段')
        }
        if (!this.addedList.length) {
          return this.$message.error('请添加学员')
        }
        this.checkList.forEach(item => {
          timeLists.push({
            timeId: item.timeId,
            batchId: item.batchId,
            classId,
            classroomId,
            classTime: item.classTime,
            timeSlot: item.timeSlot,
            subjectTeacherId: item.subjectTeacherId,
            actualNumber: item.actual
          })
        })
      }

      const params = {
        list1: this.crmType == 'class' ? timeLists : [{ timeId, batchId, classId, classroomId, classTime, timeSlot, subjectTeacherId, actualNumber }],
        list2: bstudentList,
        totalNumber
      }

      crmClassSchduleInsertClassSave(params).then(res => {
        this.hidenView()
        this.$message.success('操作成功')
        this.$emit('save-success', { type: 'insert_class' })
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

.crm-create-flex {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding-bottom: 10px;
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

.content-body {
  height: calc(100% - 30px);
  // min-height: 250px;
  padding: 10px 20px 30px;
  overflow-y: auto;
}

.student-wrap {
  position: relative;
  .add-customer {
    position: absolute;
    top: 0;
    right: 20px;
  }
}

/deep/ .el-table--border {
  border: 1px solid #EBEEF5;
}

</style>


