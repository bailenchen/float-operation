<template>
  <div class="edit-card">
    <div class="head">
      <span class="wk wk-contacts icon" />
      <span class="text">名片信息</span>
    </div>
    <div class="QRCode">
      <p class="QR-text">扫描二维码查看属于自己的个人名片</p>
      <el-image class="QR-img"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EditCard',
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
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
