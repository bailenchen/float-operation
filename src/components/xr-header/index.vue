<template>
  <flexbox class="xr-header">
    <div
      :style="{ backgroundColor: iconColor }"
      class="xr-header__icon">
      <i :class="iconClass" />
    </div>
    <div class="xr-header__label">{{ label }}</div>
    <el-input
      v-if="showSearch"
      :placeholder="placeholder"
      v-model="search"
      class="xr-header__search"
      @keyup.enter.native="searchClick">
      <el-button
        slot="append"
        type="primary"
        @click.native="searchClick">搜索</el-button>
    </el-input>

    <div class="xr-header__ft">
      <slot name="ft" />
    </div>
  </flexbox>
</template>

<script>

export default {
  // 公共头部
  name: 'XrHeader',
  components: {},
  // inheritAttrs: false,
  props: {
    iconClass: [String, Array],
    iconColor: String,
    label: String,
    // value: String,

    showSearch: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    }
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    console.log('----', this.$attrs)
  },

  beforeDestroy() {},
  methods: {
    searchClick() {
      this.$emit('search', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
.xr-header {
  padding: 15px;
  position: relative;
  &__icon {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: $xr-border-radius-base;
    margin-right: 10px;
    .wk {
      color: white;
      font-size: 18px;
    }
  }
  &__label {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }

  &__search {
    width: 300px;
    margin: -16px 0 0 -150px;
    position: absolute;
    left: 50%;
    top: 50%;

    /deep/ .el-input-group__append {
      background-color: $xr-color-primary;
      border-color: $xr-color-primary;
      color: white;
    }
  }

  &__ft {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>
