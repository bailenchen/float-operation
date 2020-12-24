<template>
  <div>

    <el-select v-show="isImpersonality" v-model="impersonality" placeholder="请选择" style="width: 100%;">
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-input
      v-show="!isImpersonality"
      v-model="subjectivity"
      :autosize="{ minRows: 3}"
      :maxlength="800"
      type="textarea"
      resize="none"
      show-word-limit
      @input="valueChange"/>

  </div>
</template>

<script>
export default {
  name: 'XhCause',
  data() {
    return {
      options: [
        {
          label: '搬家移民出国',
          value: 1
        },
        {
          label: '高三结课',
          value: 2
        },

        {
          label: '不参加上海中高考（中考为三校生）',
          value: 3
        },
        {
          label: '身体原因（孩子生病，不能继续上课）',
          value: 4
        },
        {
          label: '新签时咨询老师过渡承诺',
          value: 5
        },
        {
          label: '离职老师的恶意诋毁',
          value: 6
        },
        {
          label: '距离问题',
          value: 7
        },
        {
          label: '没有按照约定的时间开班',
          value: 8
        },
        {
          label: '其他',
          value: 9
        }

      ],
      isImpersonality: true,
      impersonality: '', // 客观
      subjectivity: '' // 主观
    }
  },
  methods: {
    valueChange(val) {
      console.log('val', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/** 调整textarea输入 */
.el-textarea /deep/ .el-textarea__inner {
  border: none;
  color: #333333;
  height:80px !important;
  overflow:auto;
}
.el-textarea /deep/ .el-textarea__inner:focus {
  outline: 0;
  border-color: #ddd;
}

.el-textarea /deep/ .el-input__count {
  bottom: 0;
  line-height: initial;
}

.el-textarea {
  border-radius: 3px;
  border: 1px solid #ddd;
  padding-bottom: 10px;
}
</style>
