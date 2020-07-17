<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>赠送规则设置</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="handleSave">
        保存
      </el-button>
    </div>
    <div class="content-body">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="rule-item">
        <span>购买辅导方式为</span>
        <el-select v-model="item.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
        <span>购买</span>
        <el-input-number
          v-model="item.num"
          :precision="0"
          :min="0"
          :controls="false" />
        <span>节课，</span>
        <span>可赠送</span>
        <el-input-number
          v-model="item.giftNum"
          :precision="0"
          :min="0"
          :controls="false" />
        <span>节课</span>
        <!--<span>节课，</span>
        <span>不参与累计赠送套餐</span>
        <el-select v-model="item.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>-->
        <i
          class="el-icon-remove delete-icon"
          @click="deleteItem(index)"/>
      </div>
      <el-button
        type="text"
        @click="addItem">
        +添加规则
      </el-button>
    </div>
  </div>
</template>

<script>
/**
 * Create by yxk at 2020/7/16 0016
 */
export default {
  name: 'PresentRulesSet',
  data() {
    return {
      loading: false, // 展示加载中效果
      options: [
        { label: '1对3', value: 1 },
        { label: '1对1', value: 2 }
      ],
      list: []
    }
  },
  created() {
  },
  methods: {
    handleSave() {
    },
    deleteItem(index) {
      this.list.splice(index, 1)
    },
    addItem() {
      this.list.push({})
    }
  }
}
</script>

<style scoped lang="scss">
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;

  & > span {
    display: inline-block;
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
  }
}

.content-body {
  height: calc(100% - 57px);
  padding: 30px;
  overflow-y: auto;

  .el-select, .el-input-number {
    width: 100px;
  }

  .rule-item {
    margin-bottom: 10px;
    .delete-icon {
      display: none;
    }
    &:hover .delete-icon {
      color: #ff6767;
      display: unset;
    }
  }
}
</style>
