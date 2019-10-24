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
        :key="index + item.name"
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
  // 中间为tab效果的布局
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
  border-radius: $xr-border-radius-base;
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
