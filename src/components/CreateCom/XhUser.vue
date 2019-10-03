<template>
  <div class="xh-user">
    <div class="xh-user__hd">
      员工
    </div>
    <div class="xh-user__bd">
      <el-input
        v-model="searchInput"
        placeholder="搜索成员"
        size="small"
        prefix-icon="el-icon-search"
        class="search-input"
        @input="inputchange" />
      <div
        v-loading="loading"
        class="search-list">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          class="all-check"
          @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group
          ref="checkboxGroup"
          v-model="selectIds"
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
              class="div-photo search-img" />
            <span>{{ item.realname }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="xh-user__ft">
      <span class="select-info">已选择<span class="select-info--num">{{ selectIds.length }}</span>项</span>
      <el-button type="text" @click="clearAll">清空</el-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import { usersList } from '@/api/common'

export default {
  name: 'XhUser', // 新建 user
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    /** 多选框 只能选一个 */
    radio: {
      type: Boolean,
      default: false
    },
    /** 已选信息 */
    selectedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    /** 获取不同的员工展示列表 */
    infoType: {
      type: String,
      default: 'default' // 返回全部  crm_contract crm_receivables oa_examine 合同审核人自选列表
    },
    infoRequest: Function,
    /** 请求辅助参数 */
    infoParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      selectIds: [], // 选择项
      loading: false, // 加载动画
      searchInput: '',
      checkAll: false,
      isIndeterminate: false
    }
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        return !item.hidden
      })
    },

    max() {
      return this.radio ? 1 : undefined
    }
  },
  watch: {
    selectedData: function(value) {
      this.checkItems(value)
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    /**
     * 获取数据
     */
    getUserList() {
      this.loading = true
      this.getRequest()(this.getParams())
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 请求
     */
    getRequest() {
      if (this.infoRequest) {
        return this.infoRequest
      } else if (this.infoType === 'default') {
        return usersList
      } else if (
        this.infoType === 'crm_contract' ||
        this.infoType === 'crm_receivables' ||
        this.infoType === 'oa_examine'
      ) {
        return usersList
      }
    },
    getParams() {
      const params =
        this.infoParams && Object.keys(this.infoParams.length !== 0)
          ? this.infoParams
          : {}
      if (this.infoType === 'default') {
        params.pageType = 0
        return params
      } else if (
        this.infoType === 'crm_contract' ||
        this.infoType === 'crm_receivables' ||
        this.infoType === 'oa_examine'
      ) {
        params.pageType = 0
        return params
      }
    },

    /**
     * 勾选
     */
    changeCheckout(val) {
      this.refreshAllCheck(val.length)
      const children = this.$refs.checkboxGroup.$children || []
      const selectItems = []
      for (let index = 0; index < children.length; index++) {
        const check = children[index].isChecked
        if (check) {
          selectItems.push(this.list[index])
        }
      }
      this.$emit('changeCheckout', selectItems, val)
    },

    /**
     * 全部勾选
     */
    handleCheckAllChange(val) {
      this.selectIds = val
        ? this.list.map(item => {
          return item.userId
        })
        : []
      this.isIndeterminate = false
      const selectItems = val ? this.list : []
      this.$emit('changeCheckout', selectItems, this.selectIds)
    },

    /**
     * 刷新总check
     */
    refreshAllCheck(checkedCount) {
      this.checkAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
    },

    /**
     * 标记勾选
     */
    checkItems(items) {
      this.selectIds = items.map(item => {
        return item.userId
      })
      this.refreshAllCheck(this.selectIds.length)
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
    },

    /**
     * 清空全部
     */
    clearAll() {
      this.selectItems = []
      this.$emit('changeCheckout', [], [])
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
  padding: 5px 0;
  height: 200px;
  overflow: auto;
}
.colleagues-list {
  padding: 5px 0;
  display: block;
  margin-left: 0;
}

.xh-user {
  color: #333;
  font-size: 12px;
  &__hd {
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $xr-border-line-color;
  }

  &__bd {
    padding: 10px 12px;
  }

  &__ft {
    padding: 5px 12px;
    background: #f7f8fa;
    border-top: 1px solid $xr-border-line-color;
    .el-button {
      font-size: 12px;
    }
  }
}

// 选择信息
.select-info {
  display: inline-block;
  width: calc(100% - 30px);

  &--num {
    color: $xr-color-primary;
  }
}

// check样式
.el-checkbox {
  /deep/ .el-checkbox__label {
    color: #333;
  }
}

.all-check {
  display: inline-block;
  padding: 5px 0;
}

.search-input {
  /deep/ .el-input__inner {
    background-color: #F4F4F4;
    border: none;
  }
}
</style>
