<template>
  <div class="">
    <el-dialog :visible.sync="dialogFormVisible" title="解除预警">
      <div>
        <div style="margin-bottom:5px;">解除预警原因：</div>
        <el-input
          :rows="5"
          v-model="textarea"
          type="textarea"
          placeholder="请输入内容"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DismissWarning',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      textarea: ''
    }
  },
  watch: {
    visible(val) {
      this.dialogFormVisible = val
    }
  },
  methods: {
    cancel() {
      this.$emit('hiden-view', 'dismiss_warning')
    },
    confirm() {
      this.cancel()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
