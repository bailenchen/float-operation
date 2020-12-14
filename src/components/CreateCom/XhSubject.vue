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
    <el-form v-for="(bitem, bindex) in formsList" ref="ruleForm" :key="bindex" :model="bitem.form" :rules="rules" class="form-wrap crm-create-box">
      <el-form-item
        v-for="(item, index) in bitem.formField"
        :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
        :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}"
        :key="index"
        :label="item.type == 'sel' ? item.label + (Number(bindex) + 1) : item.label"
        :prop="item.prop">

        <el-input
          v-if="item.type == 'text'"
          v-model="bitem.form[item.prop]"/>

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

      </el-form-item>
      <i
        v-if="formsList.length > 1"
        class="el-icon-remove"
        @click="deleteItem(bindex)"/>
    </el-form>
    <el-button
      style="margin-left:10px;"
      type="text"
      @click="addItem">+添加内容</el-button>

  </div>
</template>

<script>
import { QueryAdminSubject } from '@/api/systemManagement/params'

export default {
  name: 'XhSubject',
  props: {
    action: String,
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formsList: [{
        formField: [
          { label: '科目', prop: 'detailsName', showblock: false, type: 'sel' },
          { label: '成绩', prop: 'purchaseFrequency', showblock: false, type: 'text' },
          { label: '备注', prop: 'giveFrequency', showblock: false, type: 'ctx' }
        ],
        form: {
          detailsName: '',
          purchaseFrequency: '',
          giveFrequency: ''
        }
      }],
      options: [],

      rules: {
        detailsName: [
          { required: true, message: '套餐不能为空', trigger: ['blur', 'change'] }
        ],
        purchaseFrequency: [
          { required: true, message: '成绩不能为空', trigger: ['change'] }
        ],
        giveFrequency: [
          { required: false, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getSubjects()
    // if (this.action == 'update') {
    //   this.form.detailsName = this.item.detailsName
    //   this.form.purchaseFrequency = this.item.purchaseFrequency
    //   this.form.giveFrequency = this.item.giveFrequency
    //   this.form.detailsId = this.item.detailsId
    //   this.term = this.item.startLifeCycle && this.item.endLifeCycle ? [this.item.startLifeCycle, this.item.endLifeCycle] : []
    //   this.form['start_life_cycle'] = this.item.startLifeCycle || ''
    //   this.form['end_life_cycle'] = this.item.endLifeCycle || ''
    //   console.log('this.item.isGive', this.item.isGive)
    // }
  },
  methods: {
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
    // 添加科目
    addItem() {
      this.formsList.push({
        formField: [
          { label: '科目', prop: 'detailsName', showblock: false, type: 'sel' },
          { label: '成绩', prop: 'purchaseFrequency', showblock: false, type: 'text' },
          { label: '备注', prop: 'giveFrequency', showblock: false, type: 'ctx' }
        ],
        form: {
          detailsName: '',
          purchaseFrequency: '',
          giveFrequency: ''
        }
      })
    },

    // 删除科目
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

    // 验证所有的科目
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
