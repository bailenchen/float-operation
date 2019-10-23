<template>
  <span class="report-menu">
    <span
      v-for="(item, index) in list"
      :key="index"
      class="report-menu-btn">
      <i
        :class="getXrIcon(item.type)"
        :style="{ color: getXrIconColor(item.type) }"
        class="report-menu-btn__icon" />
      <span class="report-menu-btn__name">{{ item.name }}</span>
    </span>
  </span>
</template>

<script>
import XrSystemIconMixin from '@/mixins/XrSystemIcon'

export default {
  // 日志简报菜单
  name: 'ReportMenu',
  components: {},
  mixins: [XrSystemIconMixin],
  props: {
  },
  data() {
    return {
      list: [
        {
          type: 'customer',
          name: '今日新增客户 5'
        },
        {
          type: 'business',
          name: '今日新增商机 5'
        },
        {
          type: 'contract',
          name: '今日新增合同  3'
        },
        {
          type: 'receivables',
          name: '今日新增回款  1,000,000'
        },
        {
          type: 'record',
          name: '今日新增跟进记录  8'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.report-menu {

  &-btn {
    display: inline-block;
    padding: 5px 10px;
    background-color: $xr--background-color-base;
    font-size: 13px;
    color: #333;
    border-radius: 13px;
    cursor: pointer;

    &__icon {
      font-size: 12px;
    }

    &__name {
      margin-left: 3px;
    }

    &:hover {
      background-color: #ecf1ff;
    }
  }

  &-btn {
    margin-right: 20px;
    margin-bottom: 8px;
  }

}
</style>
