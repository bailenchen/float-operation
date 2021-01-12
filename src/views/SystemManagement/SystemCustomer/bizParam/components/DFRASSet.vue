<template>
  <div v-loading="loading">
    <div class="content-title">
      <div class="title">人脸考勤设备清单</div>
      <div class="subhead">设备信息查询</div>
      <div class="query-form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="校区ID：">
            <el-input v-model="formInline.deptId" placeholder=""/>
          </el-form-item>
          <el-form-item label="校区名称：">
            <el-input v-model="formInline.name" placeholder=""/>
          </el-form-item>
          <el-form-item label="设备编号：">
            <el-input v-model="formInline.equipmentNumber" placeholder=""/>
          </el-form-item>
          <el-form-item label="在线状态：">
            <el-select v-model="formInline.equipmentStatus" placeholder="">
              <el-option label="在线" value="0"/>
              <el-option label="离线" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">一键同步</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showHandleView = true">新增设备</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <flexbox
      direction="column"
      class="content-body">
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
                @click="delData(scope.row.equipmentId)">删除</el-button>
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

    <create-facial-equipment
      v-if="showHandleView"
      :handle="rowInfo"
      @hiden-view="showHandleView=false" />
  </div>
</template>

<script>
import { sysConfigFacialEquipmentQueryAPI, sysConfigFacialEquipmentDelAPI } from '@/api/systemManagement/SystemCustomer'
import CreateFacialEquipment from '../../components/createFacialEquipment'


export default {
  name: 'DFRASSet',
  components: {
    CreateFacialEquipment
  },
  data() {
    return {
      loading: false, // 展示加载中效果
      tableHeight: document.documentElement.clientHeight - 400, // 表的高度,

      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,

      tableData: [],
      fieldList: [
        { field: 'deptId', label: '校区ID' },
        { field: 'name', label: '校区名称' },
        { field: 'corporateName', label: '公司名称' },
        { field: 'equipmentNumber', label: '设备编号' },
        { field: 'equipmentStatus', label: '在线状态' },
        { field: 'createUserName', label: '创建人' },
        { field: 'createTime', label: '创建时间', width: '150px' },
        { field: 'updateUserName', label: '修改人' },
        { field: 'updateTime', label: '修改时间', width: '150px' }
      ],

      formInline: {},
      showHandleView: false,
      rowInfo: null
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getDataList(val) {
      this.loading = true
      let params = {}
      if (val) {
        params = {
          ...this.formInline,
          limit: this.pageSize,
          page: this.currentPage
        }
      } else {
        params = {
          limit: this.pageSize,
          page: this.currentPage
        }
      }
      sysConfigFacialEquipmentQueryAPI(params).then(res => {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalRow
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
      if (column.property === 'equipmentStatus') {
        return {
          0: '离线',
          1: '在线'
        }[row[column.property]]
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

    // 查询
    queryList() {
      this.getDataList('search')
    },

    delData(id) {
      sysConfigFacialEquipmentDelAPI({ id }).then(res => {
        console.log('res', res)
        this.$message.success('删除成功')
        this.getDataList()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  .title, .subhead {
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
  }
  .title {
  font-weight: 700;
    font-size: 16px;
  }
  .query-form {
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
  margin-top: 5px;
  margin-bottom: 5px;
  /deep/ .el-form-item__label {
    padding: 0;
    margin-right: 10px;
  }
  .el-select, .el-cascader {
    width: 100%;
  }
}
</style>
