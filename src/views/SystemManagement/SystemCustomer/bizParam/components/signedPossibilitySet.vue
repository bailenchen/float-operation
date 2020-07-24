<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>签约可能性设置</span>
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
          v-model="item.signUpName"
          :maxlength="100"/>
        <i
          class="el-icon-remove"
          @click="deleteItem(item, index)"/>
      </div>
      <el-button
        type="text"
        @click="addItem">+添加类型</el-button>
    </div>
  </div>
</template>

<script>
import {
  QuerySignUpList,
  AddAdminSignUp
} from '@/api/systemManagement/params'

export default {
  name: 'SignedPossibilitySet',

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
      QuerySignUpList()
        .then(res => {
          this.loading = false
          this.deleteList = []
          this.list = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 增加类型
     */
    addItem() {
      this.list.push({ signUpName: '' })
    },

    /**
     * 删除事项操作
     */
    deleteItem(item, index) {
      this.deleteList.push(item)
      this.list.splice(index, 1)
    },

    checkForm() {
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].signUpName) {
          this.$message.error('可能性不能为空')
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
      const data = this.list.map((o, i) => {
        return {
          ...o,
          sort: i + 1
        }
      })
      const deleteItem = this.deleteList.map(o => { return { id: o.id } })
      AddAdminSignUp([
        ...data,
        ...deleteItem
      ])
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
