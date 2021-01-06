<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>学员预警规则设置</span>
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
        考试成绩为：
        <el-select v-model="item.subjectName" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        &nbsp;预警登记为：
        <el-select v-model="item.subjectName" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <i
          v-if="list.length > 1"
          class="el-icon-remove"
          @click="deleteItem(item, index)"/>
      </div>
      <el-button
        type="text"
        @click="addItem">+添加预警规则</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StudentWarningSet',
  components: {},
  data() {
    return {
      loading: false, // 展示加载中效果

      list: [
        { subjectName: '' }
      ], // 展示类型数据
      deleteList: [], // 被删除的项
      options1: [
        { label: '退步', value: 1 },
        { label: '保持', value: 2 },
        { label: '进步', value: 3 }
      ],
      options2: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 }
      ]
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
    //   this.loading = true
    //   QueryAdminSubject()
    //     .then(res => {
    //       this.loading = false
    //       this.deleteList = []
    //       this.list = res.data
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    },

    /**
     * 增加类型
     */
    addItem() {
      this.list.push({ subjectName: '' })
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
        if (!this.list[i].subjectName) {
          this.$message.error('科目名不能为空')
          return false
        }
      }
      return true
    },

    /**
     * 保存操作
     */
    save() {
    //   this.loading = true
    //   const flag = this.checkForm()
    //   if (!flag) {
    //     this.loading = false
    //     return
    //   }
    //   const data = this.list.map((o, i) => {
    //     return {
    //       ...o,
    //       sort: i + 1
    //     }
    //   })
    //   const deleteItem = this.deleteList.map(o => { return { id: o.id } })
    //   AddAdminSubject([
    //     ...data,
    //     ...deleteItem
    //   ])
    //     .then(res => {
    //       this.loading = false
    //       this.getDetail()
    //       this.$message.success('操作成功')
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
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
