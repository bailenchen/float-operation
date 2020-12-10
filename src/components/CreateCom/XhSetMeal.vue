<!--
 * @Author: your name
 * @Date: 2020-08-20 16:37:40
 * @LastEditTime: 2020-09-10 09:18:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\components\CreateCom\XhSetMeal.vue
-->
<template>
  <div class="lone-form">
    <el-form ref="ruleForm" :model="form" :rules="rules" class="crm-create-box">
      <el-form-item
        v-for="(item, index) in formField"
        :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
        :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}"
        :key="index"
        :label="item.label"
        :prop="item.prop">
        <el-input
          v-if="item.type == 'text'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder"
          @change="updateVal($event,item.prop)"/>

        <el-date-picker
          v-if="item.type == 'date'"
          v-model="term"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          style="width:100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="valueChange"/>

        <div v-if="item.type == 'radio'" class="el-input">
          <el-radio v-model="form[item.prop] " :label="1">参与</el-radio>
          <el-radio v-model="form[item.prop] " :label="0">不参与</el-radio>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  XhInput,
  XhTerm
} from '@/components/CreateCom'

export default {
  name: 'XhSetMeal',
  components: {
    XhInput,
    XhTerm
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(formType) {
      if (formType == 'term') {
        return 'XhTerm'
      } else if (formType == 'giveFrequency' || formType == 'detailsName' || formType == 'purchaseFrequency') {
        return 'XhInput'
      }
    }
  },
  props: {
    index: Number,
    action: String,
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const classTimes = (rule, value, callback) => {
      this.form.purchaseFrequency = String(value).replace(/[^0-9]/g, '')
      if (value === '') {
        callback(new Error('购买课次不能为空'))
      } else {
        callback()
      }
    }
    const giveClassTimes = (rule, value, callback) => {
      this.form.giveFrequency = String(value).replace(/[^0-9]/g, '')
      callback()
    }
    return {
      form: {
        detailsName: '',
        purchaseFrequency: '',
        giveFrequency: '',
        start_life_cycle: '',
        end_life_cycle: '',
        isGive: 1
      },
      // isGive: '1',
      formField: [
        { label: '套餐' + (this.index + 1), prop: 'detailsName', showblock: false, type: 'text', placeholder: '请输入套餐' },
        { label: '购买课次', prop: 'purchaseFrequency', showblock: false, type: 'text', placeholder: '请输入购买课次' },
        { label: '赠送课次', prop: 'giveFrequency', showblock: false, type: 'text', placeholder: '请输入赠送课次' },
        { label: '是否参与累计赠送', prop: 'isGive', showblock: false, type: 'radio' },
        { label: '使用周期', prop: 'term', showblock: false, type: 'date' }
      ],

      rules: {
        detailsName: [
          { required: true, message: '套餐不能为空', trigger: ['blur', 'change'] }
        ],
        purchaseFrequency: [
          { required: true, validator: classTimes, trigger: ['change'] }
        ],
        giveFrequency: [
          { required: false, validator: giveClassTimes, trigger: ['blur', 'change'] }
        ],
        isGive: [
          { required: true, trigger: ['change'] }
        ]
      },

      term: []
    }
  },
  created() {
    if (this.action == 'update') {
      this.form.detailsName = this.item.detailsName
      this.form.purchaseFrequency = this.item.purchaseFrequency
      this.form.giveFrequency = this.item.giveFrequency
      this.form.detailsId = this.item.detailsId
      this.term = this.item.startLifeCycle && this.item.endLifeCycle ? [this.item.startLifeCycle, this.item.endLifeCycle] : []
      this.form['start_life_cycle'] = this.item.startLifeCycle || ''
      this.form['end_life_cycle'] = this.item.endLifeCycle || ''
      console.log('this.item.isGive', this.item.isGive)
      this.form['isGive'] = this.item.isGive == undefined ? 1 : this.item.isGive
    }
  },
  methods: {

    /**
     * 验证
     */
    parentValid() {
      let result = null
      this.$refs.ruleForm.validate(item => {
        if (item) {
          result = true
          return true
        } else {
          result = false
          return false
        }
      })
      return result
    },

    // 删除时校正数据
    refreshData(data) {
      this.form = data
    },

    /**
     * 父组件得到数据
     */
    getForm() {
      return this.form
    },

    updateVal(data, type) {
      this.$emit('value-update', { value: data, type: type, index: this.index })
    },

    valueChange(data) {
      if (data.length) {
        this.form['start_life_cycle'] = data[0]
        this.form['end_life_cycle'] = data[1]
      } else {
        this.form['start_life_cycle'] = ''
        this.form['end_life_cycle'] = ''
      }
      console.log(data, this.form, '+----------')
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      console.log(index, 'address-book-index')
      return index % 2 == 0 ? '0' : '40px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      return index % 2 == 0 ? '40px' : '0'
    }
  }
}
</script>
<style lang='scss' scoped>
/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
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
  margin: 5px 0;
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

  .lone-form {
    position: relative;
  }

</style>
