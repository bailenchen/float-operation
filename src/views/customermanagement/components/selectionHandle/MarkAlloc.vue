<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-14 11:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" title="业绩分配" @close="handleCancel">
    <div class="list-wrap">
      <div v-for="(items, index) in list" :key="index" class="main">
        <div class="main-item">
          <div class="follow-label"><i class="mark">*</i>成员：</div>
          <div class="form" style="margin-right: 10px;">
            <xh-user-cell
              :value="items.userList"
              class="handle-item-content"
              placeholder="点击选择"
              @value-change="changeUser($event, index)"/>
          </div>
        </div>
        <div class="main-item">
          <div class="follow-label"><i class="mark">*</i>业绩比例：</div>
          <div class="form" style="margin-right: 10px;">
            <el-select v-model="items.performanceRatio" placeholder="请选择">
              <el-option
                v-for="item in rateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </div>
        </div>
        <div class="main-item">
          <div class="follow-label"><i class="mark">*</i>新签学员数比例：</div>
          <div class="form">
            <el-select v-model="items.newStudentRatio" placeholder="请选择">
              <el-option
                v-for="item in newRateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </div>
        </div>
        <i
          v-if="list.length > 1"
          class="el-icon-remove"
          @click="deleteItem(items, index)"/>
      </div>
      <span class="add-line" @click="addLine">+ 添加一行</span>
      <div class="class-teacher">
        <div class="alloc-label">分配班主任：</div>
        <xh-user-cell
          :value="classList"
          :disabled="selectionList.length && selectionList[0].headmasterUserName ? true : false"
          class="handle-item-content"
          placeholder="点击选择"
          @value-change="userChage"/>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">提交审核</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { XhUserCell } from '@/components/CreateCom'
import { markAllocSaveAPI, queryMarkAllocSaveAPI } from '@/api/customermanagement/contract'
import { queryDictionaryField } from '@/api/common'
import { Loading } from 'element-ui'
import { objDeepCopy } from '@/utils'

export default {
  name: 'MarkAlloc',
  components: {
    XhUserCell
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
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
      list: [
        { userList: [], performanceRatio: '', newStudentRatio: '' }
      ],
      rateList: [],
      newRateList: [],
      classList: []
    }
  },
  watch: {
    visible(val) {
      if (this.selectionList.length && val) {
        this.list = [{ userList: [], performanceRatio: '', newStudentRatio: '' }]
        if (this.selectionList[0].headmasterUserName) {
          this.classList = [{
            userId: this.selectionList[0].headmasterUserId,
            realname: this.selectionList[0].headmasterUserName
          }]
        } else {
          this.classList = []
        }
        this.queryRate('new_student_ratio')
        this.queryRate('performance_ratio')
        this.queryAlloc()
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.selectionList.length) {
      this.queryAlloc()
    }
  },
  methods: {
    /** 负责人更改 */
    userChage(data) {
      this.classList = data.value
    },
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    addLine() {
      this.list.push({
        userList: [], performanceRatio: '', newStudentRatio: ''
      })
    },

    // 修改成员
    changeUser(data, index) {
      this.$set(this.list[index], 'userList', data.value)
    },

    queryRate(field) {
      queryDictionaryField({ dictionaryField: field }).then(res => {
        if (field === 'new_student_ratio') {
          this.newRateList = res.data.map(item => {
            item.label = item.dictionaryName
            item.value = item.dictionaryId
            return item
          })
        } else if (field === 'performance_ratio') {
          this.rateList = res.data.map(item => {
            item.label = item.dictionaryName
            item.value = item.dictionaryId
            return item
          })
        }
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },

    /**
     * 删除事项操作
     */
    deleteItem(item, index) {
      this.list.splice(index, 1)
    },

    // 查询业绩分配
    queryAlloc() {
      queryMarkAllocSaveAPI({ contractId: this.selectionList[0].contractId }).then(res => {
        const allocList = res.data.allot
        if (allocList.length) {
          this.list = []
          for (let index = 0; index < allocList.length; index++) {
            const element = allocList[index]
            this.list.push({
              contractAllotId: element.contractAllotId,
              userList: [{ userId: element.memberUserId, realname: element.memberUserName }],
              performanceRatio: element.performanceRatio,
              newStudentRatio: element.newStudentRatio
            })
          }
        }
      }).catch(() => {

      })
    },

    /**
     * 确定
     */
    handleConfirm() {
      const lists = []
      let perNum = 0
      let newNum = 0
      const memList = []
      const newList = objDeepCopy(this.list)
      for (let index = 0; index < newList.length; index++) {
        const element = newList[index]
        if (!element.userList.length) {
          return this.$message.error('请选择成员')
        }
        if (element.performanceRatio === '') {
          return this.$message.error('请选择业绩比例')
        }
        if (element.newStudentRatio === '') {
          return this.$message.error('请选择新签学员数比例')
        }
        perNum += Number(element.performanceRatio)
        newNum += Number(element.newStudentRatio)
        lists.push({
          contractAllotId: element.contractAllotId,
          memberUserId: element.userList[0].userId,
          performanceRatio: element.performanceRatio,
          newStudentRatio: element.newStudentRatio
        })
        memList.push(element.userList[0].userId)
      }

      const mlength = Array.from(new Set(memList))
      if (mlength.length !== memList.length) {
        return this.$message.error('成员不能重复')
      }

      if (perNum > 100 || newNum > 100) {
        return this.$message.error('所有业绩比例之和、新签学员数比例之和均不得超过100%')
      }
      const params = {
        contractId: this.selectionList[0].contractId,
        userId: this.classList.length ? this.classList[0].userId : null,
        allots: lists
      }
      const loading = Loading.service({
        target: document.querySelector(`.el-dialog[aria-label="业绩分配"]`)
      })
      markAllocSaveAPI(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        loading.close()
        this.$emit('handle', {
          type: 'mark_alloc'
        })
        this.handleCancel()
      }).catch(() => {
        loading.close()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.list-wrap {
    padding: 30px 20px;
    height: 300px;
    overflow: auto;
}
.main {
    overflow: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
}
/deep/ .el-dialog {
    width: 700px !important;
}

/deep/ .el-textarea__inner {
  height: 150px;
}

/deep/ .el-dialog__body {
  padding: 0;
}

/deep/ .el-dialog__footer {
  padding: 10px 25px 10px 10px !important
}

/deep/ .el-form-item__label {
    text-align: left;
    width: 130px !important;
}

/deep/ .el-form-item__content {
    margin-left: 130px !important;
}

.main-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.main-item .follow-label {
    white-space: nowrap;
    line-height: 34px;
}

.main-item .form {
    width: 125px;
}

.el-icon-remove {
    color: #ff6767;
    cursor: pointer;
    margin-left: 2px;
    display: none;
}

.main:hover {
  .el-icon-remove {
    display: inline;
  }
}

.add-line {
    color: #2362FB;
    cursor: pointer;
}

.class-teacher {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    .alloc-label {
        white-space: nowrap;
        line-height: 34px;
    }
    .handle-item-content {
        width: 125px;
    }
}

.mark {
    font-style: normal;
    color: #ff6767;
}
</style>
