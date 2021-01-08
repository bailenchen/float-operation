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
    <el-form v-for="(bitem, bindex) in formsList" ref="ruleForm" :key="bindex" :model="bitem.form" :rules="rules[crmType]" class="form-wrap crm-create-box">
      <el-form-item
        v-for="(item, index) in bitem.formField"
        :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
        :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}"
        :key="index"
        :label="item.prop == 'detailsName' ? item.label + (Number(bindex) + 1) : item.label"
        :prop="item.prop">

        <el-input
          v-if="item.type == 'text'"
          :placeholder="item.placeholder"
          v-model="bitem.form[item.prop]"/>

        <el-select v-if="item.prop == 'course_type'" v-model="bitem.form[item.prop]" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in courseTypeOptions"
            :key="item.value"
            :label="item.dictionaryName"
            :value="item.dictionaryId"
            :disabled="item.disabled"/>
        </el-select>

        <el-input
          v-if="item.type == 'ctx'"
          v-model="bitem.form[item.prop]"
          type="textarea"
          maxlength="800"
          show-word-limit/>

        <el-select v-if="item.type == 'sel'" v-model="bitem.form[item.prop]" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-date-picker
          v-if="item.type == 'date'"
          v-model="bitem.form[item.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          style="width:100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="valueChange($event,item.prop, bindex)"/>

        <div v-if="item.type == 'radio'" class="el-input">
          <el-radio v-if="!isFlow" v-model="bitem.form[item.prop]" :label="1">参与</el-radio>
          <el-radio v-model="bitem.form[item.prop]" :label="0">不参与</el-radio>
        </div>

      </el-form-item>
      <i
        v-if="formsList.length > 1"
        class="el-icon-remove"
        @click="deleteItem(bindex)"/>
    </el-form>
    <el-button
      style="margin-left:10px;"
      type="text"
      @click="addItem">+ {{ btnTxt }}</el-button>

  </div>
</template>

<script>
import { QueryAdminSubject } from '@/api/systemManagement/params'
import { queryDictionaryField } from '@/api/common'

export default {
  name: 'XhMealSubject',
  props: {
    crmType: {
      type: String,
      default: ''
    },
    action: String,
    detailList: {
      type: Array,
      default() {
        return []
      }
    },
    isFlow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const classTimes = (rule, value, callback) => {
      const reg = /^([0]|[1-9][0-9]*)$/g
      const val = reg.test(value)
      if (value === '') {
        callback(new Error('购买课次不能为空'))
      } else if (!val) {
        callback(new Error('购买课次只能为0或正整数'))
      } else {
        callback()
      }
    }
    const giveClassTimes = (rule, value, callback) => {
      console.log(value, 'dddd')
      const reg = /^([0]|[1-9][0-9]*)$/g
      const val = reg.test(value)
      if (value != '' && !val) {
        callback(new Error('课次只能为0或正整数'))
      } else {
        callback()
      }
    }
    return {
      formsList: [],
      options: [], // 学科下拉
      courseTypeOptions: [], // 课程类型
      rules: {
        'receivables': {
          detailsName: [
            { required: true, message: '套餐不能为空', trigger: ['blur', 'change'] }
          ],
          purchaseFrequency: [
            { required: true, message: '成绩不能为空', trigger: ['change'] }
          ],
          giveFrequency: [
            { required: false, trigger: ['blur', 'change'] }
          ]
        },
        'productSetMeal': {
          detailsName: [
            { required: true, message: '套餐不能为空', trigger: ['blur', 'change'] }
          ],
          purchaseFrequency: [
            { required: true, validator: classTimes, trigger: ['blur', 'change'] }
          ],
          giveFrequency: [
            { required: false, validator: giveClassTimes, trigger: ['blur', 'change'] }
          ],
          isGive: [
            { required: true, trigger: ['change'] }
          ]
        }
      },
      formsListcourseType: '常规课'
    }
  },
  computed: {
    btnTxt() {
      return {
        receivables: '添加内容',
        productSetMeal: '添加套餐'
      }[this.crmType]
    }
  },
  watch: {
    isFlow(val) {
      this.isForceJoin(val)
    }
  },
  created() {
    this.formsList = []
    if (this.crmType == 'productSetMeal') {
      queryDictionaryField({ dictionaryField: 'course_type' }).then(res => {
        console.log('字典', res.data)
        this.courseTypeOptions = res.data

        if (this.action == 'save') {
          // 创建初始item
          const item = this.createFieldObj()
          // 添加item
          this.formsList.push(item)
        }

        if (this.action == 'update') {
          this.detailList.forEach(item => {
            const iteData = this.createFieldObj()
            console.log('item111', item)
            iteData.form = {
              detailsId: item.detailsId,
              detailsName: item.detailsName,
              courseType: item.courseType,
              purchaseFrequency: item.purchaseFrequency,
              giveFrequency: item.giveFrequency,
              start_life_cycle: item.startLifeCycle,
              end_life_cycle: item.endLifeCycle,
              isGive: item.isGive,
              term: item.endLifeCycle ? [item.startLifeCycle, item.endLifeCycle] : []
            }

            this.formsList.push(iteData)
          })
        }
      }).catch(() => {})
      return
    }


    if (this.action == 'save') {
      // 创建初始item
      const item = this.createFieldObj()
      // 添加item
      this.formsList.push(item)
    }
    if (this.crmType == 'receivables') {
      this.getSubjects()
    }
    if (this.action == 'update') {
      this.detailList.forEach(item => {
        const iteData = this.createFieldObj()
        /* if (this.crmType == 'productSetMeal') {
          iteData.form = {
            detailsId: item.detailsId,
            detailsName: item.detailsName,
            purchaseFrequency: item.purchaseFrequency,
            giveFrequency: item.giveFrequency,
            start_life_cycle: item.startLifeCycle,
            end_life_cycle: item.endLifeCycle,
            isGive: item.isGive,
            term: item.endLifeCycle ? [item.startLifeCycle, item.endLifeCycle] : []
          }
        } */
        this.formsList.push(iteData)
      })
    }
  },
  methods: {
    // 是引流课的话就强制参加
    isForceJoin(val) {
      for (let index = 0; index < this.formsList.length; index++) {
        const element = this.formsList[index]
        if (val) {
          element.form.isGive = 0
        }
      }
    },
    // 获取学科下拉数据
    getSubjects() {
      QueryAdminSubject().then(res => {
        this.options = res.data.map(item => {
          item['label'] = item.subjectName
          item['value'] = item.id
          return item
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 创建对象方法--初始与添加使用
    createFieldObj() {
      let item
      if (this.crmType == 'receivables') { // 临时类型，供后期科目使用
        item = {
          formField: [
            { label: '科目', prop: 'detailsName', showblock: false, type: 'sel' },
            { label: '成绩', prop: 'purchaseFrequency', showblock: false, type: 'text', placeholder: '请输入成绩' },
            { label: '备注', prop: 'giveFrequency', showblock: false, type: 'ctx' }
          ],
          form: {
            detailsName: '',
            purchaseFrequency: '',
            giveFrequency: ''
          }
        }
      } else if (this.crmType == 'productSetMeal') {
        item = {
          formField: [
            { label: '套餐', prop: 'detailsName', showblock: false, type: 'text', placeholder: '请输入套餐' },
            // { label: '课程类型', prop: 'courseType', value: '常规课', showblock: false, type: 'select', placeholder: '请选择' },
            { label: '课程类型', prop: 'course_type', value: '常规课', showblock: false, type: 'select', placeholder: '请选择' },
            { label: '购买课次', prop: 'purchaseFrequency', showblock: false, type: 'text', placeholder: '请输入购买课次' },
            { label: '赠送课次', prop: 'giveFrequency', showblock: false, type: 'text', placeholder: '请输入赠送课次' },
            { label: '是否参与累计赠送', prop: 'isGive', showblock: false, type: 'radio' },
            { label: '使用周期', prop: 'term', showblock: false, type: 'date' }
          ],
          form: {
            detailsName: '',
            course_type: this.courseTypeOptions[0].dictionaryId,
            purchaseFrequency: '',
            giveFrequency: '',
            start_life_cycle: '',
            end_life_cycle: '',
            isGive: this.isFlow ? 0 : 1
          }
        }
      }
      return item
    },
    // 添加
    addItem() {
      const item = this.createFieldObj()
      this.formsList.push(item)
    },

    // 删除
    deleteItem(index) {
      this.formsList.splice(index, 1)
    },

    // 外部获取内部数据
    getFormList() {
      const list = []
      this.formsList.forEach(({ form }) => {
        list.push(form)
      })
      return list
    },

    // 验证所有--外部调用
    validAllSubjects() {
      const allData = []
      this.$refs.ruleForm.forEach(item => {
        item.validate(valid => {
          allData.push(valid)
        })
      })
      if (allData.includes(false)) {
        return false
      } else {
        return true
      }
    },

    valueChange(data, prop, index) {
      if (data.length) {
        this.formsList[index].form['start_life_cycle'] = data[0]
        this.formsList[index].form['end_life_cycle'] = data[1]
      } else {
        this.formsList[index].form['start_life_cycle'] = ''
        this.formsList[index].form['end_life_cycle'] = ''
      }
    },


    // 获取左边padding
    getPaddingLeft(item, index) {
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


.el-icon-remove {
    color: #ff6767;
    cursor: pointer;
    margin-left: 2px;
    display: none;
}

.form-wrap {
    position: relative;
}

.form-wrap:hover {
    .el-icon-remove {
        position: absolute;
        left: 48%;
        top: 46%;
        display: inline;
    }
}
</style>
