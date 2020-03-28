<template>
  <el-dialog
    v-loading="loading"
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="提示"
    width="400px"
    @close="handleCancel">
    <div class="handle-box">
      <flexbox
        class="handle-item"
        align="stretch">
        <div
          class="handle-item-name"
          style="margin-top: 8px;">请输入发票号码：</div>
        <el-input v-model="invoiceNum"/>
      </flexbox>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button
        v-debounce="handleConfirm"
        type="primary">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { crmInvoiceUpdateTypeAPI } from '@/api/customermanagement/invoice'

export default {
  name: 'MarkInvoice', // 标记为开票
  components: {},
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    detail: Object,
    // 勾选数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: true,
      invoiceNum: 1
    }
  },
  computed: {},
  watch: {
  },
  mounted() {},
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      // 重置状态
      this.status = 1
      this.$emit('update:visible', false)
    },

    /**
     * 点击确定
     */
    handleConfirm() {
      if (this.invoiceNum <= 0) {
        return
      }
      var params = {
        invoiceNum: parseInt(this.invoiceNum)
      }
      params.invoiceId = this.detail.invoiceId
      this.loading = true
      crmInvoiceUpdateTypeAPI(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loading = false
          this.detail.isType = 1
          this.handleCancel()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-box {
  color: #333;
  font-size: 12px;
}
.handle-item {
  padding-bottom: 15px;
  .handle-item-name {
    flex-shrink: 0;
    width: 110px;
  }
  .handle-item-content {
    flex: 1;
  }
}
.handle-bar {
  position: relative;
  margin-top: 10px;
  height: 30px;
  button {
    float: right;
    margin-right: 10px;
  }
}
</style>
