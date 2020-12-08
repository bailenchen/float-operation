<template>
  <el-popover
    v-model="showPopover"
    :disabled="disabled"
    placement="left-end"
    width="700"
    popper-class="no-padding-popover"
    trigger="click">
    <crm-relative
      v-if="!disabled&&showSelectView"
      ref="crmrelative"
      :crm-type="crmType"
      :show-types="showTypes"
      :radio="radio"
      :action="relationAction"
      :selected-data="selectedData"
      @close="showPopover=false"
      @changeCheckout="checkInfos"/>
    <flexbox
      slot="reference"
      :class="[disabled ? 'is_disabled' : 'is_valid']"
      wrap="wrap"
      class="user-container xh-form-border"
      @click.native="contentClick">
      <div
        v-for="(aitem, aindex) in showDataValue"
        :key="aindex"
        class="user-item"
        @click.stop="deleteinfo(aindex)">{{ getShowName(aitem) }}
        <i class="delete-icon el-icon-close"/>
      </div>
      <i v-if="dataValue && dataValue.length > max" class="el-icon-more" />
      <i
        :class="['el-icon-arrow-up', { 'is-reverse' : showPopover}]"/>
      <div
        v-if="dataValue == null || dataValue.length == 0"
        class="add-item">+添加</div>
    </flexbox>
  </el-popover>
</template>
<script type="text/javascript">
import CrmRelative from './CrmRelative'
import arrayMixin from './arrayMixin'

export default {
  name: 'CrmRelativeCell', // 相关模块CRMCell 单类型 自定义字段用
  components: {
    CrmRelative
  },
  mixins: [arrayMixin],
  props: {
    radio: {
      type: Boolean,
      default: true
    },
    relation: {
      // 相关ID
      type: Object,
      default: () => {
        return {}
      }
    },
    relativeType: String,
    leadsNumber: {
      type: Boolean,
      default: false
    },
    showTypes: {
      type: Array,
      default() {
        return []
      }
    },
    max: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      showPopover: false, // 展示popover
      showSelectView: false, // 内容
      relationAction: { type: 'default' }
    }
  },
  computed: {
    showDataValue() {
      if (this.dataValue && this.dataValue.length > this.max) {
        return this.dataValue.slice(0, this.max)
      }
      return this.dataValue
    },
    // 如果有相关ID  展示相关效果 例如客户下的商机和合同
    isRelationShow() {
      return this.item && this.item.data && this.item.data.relation_id
    },
    selectedData() {
      let crmObj = {}
      if (this.item.crmType == 'contract') {
        crmObj = {
          customer: this.item.value && this.item.value.length && this.item.value[0].customerType == 1 ? this.item.value : [],
          student: this.item.value && this.item.value.length && this.item.value[0].customerType == 2 ? this.item.value : []
        }
      } else {
        crmObj[this.crmType] = this.dataValue
      }
      return crmObj
    },
    crmType() {
      if (this.relativeType) {
        return this.relativeType
      }
      return this.item.crmType == 'contract' ? '' : this.item.data.formType
    }
  },
  watch: {
    relation: function(val) {
      if (val.moduleType) {
        this.relationAction = { type: 'condition', data: val }
      } else if (val.type == 'presentContract') {
        this.relationAction = val
      } else {
        this.relationAction = { type: 'default' }
      }
    }
  },
  mounted() {
    if (this.relation && this.relation.moduleType) {
      this.relationAction = { type: 'condition', data: this.relation }
    } else {
      this.relationAction = { type: 'default' }
    }
  },
  methods: {
    /** 选中 */
    checkInfos(data) {
      this.dataValue = data.data ? data.data : []
      this.$emit('value-change', {
        index: this.index,
        value: data.data
      })
    },
    /** 删除 */
    deleteinfo(index) {
      if (this.disabled) return
      if (this.radio && this.$refs.crmrelative) {
        // 如果单选告知删除
        this.$refs.crmrelative.clearAll()
      }
      if (this.dataValue && this.dataValue.length === 1) {
        this.dataValue = []
      } else {
        this.dataValue && this.dataValue.length ? this.dataValue.splice(index, 1) : []
      }

      this.$emit('value-change', {
        index: this.index,
        value: this.dataValue
      })
    },
    contentClick() {
      this.showSelectView = true
    },
    getShowName(data) {
      if (this.crmType === 'receivables') {
        return data.number
      } else if (['customer', 'student'].includes(this.crmType)) {
        return data.customerName
      } else if (this.crmType === 'business') {
        return data.businessName
      } else if (this.crmType === 'contract') {
        return data.contractNum || data.num
      }

      if (this.crmType == '') {
        return data.customerName
      }
      return data.name
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  min-height: 34px;
  position: relative;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #ddd;
  color: #333333;
  line-height: 15px;
  cursor: pointer;
  .user-item {
    padding: 5px;
    background-color: #e2ebf9;
    border-radius: 3px;
    margin: 3px;
    cursor: pointer;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
  .add-item {
    padding: 5px;
    color: $xr-color-text-placeholder;
    cursor: pointer;
  }
  .delete-icon {
    color: #999;
    cursor: pointer;
  }
}

.user-container.is_disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
  .user-item {
    background-color: #f0f4f8ea;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .delete-icon {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .add-item {
    color: #c0c4cc;
    cursor: not-allowed;
  }
}

.user-container.is_valid:hover {
  border-color: #c0c4cc;
}

.el-icon-more {
  position: absolute;
  top: 5px;
  right: 20px;
  padding: 6px 10px;
  font-size: 12px;
  background-color: #F3F7FF;
  color: #666;
  border-radius: $xr-border-radius-base;
  &:hover {
    background-color: $xr-color-primary;
    color: white;
  }
}

.el-icon-arrow-up {
  position: absolute;
  top: 10px;
  right: 5px;
  transition: transform .3s;
  color: #c0c4cc;
  font-size: 14px;
  transition: transform .3s;
  transform: rotate(180deg);
  cursor: pointer;
}
.el-icon-arrow-up.is-reverse {
  transform: rotate(0deg);
}
</style>
