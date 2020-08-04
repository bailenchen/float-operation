<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>跟进常用语设置</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="save">保存</el-button>
    </div>
    <div class="content-body">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="input-item">
        <el-input
          v-model.trim="item.value"
          :maxlength="100"/>
        <i
          v-if="index > 1"
          class="el-icon-remove"
          @click="deleteItem(item, index)"/>
      </div>
      <el-button
        type="text"
        @click="addItem">+添加常用语</el-button>
    </div>
  </div>
</template>

<script>
import {
  sysConfigQueryPhraseAPI,
  sysConfigSetPhraseAPI
} from '@/api/customermanagement/common'

export default {
  name: 'FollowCommonWords',
  components: {},
  data() {
    return {
      loading: false, // 展示加载中效果

      deleteList: [],
      list: [] // 展示类型数据
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    /**
       * 获取详情
       */
    getDetail() {
      this.loading = true
      sysConfigQueryPhraseAPI()
        .then(res => {
          this.loading = false
          this.list = res.data.map(o => {
            return { value: o }
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
       * 增加类型
       */
    addItem() {
      this.list.push('')
    },

    /**
     * 删除事项操作
     */
    deleteItem(item, index) {
      this.list.splice(index, 1)
    },

    checkForm() {
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].value) {
          this.$message.error('常用语不能为空')
          return false
        }
      }
      return true
    },

    /**
       * 保存操作
       */
    save() {
      this.loading = true
      const flag = this.checkForm()
      if (!flag) {
        this.loading = false
        return
      }
      sysConfigSetPhraseAPI(this.list.map(o => o.value))
        .then(res => {
          this.loading = false
          this.getDetail()
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .content-title {
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;
  }

  .content-title > span {
    display: inline-block;
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
  }

  .content-body {
    height: calc(100% - 57px);
    padding: 30px;
    overflow-y: auto;
  }

  /* 事项布局 */
  .input-item {
    margin-bottom: 10px;

    .el-input {
      width: 300px;
    }

    .el-icon-remove {
      color: #ff6767;
      cursor: pointer;
      margin-left: 2px;
      display: none;
    }
  }

  .input-item:hover {
    .el-icon-remove {
      display: inline;
    }
  }
</style>
