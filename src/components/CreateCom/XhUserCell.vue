<template>
  <el-popover
    :disabled="disabled"
    :placement="placement"
    v-model="showSelectView"
    width="300"
    popper-class="no-padding-popover"
    trigger="click">
    <xh-user
      v-if="!disabled&&showSelectView"
      ref="xhuser"
      v-bind="$attrs"
      :selected-data="dataValue"
      @changeCheckout="checkUsers"/>
    <flexbox
      v-if="!$slots.reference"
      slot="reference"
      :class="[disabled ? 'is_disabled' : 'is_valid']"
      wrap="wrap"
      class="user-container"
      @click.native="focusClick">
      <div
        v-for="(item, index) in dataValue"
        :key="index"
        class="user-item"
        @click.stop="deleteuser(index)">{{ item.realname }}
        <i class="delete-icon el-icon-close"/>
      </div>
      <div class="add-item">+{{ placeholder }}</div>
    </flexbox>
    <slot v-else slot="reference" name="reference"/>
  </el-popover>

</template>
<script type="text/javascript">
import XhUser from './XhUser'
import arrayMixin from './arrayMixin'

export default {
  name: 'XhUserCell', // 新建 user-cell
  components: {
    XhUser
  },
  mixins: [arrayMixin],
  inheritAttrs: false,
  props: {
    placeholder: {
      type: String,
      default: '添加员工'
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  data() {
    return {
      showPopover: false, // 展示popover
      showSelectView: false // 展示选择内容列表
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    /**
     * 选中
     */
    checkUsers(data) {
      this.dataValue = data
      this.$emit('value-change', {
        item: this.item,
        index: this.index,
        value: data
      })
    },

    /**
     * 删除
     */
    deleteuser(index) {
      this.dataValue.splice(index, 1)
      this.$emit('value-change', {
        item: this.item,
        index: this.index,
        value: this.dataValue
      })
    },

    /**
     * 聚焦动作
     */
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
