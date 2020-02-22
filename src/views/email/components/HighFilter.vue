<template>
  <div class="filter">
    <div class="filter-nav">
      <span v-for="(item, index) in filterNavList" :class="{'active-line': activeIndex == index }" :key="index" class="filter-item" @click="clickNav(item, index)">
        {{ item.name }}
      </span>
    </div>
    <div class="search">
      <el-input
        v-model="search"
        class="search-input"
        placeholder="搜索"
        prefix-icon="el-icon-search"/>
        <!-- <el-button type="primary" class="filter-btn" @click="filter">高级筛选</el-button> -->
    </div>

    <div class="filter-list">
      <div class="all">
        <el-checkbox :indeterminate="isIndeterminate" v-model="allCheck"/>
        <span class="all-txt">全部</span>
      </div>
      <div v-for="(item, index) in filterList" :key="index" class="all">
        <el-checkbox v-model="item.checked"/>
        <span class="all-txt">{{ item.customerName }}&lt;{{ item.email }}&gt;</span>
      </div>
    </div>

    <filter-form
      v-if="showFilterView"
      :field-list="fieldList"
      :dialog-visible.sync="showFilter"
      :obj="filterObj"
      :crm-type="crmType"
      :is-seas="isSeas"
      class="filter-dialog"
      @filter="handleFilter" />
  </div>
</template>

<script>
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import { crmContactsIndex } from '@/api/customermanagement/contacts'
import { crmCustomerIndex } from '@/api/customermanagement/customer'
import {
  filterIndexfields,
  // filterIndexPoolfields,
  crmSceneSave
} from '@/api/customermanagement/common'

import filterForm from '../../customermanagement/components/filterForm'
import filterContent from '../../customermanagement/components/filterForm/filterContent'

export default {
  name: 'HighFilter',
  components: {
    filterForm,
    filterContent
  },
  data() {
    return {
      filterNavList: [
        { name: '最近', crmType: '' },
        { name: '客户', crmType: 'customer' },
        { name: '联系人', crmType: 'contacts' },
        { name: '同事', crmType: 'book' }
      ],
      activeIndex: 0,
      // 高级筛选
      search: '',
      showFilterView: false,
      fieldList: [],
      showFilter: false, // 控制筛选框
      filterObj: { form: [] }, // 筛选确定数据
      isSeas: false,
      crmType: 'customer',
      // 勾选
      allCheck: false,
      isIndeterminate: true,
      filterList: [] // 过滤后的列表
    }
  },
  methods: {
    /**
     * 获取筛选后的列表
     */
    getFilterList() {
      var crmIndexRequest = {
        customer: crmCustomerIndex,
        contacts: crmContactsIndex
      }[this.crmType]
      var params = {
        page: 1,
        limit: 15,
        // page: this.currentPage,
        // limit: this.pageSize,
        search: this.search,
        type: crmTypeModel[this.crmType] // 9是公海
      }
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj.obj
      }
      crmIndexRequest(params)
        .then(res => {
          // if (this.crmType === 'customer') {
          this.list = res.data.list.map(element => {
            element.checked = false // 控制列表商机展示
            return element
          })
          this.filterList = res.data.list
          console.log(this.filterList, '456789')
          // if (res.data.totalRow && Math.ceil(res.data.totalRow / this.pageSize) < this.currentPage && this.currentPage > 1) {
          //   this.currentPage = this.currentPage - 1
          //   this.getFilterList()
          // } else {
          //   this.total = res.data.totalRow
          // }
        })
        .catch(() => {
        })
    },

    /**
     * 点击导航
     */
    clickNav(item, index) {
      this.activeIndex = index
      this.crmType = item.crmType
    },

    /**
     * 筛选按钮
     */
    filter() {
      this.showFilterView = true
      this.showFilter = true
      this.getFilterFieldInfo()
      console.log('ooo')
    },

    /**
     * 获取高级筛选字段数据
     */
    getFilterFieldInfo() {
      const params = {}
      params.label = crmTypeModel[this.crmType]

      const request = filterIndexfields

      request(params)
        .then(res => {
          this.fieldList = res.data
          this.showFilter = true
        })
        .catch(() => {})
    },

    handleFilter(form) {
      console.log(form, 'form...')
      this.filterObj = form
      this.showFilter = false
      if (form.saveChecked) {
        crmSceneSave({
          type: crmTypeModel[this.crmType],
          isDefault: form.saveDefault ? 1 : 0,
          name: form.saveName,
          data: JSON.stringify(form.obj)
        })
          .then(res => {
            console.log(res, 'changjing')
            // this.updateSceneList()
          })
          .catch(() => {})
      }
      this.getFilterList()
      // this.$emit('on-filter', form.obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-nav {
  width: 100%;
  margin-top: 25px;
  padding-left: 10px;
  border-bottom: 1px solid #F0F0F0;
  color: #333;
  font-size: 12px;
  .filter-item {
    display: inline-block;
    text-align: center;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
}

.active-line {
  border-bottom: 2px solid #2362FB;
}

.search {
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  .search-input {
    height: 30px;
    font-size: 12px;
  }
  .filter-btn {
    font-size: 12px;
    margin-left: 12px;
    height: 30px;
  }
}

.search /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
}

// 列表
.filter-list {
  width: 100%;
  padding: 5px 12px 12px 12px;
  .all {
    color: #333333;
    font-size: 12px;
    padding-bottom: 12px;
  }
}

</style>

