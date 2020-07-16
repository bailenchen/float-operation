<template>
  <keep-alive>
    <component
      :is="componentName"
      @menu-select="menuSelect" />
  </keep-alive>
</template>

<script>
import ClueIndex from './ClueIndex'
import AppletIndex from '../applet/AppletIndex'

import { mapGetters } from 'vuex'
export default {
  name: 'ClueAllIndex',
  components: {
    ClueIndex,
    AppletIndex
  },
  props: {},
  data() {
    return {
      componentName: ''
    }
  },
  computed: {
    ...mapGetters(['crm'])
  },
  watch: {},
  mounted() {
    if (this.crm && this.crm.leads) {
      this.componentName = 'ClueIndex'
    } else if (this.crm && this.crm.applet) {
      this.componentName = 'AppletIndex'
    }
  },

  beforeDestroy() {},
  methods: {
    /**
     * 左侧菜单选择
     */
    menuSelect(key, keyPath) {
      this.componentName = {
        leads: 'ClueIndex',
        applet: 'AppletIndex'
      }[key]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
