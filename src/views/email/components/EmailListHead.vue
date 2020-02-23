<template>
  <div class="c-container">
    <flexbox class="title"><img
      :src="titleIcon"
      class="title-icon">
      {{ title }}
      <slot name="header"/>
    </flexbox>
    <el-input
      v-if="emailType != 'writeLetter'"
      :placeholder="placeholder"
      v-model="inputContent"
      class="sc-container"
      @input="inputChange"
      @keyup.enter.native="searchInput">
      <el-button
        slot="append"
        type="primary"
        @click.native="searchInput">搜索</el-button>
    </el-input>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'

export default {
  name: 'EmailListHead', // 邮件头部
  components: { },
  props: {
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    // CRM类型
    emailType: {
      type: String,
      default: ''
    },
    search: String
  },
  data() {
    return {
      inputContent: ''
    }
  },
  computed: {
    ...mapGetters(['crm']),

    titleIcon() {
      return require(`@/assets/img/email/${this.emailType}.png`)
    }

  },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    inputChange() {
      this.$emit('update:search', this.inputContent)
    },
    // 进行搜索操作
    searchInput() {
      this.$emit('on-search', this.inputContent)
    }
  }
}
</script>
<style lang="scss" scoped>
.c-container {
  height: 60px;
  position: relative;
  z-index: 100;
  .title-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .title {
    float: left;
    width: auto;
    padding-left: 28px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .sc-container {
    width: 300px;
    margin: -16px 0 0 -150px;
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .el-input {
    /deep/ .el-input-group__append {
      background-color: $xr-color-primary;
      border-color: $xr-color-primary;
      color: white;
    }
  }

}
</style>
