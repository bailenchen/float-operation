<template>
  <div class="address-book-index">
    <div class="header">
      <flexbox class="title">
        <img src="~@/assets/img/addressBook/address_logo.png" alt="" class="pic">
        <span class="text">通讯录</span>
      </flexbox>
      <el-input
        v-model="search"
        placeholder="请输入员工姓名/手机号">
        <el-button
          slot="append"
          type="primary">
          搜索
        </el-button>
      </el-input>
    </div>
    <div class="container container-hook">
      <flexbox class="filter-box">
        <flexbox class="form-item">
          <span class="label">选择部门：</span>
          <el-input class="form-core" />
        </flexbox>
      </flexbox>
      <el-table
        v-loading="loading"
        :data="listData"
        :height="tableHeight"
        :row-class-name="getRowClass"
        stripe
        border
        class="n-table--border"
        @sort-change="sortTableList">
        <el-table-column
          sortable="custom"
          label="排序"
          align="center"
          prop="startEn"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.startEn || '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="关注"
          align="center"
          width="120">
          <template slot-scope="scope">
            <span
              v-if="!specialRowArr.includes(scope.$index)"
              :class="{active: scope.row.focus}"
              class="wk wk-focus-on focus-icon"
              @click="toggleStar(scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="realname"
          label="姓名">
          <template slot-scope="scope">
            <flexbox
              v-if="!specialRowArr.includes(scope.$index)"
              class="user-box">
              <div
                v-photo="scope.row"
                v-lazy:background-image="$options.filters.filterUserLazyImg(scope.row.img || '')"
                :key="scope.row.img || ''"
                class="user-img div-photo" />
              <span>{{ scope.row.realname }}</span>
            </flexbox>
          </template>
        </el-table-column>
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
          :pager-count="5"
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
        { label: '手机', key: 'mobile' },
        { label: '部门', key: 'deptName' },
        { label: '岗位', key: 'postName' }
      ],
      tableHeight: 0,
      specialRowArr: [],

      currentPage: 1,
      pageSizes: [15, 30, 60],
      pageSize: 10,
      total: 100,
      loading: false,

      params: {
        page: 1,
        limit: 15
      }
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
      this.loading = true
      addresslist().then(res => {
        this.loading = false
        let list = []
        this.specialRowArr = []
        const keys = Object.keys(res.data)
        keys.forEach(key => {
          this.specialRowArr.push(list.length)
          list.push({
            realname: '',
            mobile: '',
            deptName: '',
            postName: '',
            startEn: key
          })
          res.data[key][0].focus = true
          list = list.concat(res.data[key])
        })
        this.listData = list
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 动态生成 table 行 className
     * @param rowObj
     * @return {string}
     */
    getRowClass(rowObj) {
      if (this.specialRowArr.includes(rowObj.rowIndex)) {
        return 'special-row'
      } else {
        return ''
      }
    },
    /**
     * 排序
     */
    sortTableList(sortObj) {
      if (sortObj.order === 'ascending') {
        // 升序
      } else if (sortObj.order === 'descending') {
        // 降序
      }
    },
    /**
     * 切换关注状态
     * @param index
     */
    toggleStar(index) {
      console.log(index)
      this.listData[index].focus = !this.listData[index].focus
      this.$set(this.listData, index, this.listData[index])
    },

    handleSizeChange(size) {
      this.params.limit = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
