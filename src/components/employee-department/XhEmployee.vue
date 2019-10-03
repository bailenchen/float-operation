<template>
  <el-popover
    v-model="showPopver"
    :disabled="disabled"
    placement="bottom"
    width="300"
    trigger="click">
    <employee
      ref="xhuser"
      v-bind="$attrs">
      <div slot="reference">
        <flexbox
          :class="[disabled ? 'is_disabled' : 'is_valid']"
          wrap="wrap"
          class="user-container"
          @click.native="focusClick">
          <div
            v-for="(item, index) in showValue"
            :key="index"
            class="user-item"
            @click.stop="deleteuser(index)">{{ item.realname }}
            <i class="delete-icon el-icon-close"/>
          </div>
          <div class="add-item">+{{ placeholder }}</div>
        </flexbox>
      </div>
  </employee></el-popover>

</template>
<script type="text/javascript">
import { usersList } from '@/api/common'
import Employee from './Employee'

export default {
  name: 'XhEmployee',
  components: {
    Employee
  },
  inheritAttrs: false,
  props: {
    radio: {
      type: Boolean,
      default: true
    },

    placeholder: {
      type: String,
      default: '添加员工'
    },

    // 自定义请求
    request: Function,
    // 请求辅助参数
    params: Object,

    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showValue: [],
      list: [],
      showPopver: false
    }
  },
  computed: {},
  watch: {
    showPopver(val) {
      if (val && this.list.length == 0) {
        this.getList()
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 获取列表
     */
    getList() {
      this.loading = true
      const request = this.request || usersList
      const params = this.params || {}
      params.pageType = 0

      request()(params)
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /** 选中 */
    checkUsers(data) {
      this.dataValue = data.data
      this.$emit('value-change', {
        item: this.item,
        index: this.index,
        value: data.data
      })
    },
    /** 删除 */
    deleteuser(index) {
      if (this.$refs.xhuser) {
        this.$refs.xhuser.cancelCheckItem(this.dataValue[index])
      }
      this.dataValue.splice(index, 1)
      this.$emit('value-change', {
        item: this.item,
        index: this.index,
        value: this.dataValue
      })
    },
    /** 聚焦动作 */
    focusClick() {
      this.showSelectView = true
      this.$emit('focus')
    }
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  min-height: 34px;
  margin: 3px 0;
  position: relative;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #ddd;
  color: #333333;
  padding: 0.5px;
  line-height: 15px;
  max-height: 105px;
  overflow-y: auto;
  .user-item {
    padding: 5px;
    background-color: #e2ebf9;
    border-radius: 3px;
    margin: 3px;
    cursor: pointer;
  }
  .add-item {
    padding: 5px;
    color: #2362FB;
    cursor: pointer;
  }
  .delete-icon {
    color: #999;
    cursor: pointer;
  }
  &:hover {
    border-color: #c0c4cc;
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
</style>
