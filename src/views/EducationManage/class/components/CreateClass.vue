<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title }}</div>
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
                v-if="item.type == 'text'"
                v-model="form[item.prop]"/>

              <el-input
                v-if="item.type == 'tear'"
                v-model="form[item.prop]"
                type="textarea" />

              <el-select
                v-if="item.type== 'select' || item.type== 'sub'"
                v-model="form[item.prop]"
                placeholder="请选择"
                style="width:100%;"
                @change="fieldChange($event, item.prop)">
                <el-option
                  v-for="item in option[item.prop]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>

              <xh-structure-cell
                v-if="item.type == 'dept'"
                :value="deptSelectValue"
                radio
                class="xh-structure-cell"
                @value-change="structureChange" />

              <xh-structure-cell
                v-if="item.type === 'classroom'"
                :value="classRoom"
                :radio="radio"
                :disabled="!form.deptId"
                :classroom-id="form.deptId"
                cell-type="classroom"
                placeholder="选择教室"
                class="xh-structure-cell"
                @value-change="classroomChange" />

              <xh-user-cell
                v-if="item.type == 'user'"
                :radio="radio"
                :teacher-id="teacherId"
                :disabled="!form.classroomId"
                :value="teacherList"
                info-type="relativeteacher"
                @value-change="userChange"/>


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
  XhUserCell
} from '@/components/CreateCom'
import {
  QueryAdminGrade,
  QueryCoachingMethods // 辅导方式
} from '@/api/systemManagement/params'

import { crmClassTypeSelectList } from '@/api/educationmanage/classSchedule'
import { crmClassSave, crmClassQuerySubjectGrade } from '@/api/educationmanage/class'

export default {
  name: 'CreateClass',
  components: {
    CreateView,
    XhStructureCell, // 所属中心组件
    XhUserCell
  },
  props: {
    handle: {
      type: Object,
      default: () => {
        return {
          action: '', // save 创建  update 编辑
          data: null // 编辑数据
        }
      }
    },
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
      radio: true,
      datalist: [
        { prop: 'deptId', label: '校区', type: 'dept' },
        { prop: 'coachType', label: '辅导方式', type: 'select' },
        { prop: 'classType', label: '班级类型', type: 'select' },
        { prop: 'classroomId', label: '教室', type: 'classroom' },
        { prop: 'subjectTeacherId', label: '学科老师', type: 'user' },
        { prop: 'subjectId', label: '科目', type: 'sub' },
        { prop: 'gradeId', label: '年级', type: 'select' },
        { prop: 'className', label: '班级名称', type: 'text' },
        { prop: 'remarks', label: '备注', type: 'tear' }
      ],
      rule: {
        deptId: [
          { required: true, message: '请选择校区', trigger: ['blur', 'change'] }
        ],
        gradeId: [
          { required: true, message: '请选择年级', trigger: ['blur', 'change'] }
        ],
        coachType: [
          { required: true, message: '请选择辅导方式', trigger: ['blur', 'change'] }
        ],
        classType: [
          { required: true, message: '请选择班级类型', trigger: ['blur', 'change'] }
        ],
        subjectTeacherId: [
          { required: true, message: '请选择学科老师', trigger: ['blur', 'change'] }
        ],
        classroomId: [
          { required: true, message: '请选择教室', trigger: ['blur', 'change'] }
        ],
        subjectId: [
          { required: true, message: '请选择科目', trigger: ['blur', 'change'] }
        ],
        className: [
          { required: true, message: '班级名称为必填项', trigger: 'blur' }
        ]
      },
      deptSelectValue: [],
      classRoom: [],
      teacherList: [],
      teacherId: '',
      form: {
        deptId: null,
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
      },

      // name
      deptName: '',
      gradeName: '',
      subjectName: '',

      totalNumber: null
    }
  },
  computed: {
    title() {
      if (this.handle.action == 'add') {
        return '添加班级'
      }
      if (this.type == 'edit') {
        return '编辑班级'
      }
    }
  },
  created() {
    // this.getSubject()
    // this.getGradeSelect()
    this.getWaySelect()
    if (this.type == 'edit') {
      const {
        deptId,
        deptName,
        gradeId,
        coachType,
        subjectId,
        subjectTeacherId,
        subjectTeacherName,
        classroomId,
        classroomName,
        classType,
        className,
        remarks,
        totalNumber
      } = this.selectionList[0]
      this.totalNumber = totalNumber
      this.deptSelectValue = [{
        id: deptId,
        name: deptName
      }]
      this.classRoom = [{
        classroomId: classroomId,
        classroomName: classroomName
      }]
      this.teacherList = [{
        userId: subjectTeacherId,
        realname: subjectTeacherName
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
      if (this.type) {
        this.$emit('hiden-view', 'mode_class')
      } else {
        this.$emit('hiden-view')
      }
    },

    /**
     * 中心选择
     */
    structureChange(data) {
      console.log(data, 'vvvvv')
      this.form.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
      this.deptName = data.value.length ? data.value[0].deptNumber : ''
      this.paddingClassName()

      // 改变中心时重置相关项
      this.form.classroomId = ''
      this.classRoom = []
      this.teacherId = ''
      this.form.subjectTeacherId = ''
      this.teacherList = []

      this.option.subjectId = []
      this.form.subjectId = null
      this.form.className = ''
      this.subjectName = ''
    },
    // 教室选择
    classroomChange(data) {
      this.form.classroomId = data.value.length ? data.value[0].classroomId : ''
      this.classRoom = data.value || []
      this.teacherId = data.value.length ? data.value[0].relatedTeachers : ''

      // 改变教室重置相关项
      this.form.subjectTeacherId = ''
      this.teacherList = []
      this.option.subjectId = []
      this.form.subjectId = null
      this.subjectName = ''
    },

    /**
     * 关联老师
     */
    userChange(data) {
      this.form.subjectTeacherId = data.value.length ? data.value[0].userId : ''
      // 先重置学科与科目
      this.option.subjectId = []
      this.form.subjectId = null
      this.subjectName = ''
      if (this.form.subjectTeacherId) {
        this.querySubjectGrade(this.form.subjectTeacherId)
      }
    },

    // 同时获取学科与年级
    querySubjectGrade(id) {
      crmClassQuerySubjectGrade({ userId: id }).then(res => {
        const { grades, subjects } = res.data
        this.option.gradeId = grades.map(item => {
          item.label = item.gradeName
          item.value = item.id
          return item
        })
        this.option.subjectId = subjects.map(item => {
          item.label = item.subjectName
          item.value = item.id
          return item
        })
        console.log(res, 'sg')
        this.loading = false
      }).catch(() => {})
    },

    fieldChange(data, name) {
      if (name == 'coachType') {
        this.option.coachType.forEach(item => {
          if (data === item.value) {
            this.totalNumber = item.standby
          }
        })
        this.queryClassType(data)
      } else if (name == 'subjectId') {
        this.option.subjectId.forEach(item => {
          if (item.value == data) {
            this.subjectName = item.label
          }
        })
        this.paddingClassName()
      } else if (name == 'gradeId') {
        this.option.gradeId.forEach(item => {
          if (item.value == data) {
            this.gradeName = item.label
          }
        })
        this.paddingClassName()
      }
    },

    // 班级名称填充
    paddingClassName() {
      if (this.form.deptId && this.form.gradeId && this.form.subjectId) {
        this.form.className = `${this.deptName}-${this.gradeName}-${this.subjectName}-${this.rand(1000, 9999)}`
      }
    },

    // 随机四位数
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },

    // 获取辅导方式
    getWaySelect() {
      this.loading = true
      QueryCoachingMethods().then(res => {
        this.option.coachType = res.data.map(item => {
          item.label = item.name
          item.value = item.dictionaryId
          return item
        })
        if (this.handle.action == 'add') {
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },

    // getGradeSelect() {
    //   this.loading = true
    //   QueryAdminGrade().then(res => {
    //     this.option.gradeId = res.data.map(item => {
    //       item.label = item.gradeName
    //       item.value = item.id
    //       return item
    //     })
    //   }).catch(() => {
    //     this.loading = false
    //   })
    // },


    // 根据辅导方式查询班级类型
    queryClassType(id) {
      const params = {
        pId: id
      }
      crmClassTypeSelectList(params).then(res => {
        this.form.classType = null
        this.option['classType'] = res.data.map(item => {
          item.label = item.name
          item.value = item.dictionaryId
          return item
        }) || []
      }).catch(() => {})
    },

    /**
     * 保存
     */
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            entity: {
              totalNumber: this.totalNumber,
              ...this.form
            }
          }
          crmClassSave(params).then(res => {
            this.loading = false

            this.hidenView()
            this.$message.success('操作成功')
            if (this.type) {
              this.$emit('save-success', { type: 'mode_class' })
            } else {
              this.$emit('save')
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
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


