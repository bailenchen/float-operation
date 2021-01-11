<template>
  <div>
    <div class="content-title">
      <span>个人账户认证</span>
      <el-button
        type="primary"
        class="rt"
        size="medium"
        @click="addRule">创建E签宝个人账号</el-button>
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
      title="创建E签宝个人账号"
      width="30%">
      <el-form ref="ruleForm" :label-position="labelPosition" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="员工编号" prop="jobNumber">
          <el-input v-model="form.jobNumber"/>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="form.type"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  sysConfigDataPersonAccountSaveAPI,
  sysConfigDataPersonAccountQueryAPI,
  sysConfigDataPersonAccountDeleteAPI,
  sysConfigDataPersonAccountAuthAPI
} from '@/api/systemManagement/SystemCustomer'

import { chinaMobileRegex, checkCode, checkDate, checkProv } from '@/utils'

export default {
  name: 'PersonAccountSet',
  data() {
    return {
      loading: false, // 展示加载中效果
      tableHeight: document.documentElement.clientHeight - 320, // 表的高度
      // 设置
      list: [],
      // 添加 编辑
      labelPosition: 'right',
      showAddEdit: false,
      form: {},
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,

      rules: {
        jobNumber: [
          { required: true, message: '请输入员工编号', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    fieldList() {
      const temps = [
        { label: '姓名', field: 'userName' },
        { label: '账户是否认证', field: 'isAuthentication' }
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

    /**
     * 列表
     */
    getList() {
      this.loading = true
      sysConfigDataPersonAccountQueryAPI({
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
      this.showAddEdit = true
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
          sysConfigDataPersonAccountDeleteAPI({
            accountId: row.accountId
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
    handleAuth(row) {
      this.$confirm('确定去认证?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sysConfigDataPersonAccountAuthAPI(row).then(res => {
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
    // 身份证校验
    checkID(val) {
      if (checkCode(val)) {
        var date = val.substring(6, 14)
        if (checkDate(date)) {
          if (checkProv(val.substring(0, 2))) {
            return true
          }
        }
      }
      return false
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.mobile) {
            if (!chinaMobileRegex.test(this.form.mobile)) {
              return this.$message.error('手机格式有误')
            }
          }
          if (this.form.idNumber) {
            if (!this.checkID(this.form.idNumber)) {
              return this.$message.error('身份证号格式有误')
            }
          }

          sysConfigDataPersonAccountSaveAPI(this.form).then(res => {
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
