<template>
  <flexbox class="base-tabs-head" justify="space-between">
    <div>
      <slot name="left" />
    </div>
    <el-tabs
      :value="tabsDefaultValue"
      @tab-click="handleTabsClick">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :label="item.label"
        :name="item.name"/>
    </el-tabs>
    <div>
      <slot name="right" />
    </div>
  </flexbox>
</template>

<script>
export default {
  /** 任务审批基础头 */
  name: 'BaseTabsHead',
  components: {},
  props: {
    tabs: Array
  },
  data() {
    return {}
  },
  computed: {
    tabsDefaultValue() {
      return this.tabs && this.tabs.length ? this.tabs[0].name : ''
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    handleTabsClick(tab, event) {
      this.$emit('change', tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-tabs-head {
  background-color: white;
  border-radius: 4px;
  border: 1px solid $xr-border-line-color;
  height: 50px;
}

.el-tabs {
  display: inline-block;

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/ .el-tabs__item {
    height: 46px;
  }

  /deep/ .el-tabs__nav-wrap::after {
    display: none !important;
  }
}
</style>
