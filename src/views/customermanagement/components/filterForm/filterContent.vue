<template>
  <div class="wrapper">
    <ul class="list">
      <li
        v-for="(item, index) in showObj.form"
        :key="index"
        class="list-item">
        <span v-if="item.formType == 'date'">{{ item.name +'&nbsp;“' + item.value[0] + '-' + item.value[1] + '”' }}</span>
        <span v-else-if="item.formType === 'datetime'">{{ item.name +'&nbsp;“' + item.value[0] + '-' + item.value[1] + '”' }}</span>
        <span v-else-if="item.formType === 'business_type'">{{ item.name +'&nbsp;“' + getTypesName(item) + getStatusName(item) + '”' }}</span>
        <span v-else-if="item.formType === 'map_address'">{{ `${item.name} ${item.address.state} ${item.address.city} ${item.address.area}` }}</span>
        <span
          v-else-if="[
            'grades',
            'classsatus',
            'check_status',
            'class_type',
            'subject',
            'follow_up_plan',
            'sign_up',
            'checkStatus'
        ].includes(item.formType)">{{ item.name +'&nbsp;“' + optionsNames[item.condition]+ '”'+'&nbsp;'+ getCheckName(item) }}</span>
        <span v-else-if="item.formType === 'dealStatus'">{{ item.name +'&nbsp;“' + optionsNames[item.condition]+ '”'+'&nbsp;'+ getStatus(item.value, item.fieldName) }}</span>
        <span v-else-if="item.formType === 'ownerUser' || item.formType === 'single_user'">{{ item.name +'&nbsp;' + optionsNames[item.condition] + '“' + item.value[0].realname + '”' }}</span>
        <span v-else-if="item.formType === 'user'">{{ item.name +'&nbsp;' + optionsNames[item.condition] + '“' + item.value[0].realname + '”' }}</span>
        <span v-else-if="item.formType === 'single_structure'">{{ item.name +'&nbsp;' + optionsNames[item.condition] + '“' + item.value[0].name + '”' }}</span>
        <span v-else-if="['category', 'leads_source'].includes(item.formType) && item.value.length > 0">{{ item.name +'&nbsp;“' + item.valueContent + '”' }}</span>
        <span v-else-if="item.formType == 'select' && (['contract_type', 'is_early_retirement', 'is_new', 'contract_status', 'status', 'allot_status'].includes(item.fieldName))">{{ item.name +'&nbsp;'+ optionsNames[item.condition] +'“' + handleSelectName(item.fieldName, item.value) + '”' }}</span>
        <span v-else>{{ item.name + '&nbsp;' + optionsNames[item.condition] + '“' + item.value + '”' }}</span>
        <i
          class="el-icon-close icon"
          @click="handleDelete(item, index)"/>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FilterContent',
  props: {
    crmType: String,
    obj: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 获取条件名称
      optionsNames: {
        is: '等于',
        isNot: '不等于',
        contains: '包含',
        notContains: '不包含',
        startWith: '开始于',
        endWith: '结束于',
        isNull: '为空',
        isNotNull: '不为空',
        eq: '等于',
        neq: '不等于',
        gt: '大于',
        egt: '大于等于',
        lt: '小于',
        elt: '小于等于'
      },
      // 展示信息
      showObj: {}
    }
  },
  computed: {},
  watch: {
    obj: function(val) {
      console.log(this.obj, '******')
      this.showObj = val
    }
  },
  mounted() {
    this.showObj = this.obj
    console.log(this.showObj, '999999')
  },
  methods: {
    /**
     * 删除高级筛选条件
     * @param index
     */
    handleDelete(item, index) {
      this.$delete(this.showObj.obj, item.fieldName)
      this.showObj.form.splice(index, 1)
      this.$emit('delete', { item: item, index: index, obj: this.showObj })
    },

    /**
     * 商机组展示名称
     */
    getTypesName(data) {
      if (data.typeId) {
        const obj = data.typeOption.find(item => {
          return item.typeId === data.typeId
        })
        return obj.name || ''
      }
      return ''
    },
    getCheckName(data) {
      let value = ''
      data.setting.forEach(item => {
        if (item.value === data.value) {
          value = item.name
          return
        }
      })
      return value
    },

    // 合同中类型为select的name处理
    handleSelectName(name, value) {
      console.log(name, value, 'njkkkk')
      if (this.crmType == 'refund' && name == 'is_early_retirement') {
        // console.log(11)
        return value
      }
      return {
        'contract_type': { 1: '购买', 2: '赠送' },
        'is_early_retirement': { 0: '否', 1: '是' },
        'is_new': { 0: '续签', 1: '新签', 2: '引流' },
        'checkStatus': {
          0: '待审核',
          1: '通过',
          2: '拒绝',
          3: '审核中',
          4: '撤回',
          5: '未提交',
          6: '创建',
          7: '已删除',
          8: '作废'
        },
        'contract_status': {
          1: '申请中',
          2: '放弃',
          3: '合同完成',
          4: '合同变更中',
          5: '执行中',
          6: '草稿',
          7: '合同充值返还',
          8: '确认放弃'
        },
        'status': {
          1: '正常',
          2: '关闭'
        },
        'allot_status': {
          '是': '是',
          '否': '否'
        }
      }[name][value]
    },

    /**
     * 商机阶段展示名称
     */
    getStatusName(data) {
      if (data.statusId) {
        const obj = data.statusOption.find(item => {
          return item.statusId === data.statusId
        })
        if (obj.name) {
          return '-' + obj.name
        }
        return ''
      }
      return ''
    },

    /**
     * 成交状态名称
     */
    getStatus(type, fieldName) {
      // console.log('type', type)
      if (fieldName == 'customer_type') {
        if (type == 2) {
          return '是'
        } else if (type == 1) {
          return '否'
        }
      }
      if (type == 9) {
        return '是'
      } else if (type == 10) {
        return '否'
      }
      return ''
    },



    /**
     * 成交状态名称
     */
    getDealStatus(type) {
      if (type == 0) {
        return '未成交'
      } else if (type == 1) {
        return '已成交'
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
@mixin left() {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
@mixin center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 100%;
  min-height: 50px;
  background: white;
  border-top: 1px solid #e1e1e1;
  font-size: 13px;
  overflow-x: scroll;
  color: #aaa;
  @include left;
  .list {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 10px;
    flex-shrink: 0;
    @include left;
    .list-item {
      height: 30px;
      padding: 0 10px;
      margin: 10px 15px 0 0;
      border: 1px solid #e1e1e1;
      border-radius: 3px;
      flex-shrink: 0;
      @include center;
      .icon {
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
