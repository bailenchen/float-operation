<template>
  <div class="repeat-box">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="重复">
        <el-select
          v-model="form.repetitionType"
          placeholder="选择重复类型"
          @change="changeRepeat">
          <el-option
            v-for="item in repeatList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <template v-if="form.repetitionType != 1">
        <el-form-item label="重复频率" style="whiteSpace: nowrap">
          <el-input
            v-model.number="form.repeatRate"
            type="number"
            min="0"
            autocomplete="off"/>
          <span>{{ timeList[form.repetitionType] }}</span>
        </el-form-item>
        <el-form-item v-if="form.repetitionType != 2 && form.repetitionType != 5" label="重复时间">
          <el-checkbox-group
            v-if="form.repetitionType == 3"
            v-model="checkedRepeatTime"
            @change="changeRepeatTime">
            <el-checkbox
              v-for="item in repeatTimeList"
              :label="item.label"
              :value="item.value"
              :key="item.value"/>
          </el-checkbox-group>
          <el-select v-else v-model="form.repeatTime" placeholder="请选择">
            <el-option
              v-for="item in dayList"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="结束" class="form_radio">
          <el-radio-group v-model="form.endType" @change="changeEndDate">
            <el-radio label="1">从不</el-radio>
            <el-radio label="2">重复
              <el-input
                :disabled="!(form.endType == 2)"
                v-model="endCount"
                type="number"
                class="radio_input"/> 次以后
            </el-radio>
            <el-radio label="3">
              <span class="date_span"> 结束日期</span>
              <el-date-picker
                :disabled="!(form.endType == 3)"
                v-model="endDate"
                class="form_date"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
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
      type: Number,
      default: 0
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        repeatTime: '',
        repeatRate: '', // 重复频率
        endType: '', // 结束类型
        endTypeConfig: '', // 结束次数/时间
        repetitionType: 0
      },
      endDate: '',
      endCount: '',
      repeatList: [
        { label: '从不重复', value: 1 },
        { label: '每天', value: 2 },
        { label: '每周', value: 3 },
        { label: '每月', value: 4 },
        { label: '每年', value: 5 }
      ],
      timeList: ['', '', '天', '周', '月', '年'],
      checkedRepeatTime: [],
      repeatTimeList: [
        { label: '一', value: '1' },
        { label: '二', value: '2' },
        { label: '三', value: '3' },
        { label: '四', value: '4' },
        { label: '五', value: '5' },
        { label: '六', value: '6' },
        { label: '日', value: '7' }
      ],
      dayList: []
    }
  },
  watch: {
  },
  mounted() {
    this.dayList = []
    this.form.repetitionType = this.repeatType
    if (Object.keys(this.detail).length) {
      this.form.repetitionType = this.detail.repetitionType
      this.form.repeatTime = this.detail.repeatTime || ''
      this.form.repeatRate = this.detail.repeatRate || ''
      this.form.endType = this.detail.endType + '' || ''
      if (this.detail.endType == 2) {
        this.endCount = this.detail.endTypeConfig
        this.endDate = ''
      } else if (this.detail.endType == 3) {
        this.endDate = this.detail.endTypeConfig
        this.endCount = ''
      }
      this.form.endTypeConfig = this.detail.endTypeConfig
    }
    for (let i = 1; i <= 31; i++) {
      this.dayList.push(i)
    }
  },
  methods: {
    /**
     * 摘要文字
     */
    summaryText() {
      if (this.form.repetitionType === 1) {
        return '从不重复'
      } else if (this.form.repetitionType === 2) {
        return `每${this.form.repeatRate}天`
      } else if (this.form.repetitionType === 3) {
        return `每${this.form.repeatRate}周, 周${this.checkedRepeatTime.join('、')}`
      } else if (this.form.repetitionType === 4) {
        return `每${this.form.repeatRate}月，第${this.form.repeatTime}天`
      } else if (this.form.repetitionType === 5) {
        return `每${this.form.repeatRate}年`
      }
    },

    /**
     * 改变结束时间
     */
    changeEndDate(value) {
    },

    /**
     * 改变重复类型
     */
    changeRepeat(value) {
      this.form = {
        repetitionType: value,
        repeatTime: '',
        repeatRate: '', // 重复频率
        endType: '', // 结束类型
        endTypeConfig: '' // 结束次数/时间
      }
    },

    /**
     * 改变重复时间
     */
    changeRepeatTime() {
      if (this.checkedRepeatTime.length) {
        const list = []
        this.repeatTimeList.forEach(item => {
          this.checkedRepeatTime.forEach(element => {
            if (item.label === element) {
              list.push(item.value)
            }
          })
        })
        this.form.repeatTime = list.join(',')
      } else {
        this.form.repeatTime = ''
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
