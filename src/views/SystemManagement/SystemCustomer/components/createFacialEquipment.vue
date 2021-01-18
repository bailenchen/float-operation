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
                :disabled="item.disabled"
                v-model="form[item.prop]"/>

              <el-select v-if="item.type == 'select'" v-model="form[item.prop]" style="width:100%" placeholder="请选择" @change="changeHandle">
                <el-option
                  v-for="item in depList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

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
import { sysConfigFacialEquipmentSaveAPI } from '@/api/systemManagement/SystemCustomer'
import { depListDetailAPI } from '@/api/systemManagement/EmployeeDepManagement'

export default {
  name: 'CreateFacialEquipment',
  components: {
    CreateView
  },
  // props: {
  //   handle: {
  //     type: Object,
  //     default: () => {
  //       return {
  //         action: 'add', // save 创建  update 编辑
  //         data: null // 编辑数据
  //       }
  //     }
  //   }
  // },
  data() {
    return {
      loading: false,
      datalist: [
        { prop: 'deptId', label: '校区ID', type: 'select', disabled: false },
        { prop: 'deptName', label: '校区名称', type: 'text', disabled: true },
        { prop: 'corporateName', label: '公司名称', type: 'text', disabled: true },
        { prop: 'equipmentNumber', label: '设备编号', type: 'text', disabled: false }
      ],
      depList: [],
      rule: {
        deptId: [
          { required: true, message: '请选择校区', trigger: ['blur', 'change'] }
        ],
        equipmentNumber: [
          { required: true, message: '设备编号', trigger: 'blur' }
        ]
      },
      form: {
        deptId: '',
        deptName: '',
        corporateName: '',
        equipmentNumber: ''
      }
    }
  },
  computed: {
    title() {
      /* return {
        'add': '新增设备',
        'edit': '编辑设备'
      }[this.handle.action] */
      return '新增设备'
    }
  },
  created() {
    depListDetailAPI().then(res => {
      console.log(res)
      this.depList = res.data
    }).catch(() => {})
  },
  methods: {
    changeHandle(val) {
      console.log('val', val)
      const deptInfo = this.depList.filter(item => {
        return item.id == val
      })[0]
      console.log('deptInfo', deptInfo)
      /* this.form.deptName = deptInfo.name.replace(/.*-(.*)/, (match, p1) => {
        return p1
      }) */
      this.form.deptName = deptInfo.name
      this.form.corporateName = deptInfo.corporateName
    },
    hidenView() {
      this.$emit('hiden-view')
    },

    /**
     * 保存
     */
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            deptId: this.form.deptId,
            equipmentNumber: this.form.equipmentNumber
          }
          sysConfigFacialEquipmentSaveAPI(params).then(res => {
            this.loading = false
            // this.$emit('hiden-view')
            this.$emit('save')
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

// .crm-create-flex {
//   position: relative;
//   overflow-x: hidden;
//   overflow-y: auto;
//   flex: 0;
// }
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


