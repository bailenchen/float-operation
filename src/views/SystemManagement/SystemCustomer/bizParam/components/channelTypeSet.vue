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
                @click="handleAction('edit', scope.row)">编 辑</el-button>
              <!--<el-button
                type="text"
                size="small"
                @click="handleAction('delete', scope.row)">删 除</el-button>-->
              <el-button
                type="text"
                size="small"
                @click="handleAction('status', scope.row)">
                {{ scope.row['status'] === 1 ? '停用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="p-contianer">
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
        </div>-->
      </flexbox-item>
    </flexbox>

    <el-dialog
      :title="dialogTitle + '渠道类型'"
      :visible="dialogVisible"
      :before-close="handleCancel"
      width="500px">
      <el-form label-position="top">
        <el-form-item label="渠道类型名称">
          <el-input v-model="dialogForm.typeName" />
        </el-form-item>
        <el-form-item label="包含渠道">
          <el-cascader
            v-model="dialogForm.channelId"
            :props="channelProps"
            :collapse-tags="true"
            :options="channelOptions"
            placeholder="请选择"
            @change="handleChangeChannel" />
        </el-form-item>
        <el-form-item label="是否过滤">
          <el-select v-model="dialogForm.isFilter" placeholder="请选择">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="dialogForm.isFilter === 1"
          label="过滤人员">
          <xh-user-cell
            :value="dialogForm.filteringPersonnel"
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
import {
  QueryChannelType,
  AddChannelType,
  DeleteChannelType,
  QueryChannelCategory
} from '@/api/systemManagement/params'

import XhUserCell from '@/components/CreateCom/XhUserCell'
import { isEmpty } from 'element-ui/lib/utils/util'

export default {
  name: 'ChannelTypeSet',
  components: {
    XhUserCell
  },
  data() {
    return {
      loading: false, // 展示加载中效果

      // tableHeight: document.documentElement.clientHeight - 330, // 表的高度,
      tableHeight: document.documentElement.clientHeight - 280, // 表的高度,

      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,

      tableData: [],
      fieldList: [
        { field: 'typeName', label: '渠道类型名称' },
        { field: 'name', label: '包含渠道' },
        { field: 'isFilter', label: '是否过滤' },
        { field: 'filteringPersonnel', label: '过滤人员' },
        { field: 'createName', label: '创建人' },
        { field: 'status', label: '状态' }
      ],

      channelOptions: [],
      dialogVisible: false,
      dialogForm: {},
      dialogTitle: '添加',
      selectUsers: [],

      channelProps: {
        multiple: true,
        // checkStrictly: true,
        value: 'id',
        label: 'name'
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val && this.channelOptions.length === 0) {
        this.getChannelOptions()
      }
    }
  },
  created() {
    this.getDataList()
    this.getChannelOptions()
  },
  methods: {
    getChannelOptions() {
      QueryChannelCategory().then(res => {
        console.log('options res: ', res.data)
        this.channelOptions = res.data
        console.log('options: ', this.channelOptions)
      }).catch(() => {})
    },
    formatOptions(list) {
      const that = this
      list.forEach(o => {
        if (o.hasOwnProperty('children') && isEmpty(o.children)) {
          delete o.children
        } else {
          that.formatOptions(o.children)
        }
      })
    },
    /**
     * 获取列表数据
     */
    getDataList() {
      this.loading = true
      QueryChannelType().then(res => {
        this.loading = false
        this.tableData = res.data
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * table格式化
     * @param row
     * @param column
     * @return {string|string|*}
     */
    fieldFormatter(row, column) {
      if (column.property === 'isFilter') {
        if (row[column.property] === 1) {
          return '是'
        }
        return '否'
      } else if (column.property === 'status') {
        if (row[column.property] === 1) {
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

    getCheckedArr(ids) {
      const res = []
      if (ids.length === 0) return res
      function getCode(list, arr = []) {
        list.forEach(item => {
          if (ids.includes(item.id)) {
            res.push([...arr, item.id])
          } else if (item.hasOwnProperty('children') && item.children.length > 0) {
            const arr0 = getCode(item.children, [...arr, item.id])
            if (arr0.length === arr.length) {
              res.push(arr0)
            }
          }
        })
        return arr
      }
      getCode(this.channelOptions)
      return res
    },

    handleAction(action, row) {
      console.log(action, row)
      switch (action) {
        case 'add':
          this.dialogForm = {
            typeName: '',
            filteringPersonnel: [],
            isFilter: 0,
            status: 1,
            channelId: []
          }
          this.dialogVisible = true
          break
        case 'edit':
          this.dialogForm = {
            id: row.id,
            typeName: row.typeName,
            isFilter: row.isFilter,
            status: row.status,
            channelId: row.channelId ? this.getCheckedArr(row.channelId.split(',').map(o => Number(o))) : ''
          }
          if (row.userId) {
            this.dialogForm.filteringPersonnel = [{
              userId: row.userId,
              realname: row.filteringPersonnel
            }]
          }
          console.log('edit:', this.dialogForm)
          this.dialogVisible = true
          break
        case 'delete':
          this.handleDelete(row.id)
          break
        case 'status':
          this.handleUpdateStatus(row)
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
        DeleteChannelType({
          id: id
        }).then(res => {
          this.getDataList()
          this.$message.success('删除成功')
        }).catch(() => {})
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
      const str = `您确定要${row.status === 1 ? '停用' : '启用'}该渠道类型吗？`
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AddChannelType({
          id: row.id,
          status: row.status === 1 ? 0 : 1
        }).then(res => {
          this.getDataList()
          this.$message.success('操作成功')
        }).catch(() => {})
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
    handleChangeUser(data) {
      this.dialogForm.filteringPersonnel = data.value
    },

    handleChangeChannel(data) {
      console.log(arguments)
    },
    /**
     * 确定
     */
    handleConfirm() {
      if (isEmpty(this.dialogForm.typeName)) {
        this.$message.error('渠道类型名称不能为空')
        return
      }
      // if (isEmpty(this.dialogForm.channelId)) {
      //   this.$message.error('包含渠道不能为空')
      //   return
      // }
      if (this.dialogForm.isFilter === 1 &&
        isEmpty(this.dialogForm.filteringPersonnel)) {
        this.$message.error('请选择过滤人员')
        return
      }
      this.dialogVisible = false
      this.loading = true
      const userId = this.dialogForm.isFilter === 1 ? this.dialogForm.filteringPersonnel[0].userId : ''
      const params = {
        ...this.dialogForm,
        filteringPersonnel: userId,
        channelId: this.dialogForm.channelId.map(o => o[o.length - 1]).join(',') || ''
      }
      AddChannelType(params).then(() => {
        this.loading = false
        this.$message.success('操作成功')
        this.getDataList()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 取消
     */
    handleCancel() {
      this.dialogVisible = false
    }
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
  // height: calc(100% - 57px);
  height: 100%;
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
  .el-select, .el-cascader {
    width: 100%;
  }
}
</style>
