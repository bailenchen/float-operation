<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="变更中心"
    width="450px"
    @close="handleCancel">
    <div class="handle-box">
      <flexbox class="handle-item">
        <div class="handle-item-name">请选择中心：</div>
        <xh-structure-cell
          :value="selectList"
          :info-params="infoParams"
          class="handle-item-content"
          placeholder="点击选择"
          @value-change="deptChange"/>
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
import { XhStructureCell } from '@/components/CreateCom'
import { crmChangeCenterAPI } from '@/api/customermanagement/student'



export default {
  name: 'ChangeDeptHandle',
  components: {
    XhStructureCell
  },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    id: [String, Number],
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      infoParams: { hiddenLargePid: true },
      selectList: [],
      list: [],
      crmType: 'student'
    }
  },
  methods: {
    /** 中心更改 */
    deptChange(data) {
      console.log(data, 'nkkk')
      this.selectList = data.value
    },
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    /**
     * 确定
     */
    handleConfirm() {
      if (!this.selectList.length) {
        return this.$message.error('请选择变更中心')
      }
      crmChangeCenterAPI({ deptId: this.selectList[0].id, customerId: this.selectionList[0].customerId }).then(res => {
        this.$message.success('操作成功')
        this.handleCancel()
        this.$emit('handle', { type: 'change_dept' })
      }).catch(err => {
        console.log(err)
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
      width: 80px;
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
