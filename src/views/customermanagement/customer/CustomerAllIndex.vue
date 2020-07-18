<template>
  <keep-alive>
    <component
      :is="componentName"
      @menu-select="menuSelect" />
  </keep-alive>
</template>

<script>
import CustomerIndex from './CustomerIndex'
import MapIndex from '../map/MapIndex'
import SeasIndex from '../seas/SeasIndex'

import { mapGetters } from 'vuex'
export default {
  name: 'CustomerAllIndex',
  components: {
    CustomerIndex,
    MapIndex,
    SeasIndex
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
    if (this.crm && this.crm.customer) {
      this.componentName = 'CustomerIndex'
    } else if (this.crm && this.crm.pool) {
      this.componentName = 'SeasIndex'
    }
  },

  beforeDestroy() {},
  methods: {
    /**
     * 左侧菜单选择
     */
    menuSelect(key, keyPath) {
      this.componentName = {
        customer: 'CustomerIndex',
        seas: 'SeasIndex',
        nearby: 'MapIndex'
      }[key]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
