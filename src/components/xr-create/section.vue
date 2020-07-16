<template>
  <flexbox
    direction="column"
    align="stretch">
    <div class="xr-create-section">
      <el-form
        :ref="baseRef"
        :model="crmForm"
        label-position="top"
        class="crm-create-box">
        <el-form-item
          v-for="(item, index) in crmForm.crmFields"
          :key="item.key"
          :prop="'crmFields.' + index + '.value'"
          :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
          :rules="crmRules[item.key]"
          :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}">
          <div
            slot="label"
            style="display: inline-block;">
            <div class="form-label">
              {{ item.data.name }}
              <span style="color:#999;">
                {{ item.data.inputTips ? '（'+item.data.inputTips+'）':'' }}
              </span>
            </div>
          </div>
          <!-- 员工 和部门 为多选（radio=false）  relation 相关订单商机使用-->
          <component
            :is="item.data.formType | typeToComponentName"
            :value="item.value"
            :index="index"
            :item="item"
            :relation="item.relation"
            :radio="false"
            :disabled="item.disabled"
            @value-change="fieldValueChange" />
        </el-form-item>
      </el-form>
    </div>
  </flexbox>
</template>

<script>
import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhMultipleSelect,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  XhColorPicker,
  CrmRelativeCell,
  XhProuctCate,
  XhProduct,
  XhBusinessStatus,
  XhCustomerAddress,
  XhReferrer,
  XhReceivablesPlan // 收款计划期数
} from '@/components/CreateCom'


export default {
  // 自定义块
  name: 'XrCreateSection',
  components: {
    XhInput,
    XhTextarea,
    XhSelect,
    XhMultipleSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    XhColorPicker,
    CrmRelativeCell,
    XhProuctCate,
    XhProduct,
    XhBusinessStatus,
    XhCustomerAddress,
    XhReferrer,
    XhReceivablesPlan
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.xr-create-section {

}
</style>
