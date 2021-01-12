<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">课时确认</div>
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
        <create-sections title="学员信息">
          <div class="crm-create-body" style="margin-top:10px;">
            <div class="content create-sections-content">
              <el-table
                id="crm-table"
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
                <el-table-column fixed="right" width="90" align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleLeave(scope.row.id)">请假</el-button>
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
          @click.native="submitForm">课时确认</el-button>
      </div>
    </flexbox>
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'

import { crmClassSchduleConfirmInfo, crmClassSchduleConfirmLeave, crmClassSchduleConfirmSave } from '@/api/educationmanage/classSchedule'

export default {
  name: 'ConfirmClassTime',
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

      fieldObj: {
        deptName: '中心',
        className: '班级名称',
        subjectTeacherName: '学科老师',
        timeSlot: '上课时段',
        classroomName: '教室',
        subjectName: '科目',
        gradeName: '年级',
        classConfirmation: '状态'
      },
      baseInfoList: [],

      // 学员合同表
      list: [{ num: '123465' }],
      fieldLists: [
        { prop: 'customerName', label: '学员姓名' },
        { prop: 'num', label: '合同编号' },
        { prop: 'gradeName', label: '年级' },
        { prop: 'subjectName', label: '科目' },
        { prop: 'sumCourse', label: '合同课次' },
        { prop: 'endCourse', label: '结课课次' },
        { prop: 'alreadyCourse', label: '已排课次' },
        { prop: 'classStatusName', label: '上课状态' }
      ],
      checkList: []

    }
  },
  computed: {

  },
  created() {
    this.queryBaseInfo()
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view', 'confirm')
    },

    // 获取基本信息与学员信息
    queryBaseInfo() {
      crmClassSchduleConfirmInfo({ timeId: this.selectionList[0].timeId }).then(res => {
        const data = res.data
        for (const key in this.fieldObj) {
          if (Object.hasOwnProperty.call(this.fieldObj, key)) {
            const element = this.fieldObj[key]
            this.baseInfoList.push({
              name: element,
              value: this.handleValue(key, data)
            })
          }
        }
        this.list = data.students
      }).catch((err) => {
        console.log(err)
      })
    },

    handleValue(key, data) {
      if (key === 'classConfirmation') {
        return { 1: '确认', 2: '未确认' }[data[key]]
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

    // 请假操作
    handleLeave(id) {
      this.$confirm('确认请假?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crmClassSchduleConfirmLeave({ ids: id }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消请假'
        })
      })
    },

    // 勾选
    handleSelectionChange(data) {
      this.checkList = data
      console.log(data)
    },

    /**
     * 保存
     */
    submitForm() {
      if (!this.checkList.length) {
        this.$message.error('请勾选需要课时确认的学员')
      }
      const ids = []
      for (let index = 0; index < this.checkList.length; index++) {
        const element = this.checkList[index]
        ids.push(element.id)
      }
      const params = {
        ids: ids.join(','),
        timeId: this.selectionList[0].timeId
      }
      crmClassSchduleConfirmSave(params).then(res => {
        this.hidenView()
        this.$message.success('操作成功')
        this.$emit('save-success', { type: 'confirm' })
      }).catch(() => {

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

.crm-create-flex {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
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

/deep/ .el-table--border {
  border: 1px solid #EBEEF5;
}
</style>


