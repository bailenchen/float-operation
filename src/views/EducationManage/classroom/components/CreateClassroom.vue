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

              <el-select v-if="item.type == 'select'" v-model="form[item.prop]" placeholder="请选择" style="width:100%">
                <el-option v-for="(ites, inds) in optionList" :label="ites.label" :key="inds" :value="ites.value"/>
              </el-select>

              <xh-structure-cell
                v-if="item.type == 'dept'"
                :value="deptSelectValue"
                radio
                class="xh-structure-cell"
                @value-change="structureChange" />

              <xh-user-cell
                v-if="item.type == 'user'"
                :radio="radio"
                :value="teacherList"
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
  crmClassroomSave
} from '@/api/educationmanage/classroom'

export default {
  name: 'CreateClassroom',
  components: {
    CreateView,
    XhStructureCell, // 所属中心组件
    XhUserCell // 员工组件
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
      radio: false,
      datalist: [
        { prop: 'deptId', label: '中心', type: 'dept' },
        { prop: 'relatedTeachers', label: '关联老师', type: 'user' },
        { prop: 'classroomName', label: '教室名称', type: 'text' },
        { prop: 'status', label: '教室状态', type: 'select' }
      ],
      optionList: [
        { label: '正常', value: 1 }
      ],
      rule: {
        deptId: [
          { required: true, message: '请选择中心', trigger: 'blur' }
        ],
        relatedTeachers: [
          { required: true, message: '请选择关联老师', trigger: 'blur' }
        ],
        classroomName: [
          { required: true, message: '教室名称为必填', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择教室状态', trigger: 'change' }
        ]
      },
      deptSelectValue: [],
      teacherList: [],
      form: {
        deptId: '',
        relatedTeachers: '',
        classroomName: '',
        status: 1
      }
    }
  },
  computed: {
    title() {
      if (this.handle.action == 'add') {
        return '添加教室'
      }
      if (this.type == 'edit') {
        return '编辑教室'
      }
    }
  },
  created() {
    if (this.type == 'edit') {
      console.log(this.selectionList, '123')
      const detail = this.selectionList[0]
      this.deptSelectValue = [{
        id: detail.deptId,
        name: detail.deptName
      }]
      this.teacherList = detail.adminUsers
      const ids = ['']
      this.teacherList.forEach(item => {
        ids.push(item.userId)
      })
      this.form = {
        deptId: detail.deptId,
        relatedTeachers: String(ids),
        classroomName: detail.classroomName,
        status: detail.status,
        classroomId: detail.classroomId
      }
    }
  },
  methods: {
    hidenView() {
      if (this.type) {
        this.$emit('hiden-view', 'mode')
      } else {
        this.$emit('hiden-view')
      }
    },

    /**
     * 中心选择
     */
    structureChange(data) {
      this.form.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
    },

    /**
     * 关联老师
     */
    userChange(data) {
      const ids = ['']
      const names = []
      data.value.forEach(item => {
        ids.push(item.userId)
        names.push(item.realname)
      })
      this.form.relatedTeachers = String(ids)
      this.form.classroomName = String(names)
      this.teacherList = data.value || []
    },

    /**
     * 保存
     */
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            entity: this.form
          }
          crmClassroomSave(params).then(res => {
            this.loading = false

            this.hidenView()
            if (this.type) {
              this.$emit('save-success', { type: 'mode' })
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


