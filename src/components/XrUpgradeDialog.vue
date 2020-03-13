<template>
  <el-dialog
    :visible="visible"
    class="xr-upgrade-dialog"
    title=""
    width="700px"
    append-to-body
    @close="closeView">
    <el-button class="close-button" icon="el-icon-close" @click="closeView"/>
    <flexbox class="upgrade-header" justify="center" align="center" orient="vertical">
      <span class="upgrade-header__title">升级通知</span>
      <span class="upgrade-header__version">版本{{ WKConfig.version }}</span>
    </flexbox>
    <div class="content">
      <div class="content__title">升级内容：</div>
      <div class="content__content">{{ message }}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeView">我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Lockr from 'lockr'

export default {
  name: 'XrUpgradeDialog',
  components: {},
  props: {
    visible: Boolean
  },
  data() {
    return {
      message: `新增：
1、项目管理权限细化
2、增加邮箱功能，支持邮件收发
3、增加文件在线预览功能
4、增加系统登录日志、数据操作日志（客户管理模块）
5、增加日志规则设置，并根据日志规则设置统计员工日志完成情况
6、增加每次升级内容提醒
7、在客户列表增加“距进入公海天数”显示

优化：
1、项目管理中，已经完成的任务排列在最后
2、通讯录模块优化
3、项目模块样式优化

修复：
1、客户删除之后，在附件的客户仍然显示
2、仪表盘-排行榜中目标完成率显示错误
3、修复其他已知bug`
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    closeView() {
      Lockr.set('wk-version', WKConfig.version)
      Lockr.set('wk-build', WKConfig.build)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.xr-upgrade-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    position: relative;
    padding: 0 0 20px;
    height: 500px;
  }

  .upgrade-header {
    background-image: url('~@/assets/img/upgrade_bar.png');
    background-repeat: no-repeat;
    background-size: cover;
    height: 131px;
    color: white;

    &__title {
      display: inline-block;
      font-size: 25px;
      font-weight: bold;
    }

    &__version {
      display: inline-block;
      margin-top: 15px;
    }
  }

  .content {
    padding: 20px 30px;
    font-size: 14px;
    position: relative;
    height: 370px;
    overflow-y: auto;
    &__title {
      font-weight: bold;
    }

    &__content {
      margin-top: 15px;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1.5;
    }
  }

  .close-button {
    position: absolute;
    top: 5px;
    right: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 19px;
    font-weight: bold;
    .el-icon-close {
      color: white;
    }
  }
}
</style>
