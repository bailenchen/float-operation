<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>渠道设置</span>
    </div>
    <div class="product-setting">
      <div class="tips">注：1、渠道最多设置2级</div>
      <div class="tips">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、未进行添加渠道类型的渠道，该渠道的LEADS将自动分配至过滤人员（最早创建时间渠道类型中过滤人 员）下</div>
      <div
        style="margin-top: 5px"
        class="product-setting-con">
        <div>
          <span
            class="el-icon-plus"
            style="color: #409EFF;"/>
          <el-button
            type="text"
            @click.native="handleTreeSetDrop({type:'create-one'})">新增一级分类</el-button>
        </div>
        <div class="tree-box">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            default-expand-all>
            <flexbox
              slot-scope="{ node, data }"
              class="node-data">
              <img
                v-if="node.expanded"
                class="node-img"
                src="@/assets/img/fold.png">
              <img
                v-if="!node.expanded"
                class="node-img"
                src="@/assets/img/unfold.png">
              <div
                :class="{gray: node.data.status != 1}"
                class="node-label">
                {{ node.label }}
              </div>
              <el-dropdown
                trigger="click"
                @command="handleTreeSetDrop">
                <div
                  class="node-label-set"
                  @click.stop="getChild(node)">设置</div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in treeSetTypes"
                    :key="index"
                    :command="item">{{ item.name }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </flexbox>
          </el-tree>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="productHandleDialog"
      :close-on-click-modal="false"
      title="提示"
      width="400px">
      <el-form :model="productForm">
        <el-form-item
          label="类别名称"
          label-width="80">
          <el-input
            :maxlength="20"
            v-model="productForm.name"
            autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="productHandleDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueryChannelCategory,
  AddChannelCategory,
  DeleteChannelCategory,
  UpdateChannelCategory
} from '@/api/systemManagement/params'

export default {
  name: 'ChannelCategorySet',

  components: {},

  data() {
    return {
      loading: false, // 展示加载中效果

      // 渠道类别设置
      treeData: [],
      /** 更多操作 */
      treeSetTypes: [],
      // 最大可创建2级
      maxCreateLevel: 2,
      // 编辑渠道弹窗
      productHandleDialog: false,
      productForm: { name: '', type: '', parentId: '', categoryId: '' },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  created() {
    this.getProductCategoryIndex()
  },

  methods: {
    /**
     * 渠道类别设置
     */
    getChild(node) {
      const temps = [
        { type: 'create-child', name: '新建子分类' },
        { type: 'create-brother', name: '新建平级分类' },
        { type: 'edit', name: '编辑分类' }
        // { type: 'delete', name: '删除分类' }
      ]
      if (node.level < this.maxCreateLevel) {
        this.treeSetTypes = temps.map(item => {
          item['node'] = node
          return item
        })
      } else {
        this.treeSetTypes = temps.slice(1).map(item => {
          item['node'] = node
          return item
        })
      }
      if (node.data.status == 1) {
        this.treeSetTypes.splice(0, 0, {
          type: 'status',
          name: '停用分类',
          node: node
        })
      } else {
        this.treeSetTypes.splice(0, 0, {
          type: 'status',
          name: '启用分类',
          node: node
        })
      }
    },

    /**
     * 渠道操作
     */
    handleTreeSetDrop(command) {
      if (command.type === 'create-one') {
        // 新增一级分类
        this.productForm = {
          type: command.type,
          name: ''
        }
        this.productHandleDialog = true
      }
      if (command.type === 'create-child') {
        // 新增子节点
        this.productForm = {
          type: command.type,
          parentId: command.node.data.id,
          name: ''
        }
        this.productHandleDialog = true
      } else if (command.type === 'create-brother') {
        // 新增平级节点
        this.productForm = {
          type: command.type,
          parentId: command.node.data.parentId,
          name: ''
        }
        this.productHandleDialog = true
      } else if (command.type === 'edit') {
        // 编辑节点
        this.productForm = {
          type: command.type,
          parentId: command.node.data.parentId,
          id: command.node.data.id,
          name: command.node.data.name
        }
        this.productHandleDialog = true
      } else if (command.type === 'status') {
        this.$confirm(`确定${command.node.data.status == 1 ? '停用' : '启用'}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          UpdateChannelCategory({
            id: command.node.data.id,
            status: command.node.data.status == 1 ? 0 : 1
          }).then(() => {
            this.$message.success('操作成功')
            this.getProductCategoryIndex()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      } else if (command.type === 'delete') {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = command.node.data
            if (data.hasOwnProperty('children') && data.children.length > 0) {
              this.$message.error('该类别下有其他子类别！')
              return
            }
            this.loading = true
            DeleteChannelCategory({
              id: command.node.data.id
            })
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getProductCategoryIndex()
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },

    /**
     * 渠道类别操作
     */
    handleProduct() {
      if (this.productForm.name.length === 0) {
        this.$message({
          message: '请填写名称',
          type: 'warning'
        })
        return
      }
      this.productHandleDialog = false
      let params = {}
      let msg = '新建成功'
      if (this.productForm.type === 'create-one') {
        params = {
          name: this.productForm.name
        }
      } else if (this.productForm.type === 'create-child') {
        params = {
          parentId: this.productForm.parentId,
          name: this.productForm.name
        }
        this.loading = true
      } else if (this.productForm.type === 'create-brother') {
        params = {
          parentId: this.productForm.parentId,
          name: this.productForm.name
        }
      } else if (this.productForm.type === 'edit') {
        params = {
          id: this.productForm.id,
          parentId: this.productForm.parentId,
          name: this.productForm.name
        }
        msg = '编辑成功'
      }
      this.loading = true
      AddChannelCategory(params)
        .then(res => {
          this.getProductCategoryIndex()
          this.$message.success(msg)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 获取渠道分类数据
     */
    getProductCategoryIndex() {
      this.loading = true
      QueryChannelCategory()
        .then(res => {
          this.loading = false
          this.treeData = res.data
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

/* 渠道类别设置 */
.product-setting {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 30px;
  position: relative;
}
.tree-box {
  overflow: auto;
}
.tree-box /deep/ .el-tree-node__expand-icon {
  display: none;
}
.tree-box /deep/ .el-tree-node__content {
  margin-bottom: 10px;
}
.node-data {
  font-size: 13px;
  .node-img {
    width: 15px;
    height: 15px;
    display: block;
    margin-right: 8px;
  }
  .node-label.gray {
    color: #bbb;
  }
  .node-label:hover {
    background-color: #ededed;
  }
  .node-label-set {
    margin-left: 8px;
    font-size: 12px;
    color: $xr-color-primary;
    display: none;
  }
}

.node-data:hover .node-label-set {
  display: block;
}

.product-setting-con {
  position: absolute;
  top: 20px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}

.tips {
  color: #999;
  font-size: 13px;
}
</style>
