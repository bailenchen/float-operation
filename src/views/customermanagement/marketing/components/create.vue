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
      <div class="crm-create-flex">
        <create-sections title="基本信息">
          <flexbox
            direction="column"
            align="stretch">
            <div class="crm-create-body">
              <el-form
                ref="dataForm"
                :model="dataForm"
                :rules="dataRules"
                label-position="top"
                class="crm-create-box">
                <el-form-item
                  v-for="(item, index) in fieldList"
                  :key="item.field"
                  :prop="item.field"
                  :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}"
                  class="crm-create-item">
                  <div
                    slot="label"
                    style="display: inline-block;">
                    <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                      {{ item.name }}
                      <span style="color:#999;">
                        {{ item.inputTips ? '（'+item.inputTips+'）':'' }}
                      </span>
                    </div>
                  </div>
                  <!-- 员工 和部门 为多选（radio=false）  relation 相关合同商机使用-->
                  <component
                    :is="item.formType | typeToComponentName"
                    :value="item.value"
                    :index="index"
                    :item="{ data: item }"
                    :radio="false"
                    :disabled="item.disabled"
                    @value-change="fieldValueChange"/>
                </el-form-item>
              </el-form>
            </div>
          </flexbox>
          <el-checkbox
            v-model="onlyOne"
            class="only-check">每个用户只能填写一次</el-checkbox>
        </create-sections>
        <create-sections title="字段信息">
          <field-manager
            :crm-type="fieldcrmType"
            :data="fieldData"
            class="field-container"
            description="以下为客户模块所有字段，左侧显示的字段为客户扫码后需填写的字段。您可以自定义配置客户需要填写的字段信息。"
            @change="fieldManagerChange"/>
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="saveField()">保存</el-button>
      </div>
    </flexbox>
  </create-view>
</template>
<script type="text/javascript">
import { filedGetField } from '@/api/customermanagement/common'
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import FieldManager from './fieldManager'
import {
  crmMarketingSaveAPI
} from '@/api/customermanagement/marketing'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhDate,
  XhDateTime,
  XhUserCell
} from '@/components/CreateCom'

export default {
  name: 'Create',
  components: {
    CreateView,
    CreateSections,
    XhInput,
    XhTextarea,
    XhSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    FieldManager
  },

  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(formType) {
      if (
        formType == 'text' ||
        formType == 'number' ||
        formType == 'floatnumber' ||
        formType == 'mobile' ||
        formType == 'email'
      ) {
        return 'XhInput'
      } else if (formType == 'textarea') {
        return 'XhTextarea'
      } else if (formType == 'select') {
        return 'XhSelect'
      } else if (formType == 'date') {
        return 'XhDate'
      } else if (formType == 'datetime') {
        return 'XhDateTime'
      } else if (formType == 'user') {
        return 'XhUserCell'
      }
    }
  },

  props: {
    /**
     * save:添加、update:编辑
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: ''
        }
      }
    }
  },
  data() {
    return {
      // 标题展示名称
      title: '',
      loading: false,
      fieldList: [], // 字段
      dataRules: {
        marketingName: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        crmType: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        relationUserId: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        endTime: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        ownerUserId: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        remark: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        }
      }, // 字段规则
      dataForm: {
        marketingName: '',
        crmType: 2, // 2 客户 1 线索
        relationUserId: [],
        endTime: '',
        ownerUserId: [],
        fieldDataId: '',
        remark: ''
      },
      // 只能填写一次
      onlyOne: false, // 0 不限制 1 只能填写一次
      // 展示的数组
      fieldData: null,
      showFieldList: []
    }
  },

  computed: {
    fieldcrmType() {
      return { 2: 'customer', 1: 'leads' }[this.dataForm.crmType]
    }
  },

  mounted() {
    // 获取title展示名称
    document.body.appendChild(this.$el)
    this.title = this.getTitle()

    this.fieldList = this.getFieldList()
    if (this.action.type == 'update') {
      this.dataForm = this.action.detail

      this.onlyOne = this.action.detail.second == 1

      this.getFieldConfigIndex()
    } else {
      this.getFieldConfigIndex()
    }
  },

  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },

  methods: {
    /**
     * 获取字段信息
     */
    getFieldConfigIndex() {
      const params = {
        label: this.dataForm.crmType
      }
      if (this.action.type == 'update') {
        params.marketingId = this.action.id
      }
      filedGetField(params)
        .then(res => {
          if (
            this.action.type == 'update' &&
            this.dataForm.crmType == this.action.detail.crmType
          ) {
            const showFieldsStr = this.action.detail.fieldDataId || ''

            const showFields = showFieldsStr.split(',').map(item => {
              return parseInt(item)
            })
            const left = []
            const right = []
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index]
              if (this.isShowField(element.formType)) {
                element.show = true
                element.check = false
                if (showFields.includes(element.fieldId)) {
                  left.push(element)
                } else {
                  right.push(element)
                }
              }
            }
            this.fieldData = {
              left: left,
              right: right
            }
          } else {
            const left = []
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index]
              if (this.isShowField(element.formType)) {
                element.show = true
                element.check = false
                left.push(element)
              }
            }
            this.fieldData = {
              left: left,
              right: []
            }
          }
          this.showFieldList = this.fieldData.left
        })
        .catch(() => {})
    },

    /**
     * 字段是否展示
     */
    isShowField(formType) {
      return formType != 'user' && formType != 'structure' && formType != 'file' && formType != 'map_address'
    },

    /**
     * 获取字段数据
     */
    getFieldList() {
      const detailData = this.action.type == 'update' ? this.action.detail : null
      return [
        {
          field: 'marketingName',
          name: '推广名称',
          formType: 'text',
          inputTips: '',
          setting: [],
          value: detailData ? detailData.marketingName : '',
          width: ''
        },
        {
          field: 'crmType',
          name: '关联对象',
          formType: 'select',
          inputTips: '',
          setting: [{ name: '客户', value: 2 }, { name: '线索', value: 1 }],
          value: detailData ? detailData.crmType : 2,
          width: ''
        },
        {
          field: 'relationUserId',
          name: '关联人员',
          formType: 'user',
          radio: false,
          inputTips: '',
          setting: [],
          value: detailData ? detailData.relationUserInfo || [] : [],
          width: ''
        },
        {
          field: 'endTime',
          name: '截止日期',
          formType: 'datetime',
          inputTips: '',
          setting: [],
          value: detailData ? detailData.endTime : '',
          width: ''
        },
        {
          field: 'ownerUserId',
          name: '管理员',
          formType: 'user',
          radio: false,
          inputTips: '',
          setting: [],
          value: detailData ? detailData.ownerUserInfo || [] : [],
          width: ''
        },
        {
          field: 'remark',
          name: '备注',
          formType: 'textarea',
          inputTips: '',
          setting: [],
          value: detailData ? detailData.remark : '',
          width: ''
        }
      ]
    },

    // 字段的值更新
    fieldValueChange(data) {
      const item = this.fieldList[data.index]
      item.value = data.value
      this.dataForm[item.field] = data.value
      if (item.formType == 'user') {
        this.$refs.dataForm.validateField(item.field)
      } else if (item.field == 'crmType') {
        this.getFieldConfigIndex()
      }
    },

    /**
     * 字段信息调整
     */
    fieldManagerChange(data) {
      this.showFieldList = data.left
    },

    // 保存数据
    saveField() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const params = this.getSubmiteParams()
          params.second = this.onlyOne ? 1 : 0 // 0 不限制 1 只能填写一次
          params.fieldDataId = this.showFieldList.map(item => {
            return item.fieldId
          }).join(',')
          params.relationUserId = this.dataForm.relationUserId.map(item => {
            return item.userId
          }).join(',')
          params.ownerUserId = this.dataForm.ownerUserId.map(item => {
            return item.userId
          }).join(',')
          params.relationUserId = ',' + params.relationUserId + ','
          params.fieldDataId = ',' + params.fieldDataId + ','
          params.ownerUserId = ',' + params.ownerUserId + ','
          params.endTime = params.endTime
          this.submiteParams(params)
        } else {
          return false
        }
      })
    },

    /** 上传 */
    submiteParams(params) {
      this.loading = true
      if (this.action.type == 'update') {
        params.marketingId = this.action.id
      }
      crmMarketingSaveAPI(params)
        .then(res => {
          this.loading = false
          this.hidenView()
          this.$message.success(this.action.type == 'update' ? '编辑成功' : '创建成功')
          // 回到保存成功
          this.$emit('save-success')
        })
        .catch(() => {
          this.loading = false
        })
    },

    /** 拼接上传传输 */
    getSubmiteParams() {
      const params = {}
      for (let index = 0; index < this.fieldList.length; index++) {
        const element = this.fieldList[index]
        const value = this.getRealParams(element)
        params[element.field] = value
      }
      return params
    },

    // 关联客户 联系人等数据要特殊处理
    getRealParams(element) {
      if (element.formType == 'user') {
        return element.value.map(function(item, index, array) {
          return item.id
        })
      }

      return element.value
    },

    hidenView() {
      this.$emit('hiden-view')
    },

    // 根据类型获取标题展示名称
    getTitle() {
      return this.action.type == 'update' ? '编辑推广' : '新建推广'
    },

    // 获取左边padding
    getPaddingLeft(item, index) {
      return index % 2 == 0 ? '0' : '25px'
    },

    // 获取左边padding
    getPaddingRight(item, index) {
      return index % 2 == 0 ? '25px' : '0'
    }
  }
}
</script>
<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
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

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.el-form {
    padding-bottom: 10px;
  }
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
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

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

// 是否能选择
.only-check {
  padding: 0 10px 10px;
}

// 字段调整
.field-container {
  padding: 10px 10px 40px;
  width: 90%;
}
</style>
