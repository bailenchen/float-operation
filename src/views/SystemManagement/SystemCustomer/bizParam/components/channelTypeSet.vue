<template>
  <div v-loading="loading">
    <div class="content-title">
      <span>渠道类型设置</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="handleAction('add')">
        添加
      </el-button>
    </div>
    <flexbox
      direction="column"
      class="content-body">
      <div class="tips">
        未进行过滤的LEADS数据，存在系统后，会直接根据LEADS的所属中心进入对应中心下校长角色的人员下
      </div>
      <flexbox-item class="table-container">
        <el-table
          :data="tableData"
          :height="tableHeight"
          style="width: 100%"
          stripe>
          <el-table-column
            v-for="(item, index) in fieldList"
            :key="index"
            :prop="item.field"
            :label="item.label"
            :width="item.width || null"
            :formatter="fieldFormatter"
            show-overflow-tooltip/>
          <el-table-column
            fixed="right"
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleAction('edit', scope)">编 辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleAction('delete', scope)">删 除</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleAction('status', scope)">
                {{ scope.row['status'] === 0 ? '启用' : '停用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="p-contianer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size.sync="pageSize"
            :total="total"
            class="p-bar"
            background
            layout="prev, pager, next, sizes, total, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </flexbox-item>
    </flexbox>

    <el-dialog
      :title="dialogTitle + '渠道类型'"
      :visible="dialogVisible"
      :before-close="handleCancel"
      width="500px">
      <el-form label-position="top">
        <el-form-item label="渠道类型名称">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="包含渠道">
          <el-select v-model="dialogForm.value" placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否过滤">
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.type == 1"
          label="过滤人员">
          <xh-user-cell
            :value="selectUsers"
            class="handle-item-content"
            @value-change="handleChangeUser"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          v-debounce="handleConfirm"
          type="primary">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XhUserCell from '@/components/CreateCom/XhUserCell'

export default {
  name: 'ChannelTypeSet',
  components: {
    XhUserCell
  },
  data() {
    return {
      loading: false, // 展示加载中效果

      tableHeight: document.documentElement.clientHeight - 330, // 表的高度,

      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,

      tableData: [],
      fieldList: [
        { field: 'field', label: '渠道类型名称' },
        { field: 'field', label: '包含渠道' },
        { field: 'field', label: '是否过滤' },
        { field: 'field', label: '过滤人员' },
        { field: 'field', label: '创建人' },
        { field: 'field', label: '状态' }
      ],

      channelOptions: [],
      dialogVisible: false,
      dialogForm: {},
      dialogTitle: '添加',
      selectUsers: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getDataList() {
      this.tableData = [
        { field: '1' }
      ]
    },

    /**
     * table格式化
     * @param row
     * @param column
     * @return {string|string|*}
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property == 'deptName') {
        // 格式部门
        const structures = row.deptIds || []
        const strName = structures
          .map(item => {
            return item.name
          })
          .join('、')
        return strName || '全公司'
      } else if (column.property === 'status') {
        if (row[column.property] == 1) {
          return '启用'
        }
        return '停用'
      }
      return row[column.property]
    },

    /**
     * 翻页
     * @param size
     */
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getDataList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getDataList()
    },

    handleAction(action, scope) {
      console.log(action, scope)
      switch (action) {
        case 'add':
          this.dialogForm = {}
          this.dialogVisible = true
          break
        case 'edit':
          this.dialogForm = {}
          this.dialogVisible = true
          break
        case 'delete':
          this.handleDelete(scope.row.id)
          break
        case 'status':
          this.handleUpdateStatus(scope.row)
          break
      }
    },

    /**
     * 删除
     * @param id
     */
    handleDelete(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // businessGroupDelete({
        //   id: scope.row.typeId
        // }).then(res => {
        //   this.getDataList()
        //   this.$message.success('删除成功')
        // }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    /**
     * 启用/停用
     * @param row
     */
    handleUpdateStatus(row) {
      const str = `您确定要${row.status === 0 ? '启用' : '停用'}该渠道类型吗？`
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // businessGroupDelete({
        //   id: row.typeId
        // }).then(res => {
        //   this.getDataList()
        //   this.$message.success('操作成功')
        // }).catch(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    /**
     * 选择员工
     * @param data
     */
    handleChangeUser(data) {},

    /**
     * 确定
     */
    handleConfirm() {
      this.dialogVisible = false
    },

    /**
     * 取消
     */
    handleCancel() {
      this.dialogVisible = false
    },

    /**
     * 保存
     */
    handleSave() {}
  }
}
</script>

<style lang="scss" scoped>
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
  .tips {
    width: 100%;
    font-size: 13px;
    color: #999;
    margin-bottom: 10px;
  }

  .table-container {
    width: 100%;
    border: 1px solid #EBEEF5;
    margin: 0 !important;
  }
}

/deep/ .el-dialog__body {
  padding: 20px;
}
.el-form-item {
  margin-bottom: 10px;
  /deep/ .el-form-item__label {
    padding: 0;
    line-height: 1.2;
  }
  .el-select {
    width: 100%;
  }
}
</style>
