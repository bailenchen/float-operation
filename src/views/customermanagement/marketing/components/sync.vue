<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    title="同步到客户"
    width="600px"
    @close="handleCancel">
    <div class="description">客户表单中有隐藏的必填项字段未填，请完善一下信息，才能同步到客户列表</div>
    <div
      v-loading="loading"
      class="field-content">
      <template v-for="(item, index) in handleFieldList">
        <flexbox
          v-if="item.form_type != 'file'"
          :key="index"
          align="stretch"
          class="cell">
          <div class="cell-header">{{ item.name }}</div>
          <el-input
            v-if="
              item.form_type == 'text' ||
                item.form_type == 'number' ||
                item.form_type == 'floatnumber' ||
                item.form_type == 'mobile' ||
            item.form_type == 'email'"
            v-model="item.value"
            class="cell-body"
            placeholder="请输入内容"/>
          <el-input
            v-else-if="item.form_type == 'textarea'"
            :rows="2"
            v-model="item.value"
            type="textarea"
            resize="none"
            placeholder="请输入内容"/>
          <el-select
            v-else-if="item.form_type == 'select'"
            v-model="item.value"
            style="width: 100%;"
            placeholder="请选择">
            <el-option
              v-for="(settingItem, index) in item.setting"
              :key="index"
              :label="settingItem"
              :value="settingItem"/>
          </el-select>
          <el-select
            v-else-if="item.form_type == 'checkbox'"
            v-model="item.value"
            style="width: 100%;"
            multiple
            placeholder="请选择">
            <el-option
              v-for="settingItem in item.setting"
              :key="settingItem"
              :label="settingItem"
              :value="settingItem"/>
          </el-select>
          <el-date-picker
            v-else-if="item.form_type == 'date'"
            v-model="item.value"
            style="width: 100%;"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"/>
          <el-date-picker
            v-else-if="item.form_type == 'datetime'"
            v-model="item.value"
            style="width: 100%;"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"/>
        </flexbox>
      </template>
    </div>
    <div class="handle-bar">
      <div class="handle-bar-save">
        <el-button @click.native="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click.native="handleConfirm">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import { objDeepCopy } from '@/utils'
export default {
  name: 'Sync', // 同步到客户
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    id: {
      type: [String, Number],
      required: true
    },
    fieldList: Array
  },
  data() {
    return {
      visible: false, // 控制展示
      loading: false,
      // field 数据
      handleFieldList: []
    }
  },
  computed: {},
  watch: {
    dialogVisible: {
      handler(val) {
        this.visible = val
      },
      deep: true,
      immediate: true
    },
    fieldList: {
      handler(val) {
        this.handleFieldList = objDeepCopy(this.fieldList)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.visible = false
      this.$emit('update:dialogVisible', false)
    },

    /**
     * 确定选择
     */
    handleConfirm() {
      this.$emit('sure', this.handleFieldList)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.description {
  font-size: 12px;
  padding-bottom: 5px;
  color: #aaa;
}

.handle-bar {
  font-size: 12px;
  .handle-bar-save {
    position: relative;
    height: 30px;
    button {
      float: right;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
}

.field-content {
  height: 40vh;
  overflow-y: auto;
  position: relative;
}

.cell {
  padding: 10px 20px 10px 0px;
  &-header {
    flex-shrink: 0;
    width: 100px;
    margin-right: 8px;
    overflow: hidden;
    padding-top: 5px;
    font-size: 13px;
  }

  &-body {
    flex: 1;
  }
}
.el-dialog__wrapper /deep/.el-dialog__body {
  padding: 10px 50px 30px;
}
.el-dialog__wrapper /deep/.el-dialog__header {
  padding: 20px 50px;
}
</style>
