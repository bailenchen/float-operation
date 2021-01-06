<template>
  <div class="">
    <el-dialog :visible.sync="dialogFormVisible" title="提升预警等级">
      <div>
        <el-radio-group v-model="radio">
          <el-radio v-for="(item,index) in radioList" :key="index" :label="item.label">{{ item.name }}</el-radio>
        </el-radio-group>
        <div class="tip">0级表示正常、1级向直属主管报警、2级向校区负责人报警；</div>
        <div style="margin-bottom:5px;margin-top:10px;">预警原因：</div>
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
  name: 'RaiseWarning',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      radioList: [
        { label: 3, name: '预警等级1' },
        { label: 6, name: '预警等级2' }
      ],
      radio: 3,
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
      this.$emit('hiden-view', 'raise_warning')
    },
    confirm() {
      this.cancel()
    }
  }
}
</script>
<style lang='scss' scoped>
.tip {
    color:red;
    font-size:12px;
    line-height: 30px;;
}
</style>
