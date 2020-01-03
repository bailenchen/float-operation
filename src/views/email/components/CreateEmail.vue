<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <div class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:20px;color:#333;">新建邮件</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <div class="crm-create-flex">

        <flexbox class="form-item" direction="row" align="flex-start">
          <div class="form-label">收件人</div>
          <div class="form-add">+ 添加</div>
        </flexbox>
        <flexbox class="form-item" direction="row" align="flex-start">
          <div class="form-label">抄送</div>
          <div class="form-add">+ 添加</div>
        </flexbox>
        <flexbox class="form-item" direction="row" align="flex-start" style="margin:0;">
          <div class="form-label">主题</div>
          <div class="form-add">
            <input type="text" style="width:720px;border:0;">
          </div>
        </flexbox>

        <flexbox class="extra-file">
          <i class="el-icon-link"/>
          <div class="add-file">添加附件</div>
        </flexbox>

        <flexbox class="btn-group">
          <el-button type="primary">发送</el-button>
          <el-button type="info" plain>存稿箱</el-button>
          <el-button type="info" plain>关闭</el-button>
        </flexbox>

        <rich-txt :catch-data="catchData" class="rich-txt"/>
      </div>
    </div>
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import RichTxt from './RichTxt'
export default {
  name: 'CreateEmail',
  components: {
    CreateView,
    RichTxt
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    /**
     * 关闭新建邮件
     */
    hidenView() {
      this.$emit('hiden-view')
    },

    catchData(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  padding: 0 10px;
  .form-item {
    border-bottom: 1px solid #E6E6E6;
    font-size: 14px;
    line-height: 35px;
    margin-bottom: 15px;
    .form-label {
      width: 70px;
      color: #333;
    }
    .form-add {
      color: #2362FB;
    }
  }
  .extra-file {
    margin-top: 28px;
    .add-file {
      color: #2362FB;
      margin-left: 10px;
    }
  }
  .btn-group {
    position: absolute;
    right: 10px;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .rich-txt {
    margin-top: 20px;
  }
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}
</style>
