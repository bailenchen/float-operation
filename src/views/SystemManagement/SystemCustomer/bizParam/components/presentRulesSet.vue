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
        <el-select
          v-model="item.coachId"
          placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.coachId"
            :label="item.name"
            :value="item.coachId" />
        </el-select>
        <span>购买</span>
        <el-input-number
          v-model="item.classes"
          :precision="0"
          :min="0"
          :controls="false" />
        <span>节课，</span>
        <span>可赠送</span>
        <el-input-number
          v-model="item.give"
          :precision="0"
          :min="0"
          :controls="false" />
        <span>节课</span>
        <!-- <span>不参与累计赠送套餐</span> -->
        <!-- <crm-relative-cell
          :value="item.relativeList"
          :radio="false"
          relative-type="productSetMeal"
          style="display:inline-block;width:300px;"
          @value-change="arrayValueChange($event, index, item)"
        />
        <i
          class="el-icon-remove delete-icon"
          @click="deleteItem(item, index)"/> -->
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
import {
  QueryAdminGive,
  AddAdminGive,
  QueryCoach
} from '@/api/systemManagement/params'
import {
  CrmRelativeCell
} from '@/components/CreateCom'

export default {
  name: 'PresentRulesSet',
  components: {
    CrmRelativeCell
  },
  data() {
    return {
      loading: false, // 展示加载中效果
      options: [],
      list: [],
      deleteList: [],

      packageType: '',
      packageList: [
        // { label: '暑假套餐', value: 1 },
        // { label: '寒假套餐', value: 2 },
        // { label: '1对1家教套餐', value: 3 }
      ]
    }
  },
  created() {
    this.getCoach()
  },
  methods: {
    /**
     * 查询辅导方式
     */
    getCoach() {
      this.loading = true
      QueryCoach().then(res => {
        this.loading = false
        this.options = res.data
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取详情
     */
    getDetail() {
      this.loading = true
      QueryAdminGive().then(res => {
        this.loading = false
        this.deleteList = []
        this.list = res.data.map(item => {
          item.relativeList = item.setMeal
          return item
        })
      }).catch(() => {
        this.loading = false
      })
    },

    deleteItem(item, index) {
      this.deleteList.push(item)
      this.list.splice(index, 1)
    },

    addItem() {
      this.list.push({
        coachId: null,
        give: 0,
        classes: 0
      })
    },

    checkForm() {
      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i]
        if (!item.coachId) {
          this.$message.error('请选择辅导方式')
          return false
        }
      }
      return true
    },

    arrayValueChange(data, index, item) {
      this.$set(this.list[index], 'relativeList', data.value)
      console.log(this.list)
    },

    handleSave() {
      this.loading = true
      const flag = this.checkForm()
      if (!flag) {
        this.loading = false
        return
      }
      const data = this.list.map((o, i) => {
        const item = { ...o }
        const idList = []
        if (o.relativeList) {
          for (let index = 0; index < o.relativeList.length; index++) {
            const element = o.relativeList[index]
            idList.push(element.productId)
          }
        }
        item.setMeal = idList

        delete item.name
        delete item.relativeList
        return item
      })
      const deleteItem = this.deleteList.map(o => { return { id: o.id } })
      AddAdminGive([
        ...data,
        ...deleteItem
      ]).then(res => {
        this.loading = false
        this.getDetail()
        this.$message.success('操作成功')
      }).catch(() => {
        this.loading = false
      })
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
  .package-select {
    width: 200px;
  }

  .rule-item {
    & > * {
      margin-bottom: 10px;
    }
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
