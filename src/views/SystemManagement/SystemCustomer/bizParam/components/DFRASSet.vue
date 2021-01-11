<template>
  <div v-loading="loading">
    <div class="content-title">
      <div class="title">人脸考勤设备清单</div>
      <div class="query-form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="分类标志：">
            <el-input v-model="formInline.dictionaryField" placeholder=""/>
          </el-form-item>
          <el-form-item label="值：">
            <el-input v-model="formInline.dictionaryName" placeholder=""/>
          </el-form-item>
          <el-form-item label="父ID：">
            <el-input v-model="formInline.pId" placeholder=""/>
          </el-form-item>
          <el-form-item label="是否展示：">
            <el-select v-model="formInline.isHidden" placeholder="">
              <el-option label="是" value="0"/>
              <el-option label="否" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addData('add', '')">新增</el-button>
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
                @click="addData('edit', scope.row)">编 辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="addData('child', scope.row)">新增子字典</el-button>
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

    <create-dictionary
      v-if="showHandleView"
      :handle="rowInfo"
      @save="getDataList"
      @hiden-view="showHandleView=false" />
  </div>
</template>

<script>
import {
  sysConfigDataDictaryListQueryAPI
} from '@/api/systemManagement/SystemCustomer'
import CreateDictionary from '../../components/createDictionary'

export default {
  name: 'DataDictionarySet',
  components: {
    CreateDictionary
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
        { field: 'dictionaryId', label: 'id' },
        { field: 'dictionaryField', label: '分类标志' },
        { field: 'dictionaryName', label: '值' },
        { field: 'standby', label: '备用' },
        { field: 'pId', label: '父id' },
        { field: 'status', label: '状态' },
        { field: 'isHidden', label: '是否显示' },
        { field: 'colour', label: '颜色' },
        { field: 'sort', label: '排序' }
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
      sysConfigDataDictaryListQueryAPI(params).then(res => {
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
      if (column.property === 'isHidden') {
        return {
          0: '是',
          1: '否'
        }[row[column.property]]
      } else if (column.property === 'status') {
        return {
          0: '无效',
          1: '有效'
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

    addData(way, row) {
      this.rowInfo = {
        action: way,
        data: row
      }
      this.showHandleView = true
    }
  }
}
</script>

<style lang="scss" scoped>
.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  .title {
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
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
