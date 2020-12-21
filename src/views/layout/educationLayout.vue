<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        nav-index="/education"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <sidebar
        :items="educationRouters"
        main-router="education"
        @select="handleSelect"/>

      <el-main
        id="crm-main-container"
        style="padding: 0;">
        <app-main/>
      </el-main>
    </el-container>
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="createCRMType"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </el-container>
</template>

<script>
import CRMCreateView from '@/views/customermanagement/components/CRMCreateView'
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',

  components: {
    Navbar,
    Sidebar,
    AppMain,
    CRMCreateView
  },

  data() {
    return {
      isCreate: false,
      createCRMType: ''
      // crmRouters: [
      //   {}
      // ]
    }
  },

  computed: {
    ...mapGetters(['education', 'educationRouters'])
  },

  created() {
    this.getcrmMessagNum()
  },

  methods: {
    navClick(index) {},

    /**
     * 获取消息数
     */
    getcrmMessagNum() {
      this.$store
        .dispatch('GetMessageNum')
        .then(res => {})
        .catch(() => {})
    },

    /**
     * 菜单钢鞭
     */
    handleSelect() {
      this.$store.dispatch('GetMessageNum')
    },

    /**
     * 新建客户同时新建联系人
     */
    // 创建数据页面 保存成功
    createSaveSuccess(data) {
      if (data && data.saveAndCreate) {
        if (data.type == 'customer') {
          this.createCRMType = 'contacts'
          this.createActionInfo = {
            type: 'relative',
            crmType: 'customer',
            data: {}
          }
          this.createActionInfo.data['customer'] = data.data
          this.isCreate = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles/common.scss';
.el-container {
  min-height: 0;
  height: 100%;
}
.aside-container {
  position: relative;
  background-color: #2d3037;
  box-sizing: border-box;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 1200px;
}
</style>
