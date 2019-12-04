<template>
  <div class="edit-card">
    <div class="head">
      <span class="wk wk-contacts icon" />
      <span class="text">名片信息</span>
    </div>
    <div class="QRCode">
      <p class="QR-text">扫描二维码查看属于自己的个人名片</p>
      <el-image :src="eWurl" class="QR-img"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  wechatQueryAPI } from '@/api/systemManagement/poster'
export default {
  name: 'EditCard',
  data() {
    return {
      loading: false,
      eWurl: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.getRD()
  },
  methods: {
    /** 查询二维码 */
    getRD() {
      wechatQueryAPI({ type: 1 }).then(res => {
        this.eWurl = res.data
      }).catch(() => {})
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
</style>
