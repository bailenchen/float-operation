<template>
  <div class="repeat-box">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="重复">
        <el-select
          v-model="form.repeat"
          placeholder="选择重复类型"
          @change="changeRepeat">
          <el-option
            v-for="item in repeatList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <template v-if="form.repeat !== '从不重复'">
        <el-form-item label="重复频率" style="whiteSpace: nowrap">
          <el-input
            v-model.number="form.count"
            type="number"
            min="0"
            autocomplete="off"/>
          <span>{{ form.repeat.substr(1) }}</span>
        </el-form-item>
        <el-form-item label="重复时间">
          <el-input
            v-model.number="form.time"
            type="number"
            min="0"
            autocomplete="off"/>
        </el-form-item>
        <el-form-item label="结束" class="form_radio">
          <el-radio-group v-model="form.end" @change="changeEndDate">
            <el-radio :label="3">从不</el-radio>
            <el-radio :label="6">重复
              <el-input
                :disabled="!(form.end == 6)"
                v-model.number="form.endCount"
                type="number"
                class="radio_input"/> 次以后
            </el-radio>
            <el-radio :label="9">
              <span class="date_span"> 结束日期</span>
              <el-date-picker
                :disabled="!(form.end == 9)"
                v-model="form.date"
                class="form_date"
                type="date"
                placeholder="选择日期"/>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item label="摘要" class="form_bottom">
        <div class="bottom-text" v-text="summaryText()"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Repeat',
  props: {
    repeatType: {
      type: String,
      default: '每天'
    }
  },
  data() {
    return {
      form: {
        repeat: '',
        time: 1,
        count: 1,
        end: '',
        date: '',
        endCount: ''
      },
      repeatList: [
        { label: '从不重复', value: '从不重复' },
        { label: '每天', value: '每天' },
        { label: '每周', value: '每周' },
        { label: '每月', value: '每月' },
        { label: '每年', value: '每年' }
      ]
    }
  },
  watch: {
  },
  mounted() {
    this.form.repeat = this.repeatType
  },
  methods: {
    /**
     * 摘要文字
     */
    summaryText() {
      if (this.form.repeat === '从不重复') {
        return '从不重复'
      } else {
        return `每${this.form.count}${this.form.repeat.substr(1)}，重复${this.form.time}次`
      }
    },

    /**
     * 改变结束时间
     */
    changeEndDate(value) {
      this.form.date = ''
      this.form.endCount = ''
    },

    /**
     * 改变重复类型
     */
    changeRepeat(value) {
      this.form = {
        repeat: value,
        time: 1,
        count: 1,
        end: '',
        date: '',
        endCount: ''
      }
    }
  }
}
</script>
<style scoped lang="scss">
.bottom-text{
  color: #666;
}
/deep/.el-form-item__content{
  width: 443px;
}
/deep/.el-radio{
  display: block;
  line-height: 46px;
  height: 46px;
}
.form_radio{
  margin-bottom: 10px;
  /deep/.el-form-item__content{
    margin-top: 0px;
  }
}
.form_bottom{
  margin-bottom: 10px;
}
.radio_input{
  width: 200px !important;
  /deep/.el-input__inner{
    width: 145px !important;
    margin-left: 50px !important;
  }
 }
 .form_date{
   width: 200px !important;
   /deep/.el-input__inner{
     width: 145px !important;
   }
 }
 .date_span{
   display: inline-block;
   margin-right: 24px;
 }
</style>
