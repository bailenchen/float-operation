<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="pool-add-container">
      <flexbox class="pool-add-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title }}</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>

      <div class="pool-add-content">
        <create-sections
          v-if="baseFrom"
          title="基本信息">
          <flexbox
            style="margin-top: 8px;"
            direction="column"
            align="stretch">
            <el-form
              ref="ruleForm"
              :model="baseFrom"
              :rules="baseRules"
              label-position="top"
              class="pool-add-items">
              <el-form-item
                prop="poolName"
                class="pool-add-item pool-add-item__left">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海名称
                  </div>
                </div>
                <el-input v-model="baseFrom.poolName" :maxlength="100" />
              </el-form-item>
              <el-form-item
                prop="name1"
                class="pool-add-item pool-add-item__right">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海管理员<el-tooltip
                      content="客户公海管理员可对客户公海客户进行领取、分配、导出等操作"
                      effect="dark"
                      placement="top">
                      <i class="wk wk-help"/>>
                    </el-tooltip>
                  </div>
                </div>
                <xh-user-cell
                  :radio="false"
                  :value="baseFrom.adminUsers"
                  @value-change="userChange" />
              </el-form-item>
              <el-form-item
                prop="name2"
                class="pool-add-item pool-add-item__left">
                <div
                  slot="label"
                  style="display: inline-block;">
                  <div class="xr-form-label">
                    公海成员<el-tooltip
                      content="客户公海规则对客户公海成员生效(超级管理员除外)，客户公海成员可查看以及领取公海客户"
                      effect="dark"
                      placement="top">
                      <i class="wk wk-help"/>>
                    </el-tooltip>
                  </div>
                </div>
                <xh-struc-user-cell
                  :value="baseFrom.memberUsers"
                  @value-change="strcUserChange" />
              </el-form-item>
            </el-form>
          </flexbox>
        </create-sections>
        <create-sections
          v-if="recycleRuleData"
          title="规则设置">
          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">前负责人领取规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.preOwnerSetting">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">限制</el-radio>
              </el-radio-group>
              <div v-if="baseFrom.preOwnerSetting === 1" class="xr-input">
                <span>前负责人</span>
                <el-input v-model="baseFrom.preOwnerSettingDay" @keyup.native="inputLimit('preOwnerSettingDay')" />
                <span>天内不允许领取该客户</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">领取频率规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.receiveSetting">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">限制</el-radio>
              </el-radio-group>
              <div v-if="baseFrom.receiveSetting === 1" class="xr-input">
                <span>每天最多领取</span>
                <el-input v-model="baseFrom.receiveNum" @keyup.native="inputLimit('receiveNum')" />
                <span>个公海客户</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">提醒规则</div>
            <div class="row-content">
              <div class="xr-input">
                <span>提前</span>
                <el-input v-model="baseFrom.remindDay" @keyup.native="inputLimit('remindDay')" />
                <span>天提醒负责人</span>
              </div>
            </div>
          </flexbox>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">收回规则</div>
            <div class="row-content">
              <el-radio-group v-model="baseFrom.putInRule">
                <el-radio :label="1">自动回收</el-radio>
                <el-radio :label="0">不自动回收</el-radio>
              </el-radio-group>
            </div>
          </flexbox>

          <template v-if="baseFrom.putInRule == 1">
            <recycle-rule
              v-for="(item, index) in recycleRuleData"
              :key="index"
              :data="item"
              :true-label="index + 1"
              :is-edit="isEdit"
            />
          </template>

          <flexbox
            class="row"
            align="stretch">
            <div class="row-label">公海字段设置</div>
            <div class="row-content">
              <div class="field-set">
                <div class="field-set__name">
                  选择公海字段
                </div>
                <flexbox
                  wrap="wrap">
                  <el-checkbox
                    v-for="(item, index) in customerPoolFields"
                    :key="index"
                    v-model="item.isHidden"
                    :true-label="0"
                    :false-label="1">{{ item.name }}</el-checkbox>
                </flexbox>
              </div>
            </div>
          </flexbox>
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          v-debounce="saveClick"
          class="handle-button"
          type="primary">保存</el-button>
      </div>
    </flexbox>
  </create-view>
</template>

<script>
import {
  crmCustomerPoolQueryPoolFieldtAPI,
  crmCustomerPoolSetAPI,
  crmCustomerPoolSetDetailAPI
} from '@/api/customermanagement/customer'

import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import {
  XhInput,
  XhUserCell,
  XhStrucUserCell
} from '@/components/CreateCom'
import RecycleRule from './RecycleRule'

export default {
  // 公海规则添加
  name: 'PoolAdd',
  components: {
    CreateView,
    CreateSections,
    XhInput,
    XhUserCell,
    XhStrucUserCell,
    RecycleRule
  },
  props: {
    /**
     * type save:添加、update:编辑
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: '',
          data: {} // 编辑所需信息
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      baseFrom: null,
      baseRules: {
        poolName: [
          { required: true, message: '请输入公海名称 ', trigger: 'blur' }
        ]
      },
      recycleRuleData: null,
      customerPoolFields: [],
      requestFields: {
        preOwnerSettingDay: '前负责人限制领取天数需大于0',
        receiveNum: '领取频率限制个数需大于0',
        remindDay: '提醒规则天数需大于0'
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        return '编辑公海'
      }

      return '新建公海'
    },

    isEdit() {
      return this.action && this.action.type == 'update'
    }
  },
  watch: {},
  created() {
    if (this.isEdit) {
      this.getDetail()
    } else {
      this.getCreateInfo()
    }
  },

  beforeDestroy() {},
  methods: {
    /**
     * 编辑操作
     */
    getDetail() {
      this.loading = true
      crmCustomerPoolSetDetailAPI({
        poolId: this.action.id
      }).then(res => {
        this.getEditInfo(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    getEditInfo(data) {
      this.baseFrom = {
        poolName: data.poolName,
        adminUsers: data.adminUser,
        memberUsers: {
          users: data.memberUser,
          strucs: data.memberDept
        },
        preOwnerSetting: data.preOwnerSetting, // 前负责人领取规则 0不限制 1限制
        preOwnerSettingDay: data.preOwnerSettingDay,
        receiveSetting: data.receiveSetting, // 0 不启用 1 启用
        receiveNum: data.receiveNum, // 领取频率规则
        remindDay: data.remindDay, // 提醒规则天数
        putInRule: data.putInRule // 收回规则 0不自动收回 1自动收回
      }

      this.recycleRuleData = data.rule
      this.getCustomerPoolFields(data.field.filter(item => {
        return item.isHidden === 1
      })).then(editFields => {
        this.customerPoolFields = editFields
      })
    },

    /**
     * 新建操作
     */
    getCreateInfo() {
      this.baseFrom = {
        poolName: '',
        adminUsers: [],
        memberUsers: {
          users: [],
          strucs: []
        },
        preOwnerSetting: 0, // 前负责人领取规则 0不限制 1限制
        preOwnerSettingDay: '',
        receiveSetting: 0, // 0 不启用 1 启用
        receiveNum: '', // 领取频率规则
        remindDay: '', // 提醒规则天数
        putInRule: 1 // 收回规则 0不自动收回 1自动收回
      }

      this.recycleRuleData = [
        {
          type: '',
          dealHandle: 1,
          businessHandle: 1,
          customerLevelSetting: 1,
          level: []
        },
        {
          type: '',
          dealHandle: 1,
          businessHandle: 1,
          customerLevelSetting: 1,
          level: []
        },
        {
          type: '',
          dealHandle: 1,
          businessHandle: 1,
          customerLevelSetting: 1,
          level: []
        }
      ]

      this.getCustomerPoolFields().then(createFields => {
        this.customerPoolFields = createFields
      })
    },


    /**
     * 员工选择
     */
    userChange(data) {
      this.baseFrom.adminUsers = data.value
    },

    strcUserChange(data) {
      this.baseFrom.memberUsers = data.value
    },

    /**
     * 获取公海默认字段
     */
    getCustomerPoolFields(hiddenFields) {
      return new Promise((resolve, reject) => {
        crmCustomerPoolQueryPoolFieldtAPI().then(res => {
          const list = res.data || []
          const baseField = list.map(item => {
            item.isHidden = 0
            return item
          })
          if (hiddenFields) {
            resolve(this.getEditFields(baseField, hiddenFields))
          } else {
            resolve(baseField)
          }
        }).catch(() => {
          reject()
        })
      })
    },

    /**
     * 获取编辑展示字段
     */
    getEditFields(list, hiddenFields) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]

        for (let editIndex = 0; editIndex < hiddenFields.length; editIndex++) {
          const editItem = hiddenFields[editIndex]
          // fieldId 存在 匹配fieldId 不存在 匹配 fieldName
          if (item.fieldId) {
            if (item.fieldId === editItem.fieldId) {
              item.isHidden = 1
            }
          } else {
            if (item.fieldName === editItem.fieldName) {
              item.isHidden = 1
            }
          }
        }
      }

      return list
    },

    /**
     * 保存数据
     */
    saveClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = this.getRequestParams()
          if (params) {
            this.uploadPoolSet(params)
          }
        } else {
          this.$message.error('请完善公海名称')
          return false
        }
      })
    },

    /**
     * 提交请求
     */
    uploadPoolSet(params) {
      if (this.isEdit) {
        params.poolId = this.action.id
      }
      this.loading = true
      crmCustomerPoolSetAPI(params).then(res => {
        this.$emit('save')
        this.$message.success(this.isEdit ? '编辑成功' : '新建成功')
        this.loading = false
        this.hidenView()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 必填字段验证
     */
    requestFieldsVerify(key) {
      if (key == 'preOwnerSettingDay' && this.baseFrom.preOwnerSetting == 1 && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      } else if (key == 'receiveNum' && this.baseFrom.receiveSetting == 1 && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      } else if (key == 'remindDay' && (!this.baseFrom[key] || this.baseFrom[key] <= 0)) {
        return false
      }

      return true
    },

    /**
     * 获取请求参数
     */
    getRequestParams() {
      const params = {}

      for (const key in this.baseFrom) {
        if (!this.requestFieldsVerify(key)) {
          this.$message.error(this.requestFields[key])
          return
        } else {
          if (key == 'adminUsers') {
            const adminUsers = this.baseFrom.adminUsers || []
            params.adminUserId = adminUsers.map(item => {
              return item.userId
            }).join(',')
          } else if (key == 'memberUsers') {
            const memberUserObj = this.baseFrom.memberUsers || {}
            const adminUsers = memberUserObj.users || []
            const adminStrucs = memberUserObj.strucs || []
            params.memberUserId = adminUsers.map(item => {
              return item.userId
            }).join(',')
            params.memberDeptId = adminStrucs.map(item => {
              return item.id
            }).join(',')
          } else {
            params[key] = this.baseFrom[key]
          }
        }
      }

      // 收回规则 1 自动收回
      if (this.baseFrom.putInRule == 1) {
        const ruleVerify = this.recycleRuleData.filter(item => {
          return item.type
        })

        if (!ruleVerify.length) {
          this.$message.error('请勾选自动回收规则')
          return
        }

        const rule = []
        for (let index = 0; index < this.recycleRuleData.length; index++) {
          const ruleItem = this.recycleRuleData[index]
          if (ruleItem.type) {
            for (let levelIndex = 0; levelIndex < ruleItem.level.length; levelIndex++) {
              const levelItem = ruleItem.level[levelIndex]
              if (!levelItem.limitDay || levelItem.limitDay <= 0) {
                this.$message.error('收回规则超过天数需大于0')
                return
              }
            }
            rule.push(ruleItem)
          }
        }

        params.rule = rule
      } else {
        params.rule = []
      }


      // 公海字段
      params.field = this.customerPoolFields

      return params
    },

    /**
     * 关闭页面
     */
    hidenView() {
      this.$emit('hiden-view')
    },

    /**
     * 阻挡输入
     */
    inputLimit(key) {
      this.baseFrom[key] = this.baseFrom[key].replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.pool-add-container {
  position: relative;
  height: 100%;
}

.pool-add-content {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.pool-add-header {
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

.pool-add-items {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}

.pool-add-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
  &__left {
    padding-right: 25px;
  }
  &__right {
    padding-left: 25px;
  }
}

.xr-form-label {
  margin: 5px 0;
  font-size: 12px;
  word-wrap: break-word;
  word-break: break-all;
  .wk-help {
    margin-left: 5px;
  }
}

// 行布局
.row {
  padding: 8px 15px 0;
  font-size: 13px;
  color: #333;
  &-label {
    width: 100px;
    margin-top: 10px;
    flex-shrink: 0;
  }

  &-content {
    flex: 1;
    margin-left: 20px;
    .el-radio-group {
      margin: 8px 0;
    }

    .xr-input {
      margin-bottom: 8px;
      .el-input {
        width: 80px;
        margin: 0 8px;
      }
    }
  }
}

.recycle-rule {
  padding-left: 135px;
  margin-top: 20px;
}

// 字段设置
.field-set {
  margin-top: 10px;
  margin-bottom: 40px;
  padding: 15px;
  border: 1px solid $xr-border-color-base;
  border-radius: $xr-border-radius-base;

  &__name {
    margin-bottom: 8px;
  }

  .el-checkbox {
    flex: 0 0 30%;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}
</style>
