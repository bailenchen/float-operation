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
      :radio="radio"
      @changeCheckout="checkUsers" />
    <flexbox
      v-if="!$slots.reference"
      slot="reference"
      :class="[disabled ? 'is_disabled' : 'is_valid']"
      wrap="wrap"
      class="user-container"
      @click.native="focusClick">
      <div
        v-for="(item, index) in showDataValue"
        :key="index"
        class="user-item text-one-line">{{ item.realname }}
        <i
          class="delete-icon el-icon-close"
          @click.stop="deleteuser(index)" />
      </div>
      <i v-if="dataValue.length > max" class="el-icon-more" />
      <div
        v-if="dataValue.length == 0"
        class="add-item">{{ placeholder }}</div>
    </flexbox>
    <slot
      v-else
      slot="reference"
      name="reference" />
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
    radio: {
      // 是否单选
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '选择员工'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    max: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      showPopover: false, // 展示popover
      showSelectView: false // 展示选择内容列表
    }
  },
  computed: {
    showDataValue() {
      if (this.dataValue && this.dataValue.length > this.max) {
        return this.dataValue.slice(0, this.max)
      }
      return this.dataValue
    }
  },
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
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #e6e6e6;
  color: #333333;
  padding: 0.5px;
  line-height: 15px;
  max-height: 105px;
  overflow-y: auto;
  .user-item {
    padding: 5px 15px 5px 5px;
    background-color: #F3F7FF;
    border-radius: 4px;
    margin: 3px;
    max-width: 60px;
    position: relative;
    cursor: pointer;
  }
  .add-item {
    padding: 5px;
    color: #ddd;
    cursor: pointer;
  }
  .delete-icon {
    color: #999;
    cursor: pointer;
    position: absolute;
    top: 8px;
    right: 2px;

    &:hover {
      color: $xr-color-primary;
    }
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

.el-icon-more {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 6px 10px;
  font-size: 12px;
  background-color: #F3F7FF;
  color: #666;
  border-radius: 4px;
  &:hover {
    background-color: $xr-color-primary;
    color: white;
  }
}
</style>
