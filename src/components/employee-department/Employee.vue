<template>
  <div>
    <el-input
      v-model="searchInput"
      placeholder="搜索成员"
      size="small"
      suffix-icon="el-icon-search"
      @input="value"/>
    <div
      class="search-list">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group
        :value="value"
        :max="max"
        @change="changeCheckout">
        <el-checkbox
          v-for="(item, i) in showList"
          :key="i"
          :label="item.userId"
          class="colleagues-list">
          <div
            v-photo="item"
            v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
            class="div-photo search-img"/>
          <span>{{ item.realname }}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script type="text/javascript">

export default {
  // 员工
  name: 'Employee',
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },

    list: Array,

    radio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchInput: '',
      checkAll: false,
      isIndeterminate: true

    }
  },

  computed: {
    showList() {
      return this.list.filter(item => {
        return !item.hidden
      })
    },

    max() {
      return this.radio ? 1 : null
    }
  },

  mounted() {},

  methods: {
    /**
     * 勾选
     */
    changeCheckout(val) {
      this.$emit('input', val)
      const checkedCount = val.length
      this.checkAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
    },

    /**
     * 全部勾选
     */
    handleCheckAllChange(val) {
      const checkedCities = val ? this.list.map(item => {
        return item.userId
      }) : []
      this.$emit('input', checkedCities)
      this.isIndeterminate = false
    },

    /**
     * 搜索
     */
    inputchange(val) {
      this.list = this.list.map(function(item, index, array) {
        if (item.realname.indexOf(val) != -1) {
          item.hidden = false
        } else {
          item.hidden = true
        }
        return item
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/* 选择员工 */
.search-img {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  vertical-align: middle;
  margin-right: 8px;
}
.search-list {
  padding: 5px;
  height: 248px;
  overflow: auto;
}
.colleagues-list {
  padding: 5px;
  display: block;
  margin-left: 0;
}
</style>
