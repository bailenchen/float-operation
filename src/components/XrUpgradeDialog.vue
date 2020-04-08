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
import { readUpdateNoticeAPI } from '@/api/common'

export default {
  name: 'XrUpgradeDialog',
  components: {},
  props: {
    visible: Boolean
  },
  data() {
    return {
      message: `新增：
1、合同、回款、发票、回访模块可以设置自动生成编号及编号规则
2、增加合同、回款、发票审批停用功能，停用后可以不用审批
3、新增发票模块
4、新增客户回访模块
5、系统中“我的”增加APP下载、升级日志、用户中心、帮助中心入口
6、增加附件上传进度显示
7、在客户列表增加“距进入公海天数”显示
8、项目管理的排序，增加负责人、列表展示方式
9、商机组增加“停用”功能，停用之后不影响之前的商机数据，新增的商机不能选择停用后的商机组；
10、增加商机组删除功能，删除之后不影响商机阶段正常推进
11、在回款模块增加转移功能

优化：
1、在客户跟进记录的右上角显示跟进记录属于哪个类型
2、呼叫中心统计列表增加筛选“通话时长”大于/等于/小于秒
3、升级内容提示，按照登陆账号提示，一个账号提示一次
4、呼叫中心记录在客户详情中展示出来
5、仪表盘上面销售漏斗，可点击查看

修复：
1、添加跟进记录，在数据操作日志中显示的是行为是“停用”
2、仪表盘-排行榜-目标完成率始终显示为0
3、项目下添加团队成员，报服务器响应异常
4、后台设置审批流权限，审批类型设置为固定审批流，新建审批然后点击详情，创建处提示用户未提交此申请`
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    closeView() {
      readUpdateNoticeAPI().then(res => {

      }).catch(() => {})
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
