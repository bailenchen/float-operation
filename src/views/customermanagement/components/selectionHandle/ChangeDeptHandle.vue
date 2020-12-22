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

    <create-examine-info
      ref="examineInfo"
      :types-id="id"
      types="changeDept"
      @value-change="examineValueChange" />

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
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'


export default {
  name: 'ChangeDeptHandle',
  components: {
    XhStructureCell,
    CreateExamineInfo
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
  computed: {},
  watch: {
    // list: {
    //   handler() {
    //     this.selectList = []
    //   },
    //   immediate: true
    // },
    visible(val) {
    }
  },
  mounted() {
  },
  methods: {
    /** 中心更改 */
    deptChange(data) {
      this.selectList = data.value
    },
    examineValueChange() {},
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
      if (this.selectList.length > 0) {
        console.log('save: ', this.selectList)
        this.$message.success('操作成功')
        this.handleCancel()
      }
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
