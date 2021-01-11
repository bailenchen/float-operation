<template>
  <div>
    <div class="content-title">
      <span>机构认证</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="addRule">创建E签宝组织账号</el-button>
    </div>
    <div class="customer-table">
      <el-table
        v-loading="loading"
        :data="list"
        :height="tableHeight"
        :header-cell-style="headerCellStyle"
        style="width: 100%"
        stripe>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.field"
          :label="item.label"
          :formatter="fieldFormatter"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="!!scope.row.isAuthentication"
              type="text"
              size="small"
              @click="handleAuth(scope.row)">{{ scope.row.isAuthentication ? '已认证' : '去认证' }}</el-button>
            <el-button
              :disabled="!!scope.row.deptName"
              type="text"
              size="small"
              @click="handleRelativeDet(scope.row)">{{ scope.row.deptName ? '已关联校区' : '去关联校区' }}</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row)">删除</el-button>
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
    </div>

    <el-dialog
      :visible.sync="showAddEdit"
      title="创建E签宝组织账号"
      width="30%">
      <el-form ref="ruleForm" :label-position="labelPosition" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="关联认证用户" prop="authenticationId">
          <el-select v-model="form.authenticationId" style="width:100%" placeholder="请选择" @change="selectedData">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="mechanismName">
          <el-input v-model="form.mechanismName"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="showRelative"
      title="关联校区"
      width="380px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="请选择关联的校区">
          <xh-structure-cell
            :value="deptSelectValue"
            radio
            style="width: 185px;display: inline-block;"
            class="xh-structure-cell"
            @value-change="structureChange" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRelative = false">取 消</el-button>
        <el-button type="primary" @click="confirmRelative">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  sysConfigDataRelativePersonAccountAPI,
  sysConfigDataPersonOrgQueryAPI,
  sysConfigDataPersonOrgDeleteAPI,
  sysConfigDataPersonOrgAuthAPI,
  sysConfigDataPersonOrgSaveAPI,
  sysConfigDataRelativeDeptAPI // 关联校区
} from '@/api/systemManagement/SystemCustomer'

import { XhStructureCell } from '@/components/CreateCom'

export default {
  name: 'OrganizationSet',
  components: {
    XhStructureCell
  },
  data() {
    return {
      loading: false, // 展示加载中效果
      tableHeight: document.documentElement.clientHeight - 320, // 表的高度
      // 设置
      list: [],
      form: {
        authenticationId: null,
        mechanismName: '',
        accountId: ''
      },
      // 添加 编辑
      labelPosition: 'right',
      showAddEdit: false,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,

      showRelative: false,
      formInline: {},
      deptSelectValue: [],

      options: [],
      rules: {
        authenticationId: [
          { required: true, message: '请选择关联认证用户', trigger: 'change' }
        ],
        mechanismName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    fieldList() {
      const temps = [
        { label: '机构名称', field: 'mechanismName' },
        { label: '关联的个人账户', field: 'userName' },
        { label: '机构是否认证', field: 'isAuthentication' },
        { label: '关联校区', field: 'deptName' }
      ]
      return temps
    }
  },
  created() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 320
    }
    this.getList()
  },

  methods: {
    /**
     * 列表头样式
     */
    headerCellStyle(val, index) {
      return { background: '#F2F2F2' }
    },

    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    /**
     * 更改当前页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    structureChange(data) {
      this.formInline.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
    },

    // 确定关联校区
    confirmRelative() {
      if (!this.formInline.deptId) {
        return this.$message.error('请选择将要关联的校区')
      }
      sysConfigDataRelativeDeptAPI(this.formInline).then(res => {
        this.$message.success('关联校区成功')
        this.showRelative = false
        this.getList()
      }).catch()
      this.showRelative = false
    },

    /**
     * 列表
     */
    getList() {
      this.loading = true
      sysConfigDataPersonOrgQueryAPI({
        page: this.currentPage,
        limit: this.pageSize,
        name: ''
      })
        .then(res => {
          this.loading = false
          this.list = res.data.list
          this.total = res.data.totalRow
        })
        .catch(() => {
          this.loading = false
        })
    },

    selectedData(data) {
      this.options.forEach(item => {
        if (data === item.authenticationId) {
          this.form.accountId = item.accountId
        }
      })
    },

    /**
     * 列表格式化
     */
    fieldFormatter(row, column) {
      if (column.property === 'isAuthentication') {
        return {
          0: '否',
          1: '是'
        }[row.isAuthentication]
      }
      return row[column.property]
    },

    /**
     * 添加
     */
    addRule() {
      this.relativePersonList()
      this.showAddEdit = true
    },

    // 关联认证用户
    relativePersonList() {
      sysConfigDataRelativePersonAccountAPI().then(res => {
        this.options = res.data.map(item => {
          item.label = item.userName
          item.value = item.authenticationId
          return item
        })
      }).catch()
    },

    handleRelativeDet(row) {
      this.formInline.mechanismId = row.mechanismId
      this.showRelative = true
    },

    // 认证
    handleAuth(row) {
      this.$confirm('确定去认证?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysConfigDataPersonOrgAuthAPI({ orgId: row.orgId, accountId: row.accountId }).then(res => {
          const url = res.data.url
          if (url) {
            window.open(url)
          } else {
            this.$message.error('认证操作失败')
          }
        }).catch()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          sysConfigDataPersonOrgDeleteAPI({
            orgId: row.orgId
          })
            .then(res => {
              this.getList()
              this.$message.success('删除成功')
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
    },

    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          sysConfigDataPersonOrgSaveAPI(this.form).then(res => {
            this.showAddEdit = false
            this.getList()
            this.$message.success('保存成功')
          }).catch(() => {

          })
        }
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

/* 设置 */

.customer-table {
  border: 1px solid #e6e6e6;
  margin: 30px;
  flex: 1;
  overflow: auto;
  box-sizing: border-box;
}

.p-contianer {
  position: relative;
  background-color: white;
  height: 44px;
  .p-bar {
    float: right;
    margin: 5px 100px 0 0;
    font-size: 14px !important;
  }
}
</style>
