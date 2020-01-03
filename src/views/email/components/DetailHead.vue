<template>
  <div class="detail-head">
    <el-button type="primary" icon="el-icon-chat-dot-round">回复</el-button>
    <el-button type="success" icon="el-icon-share">转发</el-button>
    <el-button type="danger" icon="el-icon-delete">删除</el-button>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in [{label: '移动到'}]"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'DetailHead',
  data() {
    return {
      value: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 80px;
  margin-left: 10px;
}
</style>

