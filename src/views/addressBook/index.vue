<template>
  <div class="address-book-index">
    <div class="header">
      <flexbox class="title">
        <img src="~@/assets/img/addressBook/address_logo.png" alt="" class="pic">
        <span class="text">通讯录</span>
      </flexbox>
      <el-input placeholder="请输入员工姓名/手机号" />
    </div>
    <div class="container container-hook">
      <flexbox class="filter-box">
        <flexbox class="form-item">
          <span class="label">选择部门：</span>
          <el-input class="form-core" />
        </flexbox>
      </flexbox>
      <el-table
        :data="listData"
        :height="tableHeight"
        stripe
        border
        highlight-current-row
        class="n-table--border">
        <el-table-column
          sortable="date"
          label="排序"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.startEn || '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="关注"
          width="120" />
        <el-table-column
          v-for="(item, index) in tableMap"
          :key="index"
          :prop="item.key"
          :label="item.label" />
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
  </div>
</template>

<script>
import {
  addresslist,
  queryListNameByDept
} from '@/api/oamanagement/addressBook'

export default {
  name: 'AddressBookIndex',
  data() {
    return {
      search: '',
      listData: [],
      tableMap: [
        { label: '名称', key: 'realname' },
        { label: '手机', key: 'mobile' },
        { label: '部门', key: 'deptName' },
        { label: '岗位', key: 'postName' }
      ],
      tableHeight: 0,

      currentPage: 1,
      pageSizes: [15, 30, 60],
      pageSize: 10,
      total: 100
    }
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      this.tableHeight = document.getElementsByClassName('container-hook')[0].clientHeight - 94
    })
  },
  methods: {
    getList() {
      addresslist().then(res => {
        let list = []
        const keys = Object.keys(res.data)
        keys.forEach(key => {
          list.push({
            realname: '',
            mobile: '',
            deptName: '',
            postName: '',
            startEn: key
          })
          list = list.concat(res.data[key])
        })
        this.listData = list
      }).catch()
    },

    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>

<style scoped lang="scss">
  @import "../customermanagement/styles/table";

  .el-table /deep/ tbody tr td:nth-child(1) {
    border-right-width: 0;
  }

  .el-table /deep/ tbody tr td:nth-child(2) {
    border-right: 1px solid #e6e6e6;
  }

  .address-book-index {
    width: 100%;
    height: 100%;
    .header {
      position: relative;
      width: 100%;
      height: 60px;
      padding: 0 28px;
      display: flex;
      .title {
        width: unset;
        margin: 15px 0;
        .pic {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
        .text {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .el-input {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
      }
    }

    .container {
      width: 100%;
      height: calc(100% - 80px);
      background-color: white;
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      .filter-box {
        width: 100%;
        height: 50px;
        font-size: 13px;
        border-bottom: 1px solid #e6e6e6;
        padding: 0 20px;
        .form-core {
          width: 180px;
        }
      }
      .el-table {
        width: 100%;
      }
    }
  }
</style>
