<template>
  <div class="add-wrap">
    <!-- 添加学员 -->
    <el-popover
      v-model="showPopover"
      placement="right"
      width="700"
      trigger="click">
      <crm-relative
        v-if="showSelectView"
        ref="crmrelative"
        :show-types="showTypes"
        crm-type="student"
        @close="showPopover=false"
        @changeCheckout="checkInfos"/>
      <el-button
        slot="reference"
        type="primary"
        size="mini"
        class="add-customer"
        @click.native="contentClick">添加学员</el-button>
      <el-button
        v-if="stuType && !originalTimeList.length"
        slot="reference"
        type="primary"
        size="mini"
        class="add-customer"
        @click="disabledAdd">添加学员</el-button>
    </el-popover>
    <div class="crm-create-body" style="margin-top:10px;">
      <div class="content create-sections-content">
        <!-- 已勾选数据列表 -->
        <div style="line-height:25px;">
          <span>已添加的学员</span>&nbsp;
          <el-select v-model="addedListVal" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) in addedStuList"
              :key="index++"
              :label="item.customerName"
              :value="item.customerId"/>
          </el-select>
        </div>

        <!-- <el-table
          id="crm-table"
          :row-height="40"
          :data="addedList"
          :height="300"
          class="n-table--border"
          use-virtual
          stripe
          border
          highlight-current-row
          style="width: 100%">
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
              {{ scope.row[item.prop] }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="110" align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteAddItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
        <!-- 列表顶部信息 -->
        <flexbox
          :gutter="0"
          align="stretch"
          wrap="wrap"
          style="padding: 10px 8px;">
          <flexbox-item
            v-for="(item, index) in stuInfoList"
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
        <!-- 列表信息 -->
        <el-table
          id="crm-table"
          ref="multipleTables"
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
            :selectable="selectable"
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
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import CrmRelative from '@/components/CreateCom/CrmRelative'
import { crmClassContractIndext } from '@/api/educationmanage/class'

export default {
  name: 'AddStudent',
  components: {
    CrmRelative
  },
  props: {
    // 满班人数
    baseInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    originalTimeList: {
      type: Array,
      default() {
        return []
      }
    },
    timeList: {
      type: Array,
      default() {
        return []
      }
    },
    stuType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 已勾选数据
      addedList: [], // 勾选的合同数据
      addedListVal: [],
      addedStuList: [],
      stuInfo: [], // 当前添加的学员基本信息

      stuObj: {
        deptName: '所在校区',
        leadsNumber: '学员编号',
        customerName: '学员姓名',
        gradeName: '年级',
        school: '就读学校',
        contractStatus: '状态',
        ownerUserName: '教育顾问',
        headmasterUserName: '班主任'
      },
      stuInfoList: [],

      // 学员合同表
      list: [],
      fieldLists: [
        { prop: 'num', label: '合同编号', width: 150 },
        { prop: 'isnew', label: '合同属性', width: 90 },
        { prop: 'coachType', label: '合同类型', width: 90 },
        { prop: 'orderDate', label: '签约日期', width: 150 },
        { prop: 'isGive', label: '是否赠送', width: 90 },
        { prop: 'subjectName', label: '科目', width: 60 },
        { prop: 'sumCourse', label: '课次', width: 60 },
        { prop: 'alreadyCourse', label: '已排课次', width: 90 },
        { prop: 'notArranged', label: '未排课次', width: 90 },
        { prop: 'finishCourse', label: '已完成课次', width: 90 }
      ],

      showPopover: false,
      showSelectView: false,
      showTypes: [],
      addStuCustomerId: null,

      // 当勾选发生变化时是否执行
      isExecute: true,

      checkGradeName: ''

    }
  },
  methods: {
    disabledAdd() {
      if (!this.originalTimeList.length) {
        return this.$message.error('没有上课时间段，无法添加学员')
      }
    },
    contentClick() {
      this.showSelectView = true
    },

    /** 选中 */
    checkInfos(seldata) {
      // 对于校区不一致的做出提示
      const checkList = seldata.data
      if (checkList.length) {
        const { deptId } = this.baseInfo
        for (let index = 0; index < checkList.length; index++) {
          const element = checkList[index]
          if (element.deptId != deptId) {
            return this.$message.error('勾选的数据中含有与该班级中心不一致的学员')
          }
        }
      }
      if (this.timeList.length) {
        const totalList = []
        for (let index = 0; index < this.timeList.length; index++) {
          const element = this.timeList[index]
          totalList.push(...element.students)
        }

        for (let index = 0; index < totalList.length; index++) {
          const element = totalList[index]
          if (element.customerId === seldata.data[0].customerId) {
            return this.$message.error('添加的学员已存在该班级')
          }
        }
      }
      const { totalNumber } = this.baseInfo
      const list = this.arrayObjRepeat(this.addedList, 'customerId')
      if (totalNumber > list.length) {
        const data = seldata.data
        if (data && data.length) {
          this.getContractList(data[0].customerId)
        }
      } else {
        this.$message.error('添加的学员人数不能超过满班人数')
      }
    },

    // 禁用学科、辅导方式、年级不相等的
    selectable(row, index) {
      const { subjectName, coachType } = this.baseInfo
      if (row.subjectName === subjectName && row.coachType === coachType) {
        return true // 可用
      } else {
        return false // 禁用
      }
    },

    // 添加学员并获取对应的合同
    getContractList(id) {
      this.stuInfoList = []
      this.list = []
      this.isExecute = false // 此时阻止勾选自动执行
      crmClassContractIndext({ customerId: id }).then(res => {
        const stuInfo = res.data
        this.stuInfo = stuInfo
        this.checkGradeName = res.data.gradeName
        this.addStuCustomerId = stuInfo.customerId
        this.resetDataByCustomerId(this.addStuCustomerId)
        for (const key in this.stuObj) {
          if (Object.hasOwnProperty.call(this.stuObj, key)) {
            const element = this.stuObj[key]
            this.stuInfoList.push({
              name: element,
              value: stuInfo[key]
            })
          }
        }
        this.list = res.data.list
        this.isExecute = true
      }).catch((err) => {
        this.isExecute = true
        console.log(err)
      })
    },
    // 勾选同时去重
    handleSelectionChange(data) {
      if (this.isExecute) {
        if (this.timeList.length) {
          const filterData = []
          const useData = []
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            for (let indexs = 0; indexs < this.timeList.length; indexs++) {
              const item = this.timeList[indexs]
              if (item.customerId.includes(element.customerId)) {
                filterData.push(element)
              } else {
                useData.push(element)
              }
            }
          }
          if (filterData.length) {
            data = this.toggleSelection(filterData)
          }

          if (filterData.length > 1) {
            data = useData
            return this.$message.error('勾选的数据中包含已存在学员')
          } else if (filterData.length == 1) {
            return this.$message.error('该学员已存在')
          }
        }
        const { customerId, customerName } = this.stuInfo
        debugger
        this.addedStuList.push({
          customerId, customerName
        })

        if (!this.addedListVal.includes(customerId)) {
          this.addedListVal.push(customerId)
        }

        this.resetDataByCustomerId(this.addStuCustomerId)
        this.addedList.push(...data)
        this.addedList = this.arrayObjRepeat(this.addedList, 'rId')
        this.sendData()
      }
    },

    // 校正勾选时间段
    toggleSelection(filterData) {
      if (filterData.length) {
        filterData.forEach(row => {
          this.$refs.multipleTables.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTables.clearSelection()
      }
    },

    // 删除已添加的数据
    deleteAddItem(index) {
      this.addedList.splice(index, 1)
      this.sendData()
    },

    sendData() {
      this.$emit('added-stu', this.addedList)
    },

    // 数组对象去重
    arrayObjRepeat(list, id) {
      if (list.length) {
        const hash = {}
        const newList = list.reduce((preVal, curVal) => {
          hash[curVal[id]] ? '' : hash[curVal[id]] = true && preVal.push(curVal)
          return preVal
        }, [])
        return newList
      }
      return []
    },

    // 每次勾选都重置customerId一样的数据
    resetDataByCustomerId(id) {
      console.log(this.addedList, 'hhhhhh')
      this.addedList = this.addedList.filter(item => {
        return item.customerId !== id
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.add-wrap {
    padding: 0 10px;
}

.add-customer {
    position: absolute;
    top: 0;
    right: 20px;
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

</style>
