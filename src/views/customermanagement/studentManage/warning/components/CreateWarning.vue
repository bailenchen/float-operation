<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">添加预警</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <flexbox
        class="crm-create-flex"
        direction="column"
        align="stretch">
        <div
          class="crm-create-body">
          <el-form
            ref="ruleForm"
            :rules="rule"
            :model="form"
            label-position="top"
            class="crm-create-box">
            <el-form-item
              v-for="(item, indexs) in datalist"
              :style="{'padding-left': getPaddingLeft(item, indexs), 'padding-right': getPaddingRight(item, indexs)}"
              :label="item.label"
              :prop="item.prop"
              :key="indexs" class="crm-create-item">
              <el-input
                v-if="item.type == 'tear'"
                v-model="form[item.prop]"
                type="textarea" />

              <xh-structure-cell
                v-if="item.type == 'dept'"
                :value="deptSelectValue"
                radio
                class="xh-structure-cell"
                @value-change="structureChange" />

              <crm-relative-cell
                v-if="item.type == 'customer'"
                :item="{crmType:'customer'}"/>

            </el-form-item>
          </el-form>

        </div>
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
import {
  XhStructureCell,
  CrmRelativeCell
} from '@/components/CreateCom'

export default {
  name: 'CreateWarning',
  components: {
    CreateView,
    XhStructureCell, // 所属中心组件
    CrmRelativeCell
  },
  props: {
    selectionList: {
      type: Array,
      default() {
        return []
      }
    },
    type: String
  },
  data() {
    return {
      loading: false,
      radio: false,
      datalist: [
        { prop: 'studentName', label: '学员姓名', type: 'customer' },
        { prop: 'deptId', label: '学习中心', type: 'dept' },
        { prop: 'classType', label: '预警原因', type: 'tear' }
      ],
      rule: {
        studentName: [
          { required: true, message: '请选择校区', trigger: ['blur', 'change'] }
        ],
        deptId: [
          { required: true, message: '请选择辅导方式', trigger: ['blur', 'change'] }
        ],
        classType: [
          { required: true, message: '请选择班级类型', trigger: ['blur', 'change'] }
        ]
      },
      deptSelectValue: [],
      classRoom: [],
      teacherList: [],
      teacherId: '',
      form: {
        deptId: '',
        gradeId: null,
        coachType: null,
        subjectId: null,
        subjectTeacherId: null,
        classroomId: null,
        classType: null,
        className: '',
        remarks: ''
      },

      // 下拉选项
      option: {
        gradeId: [],
        coachType: [],
        subjectId: [],
        classroomId: [],
        classType: []
      }
    }
  },
  created() {
    if (this.type == 'edit') {
      const {
        deptId,
        deptName,
        gradeId,
        coachType,
        subjectId,
        subjectTeacherId,
        classroomId,
        classType,
        className,
        remarks
      } = this.selectionList[0]
      this.deptSelectValue = [{
        id: deptId,
        name: deptName
      }]
      this.querySubjectGrade(subjectTeacherId)
      this.form = {
        deptId: deptId,
        gradeId: gradeId,
        coachType: coachType,
        subjectId: subjectId,
        subjectTeacherId: subjectTeacherId,
        classroomId: classroomId,
        classType: classType,
        className: className,
        remarks: remarks
      }
    }
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view')
    },

    /**
     * 中心选择
     */
    structureChange(data) {
      console.log(data, 'vvvvv')
      this.form.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
      this.deptName = data.value.length ? data.value[0].deptNumber : ''
    },

    /**
     * 关联老师
     */
    userChange(data) {
      this.form.subjectTeacherId = data.value.length ? data.value[0].userId : ''
    },

    /**
     * 保存
     */
    submitForm() {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (valid) {
    //       this.loading = true
    //       const params = {
    //         entity: {
    //           ...this.form
    //         }
    //       }
    //       crmClassSave(params).then(res => {
    //         this.loading = false

    //         this.hidenView()
    //         this.$message.success('操作成功')
    //         if (this.type) {
    //           this.$emit('save-success', { type: 'mode_class' })
    //         } else {
    //           this.$emit('save')
    //         }
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     }
    //   })
    },

    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return index % 2 == 0 ? '0' : '40px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return index % 2 == 0 ? '40px' : '0'
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
</style>


