<template>
  <div
    v-loading="loading"
    class="edit-card">
    <div class="head">
      <span class="wk wk-contacts icon" />
      <span class="text">名片信息</span>
    </div>
    <div class="QRCode">
      <p class="QR-text">扫描二维码查看属于自己的个人名片</p>
      <el-image v-if="eWurl" :src="eWurl" class="QR-img"/>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="120px">
      <el-form-item label="微信号" prop="wechatNumber">
        <el-input
          v-model.trim="form.wechatNumber"
          :maxlength="20"
          type="text" />
      </el-form-item>
      <el-form-item label="公司网址" prop="url">
        <el-input
          v-model.trim="form.url"
          :maxlength="20"
          type="text" />
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input
          v-model.trim="form.address"
          :maxlength="30"
          type="text" />
      </el-form-item>
      <el-form-item label="个人简介" prop="intro">
        <el-input
          v-model.trim="form.intro"
          :maxlength="100"
          :rows="3"
          resize="none"
          type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  wechatQueryAPI,
  visitingCardSaveAPI,
  visitingCardQueryPcAPI

} from '@/api/systemManagement/poster'
export default {
  name: 'EditCard',
  data() {
    return {
      loading: false,
      eWurl: '',
      form: {
        wechatNumber: '',
        url: '',
        address: '',
        intro: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.getRD()
    this.getCardInfo()
  },
  methods: {
    /** 查询二维码 */
    getRD() {
      wechatQueryAPI({ type: 1 }).then(res => {
        this.eWurl = res.data
      }).catch(() => {})
    },

    getCardInfo() {
      this.loading = true
      visitingCardQueryPcAPI().then(res => {
        this.form.wechatNumber = res.data.wechatNumber || ''
        this.form.url = res.data.url || ''
        this.form.address = res.data.address || ''
        this.form.intro = res.data.intro || ''

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    handleSave() {
      this.loading = true
      visitingCardSaveAPI(this.form).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
  .edit-card {
    width: 100%;
    background-color: white;
    padding: 22px 25px 60px;
  }
  .QR-text {
      padding: 20px 30px;
  }
  .QR-img {
    width: 175px;
    height: 175px;
    margin-left: 30px;
  }
  .el-form {
    padding-left: 25px;
    /deep/ .el-textarea {
      width: 376px;
    }
  }
</style>
