<template>
  <el-drawer
    :visible="visible"
    :before-close="handleClose"
    :append-to-body="false"
    custom-class="project-drawer"
    size="250px"
    direction="ltr">
    <el-input
      v-model="searchInput"
      placeholder="请输入内容"/>

    <section class="section">
      <section-head
        icon-class="wk wk-label"
        label="标签看板" />

      <project-cell
        v-for="(item, index) in showList"
        :key="index"
        :label="item.name"
        :icon-color="item.color"
        :collect="false"
        icon-class="wk wk-label"
        @click.native="enterDetail(item)" />
    </section>
  </el-drawer>
</template>

<script>
import { workTasklableIndexAPI } from '@/api/projectManagement/tag'

import ProjectCell from '../components/ProjectCell'
import SectionHead from '../components/SectionHead'

export default {
  // 任务看板
  name: 'TagBoard',
  components: {
    ProjectCell,
    SectionHead
  },
  props: {
    visible: Boolean
  },
  data() {
    return {
      searchInput: '',
      list: []
    }
  },
  computed: {
    showList() {
      return this.list.filter(item => {
        return item.name.indexOf(this.searchInput) != -1
      })
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 获取列表
     */
    getList() {
      workTasklableIndexAPI()
        .then(res => {
          this.list = res.data
        })
        .catch(() => {})
    },

    /**
     * 进入详情
     */
    enterDetail(item) {
      this.$router.push({
        name: 'tag-list',
        params: {
          id: item.labelId
        }
      })

      this.handleClose()
    },

    /**
     * 关闭
     */
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  margin: 15px 0;
}
</style>
