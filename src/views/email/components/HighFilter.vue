<template>
  <div v-loading="loading" class="filter">
    <div class="filter_box">
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
        <el-button type="primary" class="filter-btn" @click="filter">搜索</el-button>
      </div>

      <div class="filter-list">
        <div v-if="crmType === 'customer'">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.customerId"
            class="item_email"
            style="font-size: 13px;"
            @click="listFifter(item)"
          >
            <span class="all">
              {{ item.customerName }}&lt;{{ item.email }}&gt;
            </span>
          </div>
        </div>

        <div v-else-if="crmType === 'contact'">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.contactId"
            class="item_email"
            style="font-size: 13px;"
            @click="listFifter(item)">
            <span class="all">
              {{ item.customerName }}&lt;{{ item.email }}&gt;
            </span>
          </div>
        </div>

        <div v-else>
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.value"
            class="item_email"
            style="font-size: 13px;"
            @click="listFifter(item)"
          >
            <span class="all">
              {{ item.customerName }}&lt;{{ item.email }}&gt;
            </span>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :total="total"
          prev-text="上一页"
          next-text="下一页"
          layout="total,prev, next"
          @current-change="currentChange"/>
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
import { emailAccountQueryLatelyAPI } from '@/api/email/email'
export default {
  name: 'HighFilter',
  components: {
    filterForm,
    filterContent
  },
  data() {
    return {
      loading: false,
      filterNavList: [
        { name: '最近', crmType: '' },
        { name: '客户', crmType: 'customer' },
        { name: '联系人', crmType: 'contacts' }
      ],
      activeIndex: 0,
      // 高级筛选
      search: '',
      showFilterView: false,
      fieldList: [],
      showFilter: false, // 控制筛选框
      filterObj: { form: [] }, // 筛选确定数据
      isSeas: false,
      crmType: '',
      page: 1,
      total: 0,
      // 勾选
      allCheck: false,
      customerCheckList: [], // 客户
      customerList: [],
      contactCheckList: [], // 联系人
      contactList: [],
      shortCheckList: [], // 最近
      shortList: [],
      checkAllCustomer: [], // 所有客户
      checkAllContact: [], // 所有联系人
      checkAllValue: [], // 所有的最近的人
      filterList: [] // 过滤后的列表
    }
  },
  mounted() {
    this.getFilterList()
  },
  methods: {
    /**
     * 获取筛选后的列表
     */
    getFilterList() {
      this.loading = true
      var crmIndexRequest
      if (!this.crmType) {
        crmIndexRequest = emailAccountQueryLatelyAPI
      } else {
        crmIndexRequest = {
          customer: crmCustomerIndex,
          contacts: crmContactsIndex
        }[this.crmType]
      }
      var params = {
        page: this.page,
        limit: 100,
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
          this.handleFoucs(res.data.list)
          this.filterList = res.data.list
          this.filterList.forEach(item => {
            item.customerName = item.name || item.contactName || item.customerName
            item.email = item.value || item.email
          })
          this.total = res.data.totalRow
          this.loading = false
          // if (res.data.totalRow && Math.ceil(res.data.totalRow / this.pageSize) < this.currentPage && this.currentPage > 1) {
          //   this.currentPage = this.currentPage - 1
          //   this.getFilterList()
          // } else {
          //   this.total = res.data.totalRow
          // }
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 点击导航
     */
    clickNav(item, index) {
      this.page = 1
      this.activeIndex = index
      this.crmType = item.crmType
      this.getFilterList()
    },

    /**
     * 筛选按钮
     */
    filter() {
      // this.showFilterView = true
      // this.showFilter = true
      this.getFilterList()
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
            // this.updateSceneList()
          })
          .catch(() => {})
      }
      this.getFilterList()
      // this.$emit('on-filter', form.obj)
    },

    /**
     * 点击全选
     */
    handleAll(val) {
      if (this.crmType === 'customer') {
        this.customerCheckList = val ? this.checkAllCustomer : []
      } else if (this.crmType === 'contact') {
        this.contactCheckList = val ? this.checkAllContact : []
      } else {
        this.shortCheckList = val ? this.checkAllValue : []
      }

      this.handleSender()
    },

    /**
     * 处理全部选中的函数
     */
    handleFoucs(list) {
      if (this.crmType === 'customer') {
        this.checkAllCustomer = []
        this.customerList = list
        list.forEach(item => {
          this.checkAllCustomer.push(item.customerId)
        })
      } else if (this.crmType === 'contact') {
        this.checkAllContact = []
        this.contactList = list
        list.forEach(item => {
          this.checkAllContact.push(item.contactId)
        })
      } else {
        this.checkAllValue = []
        this.shortList = list
        list.forEach(item => {
          this.checkAllValue.push(item.value)
        })
      }
    },

    /**
     * 处理需要带到收件人的函数
     */
    handleSender() {
      const customerList = this.handleCustomer()
      const contactList = this.handleContact()
      const valueList = this.handleValue()
      const list = [
        ...customerList,
        ...contactList,
        ...valueList
      ]
      this.$emit('handle', list)
    },

    /**
     * 处理客户选中的数据
     */
    handleCustomer() {
      const list = []
      let obj = {}
      this.customerCheckList.forEach(item => {
        obj = {
          customerName: item.customerName,
          email: item.email || ''
        }
        list.push(obj)
      })
      return list
    },

    /**
     * 处理联系人选中的数据
     */
    handleContact() {
      const list = []
      let obj = {}
      this.contactCheckList.forEach(item => {
        obj = {
          customerName: item.contactName,
          email: item.email || ''
        }
        list.push(obj)
      })
      return list
    },

    /**
     * 处理最近的选中的数据
     */
    handleValue() {
      const list = []
      let obj = {}
      this.shortCheckList.forEach(item => {
        obj = {
          customerName: item.name,
          email: item.value || ''
        }
        list.push(obj)
      })
      return list
    },

    /**
     * 当前页码变化
     */
    currentChange(val) {
      this.page = val
      this.getFilterList()
    },

    /**
     * 验重
     */
    listFifter(item) {
      if (this.crmType === 'customer') {
        this.customerCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.customerCheckList.splice(index, 1)
          }
        })
        this.customerCheckList.push(item)
      } else if (this.crmType === 'contact') {
        this.contactCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.contactCheckList.splice(index, 1)
          }
        })
        this.contactCheckList.push(item)
      } else {
        this.shortCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.shortCheckList.splice(index, 1)
          }
        })
        this.shortCheckList.push(item)
      }
      this.handleSender()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  overflow: hidden;
  border-left: 1px solid #e4e4e4;
  background-color: #fff;
  position: relative;
  width: 240px;
}

.filter_box {
  width: 330px;
  margin: 0px;
  border-radius: 4px;
  background-color: #fff;
  height: calc(100% - 50px);
}

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
  height: calc(100% - 100px);
  overflow-y: auto;
  position: relative;
  padding: 5px 12px 12px 12px;
  .item_email {
    line-height: 20px;
    height: 30px;
    padding-left: 10px;
    cursor: pointer;
  }
  .item_email:hover {
    background-color: #F6F8FA;
  }
  .all {
    width: 260px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 13px;
    position: relative;
    top: 6px;
  }
}
.pagination {
  right: 20px;
  line-height: 30px;
  position: absolute;
  bottom: 10px;
  /deep/.btn-next {
    border: 1px solid #e4e4e4;
    padding-left: 5px;
    text-align: center;
    border-radius: 3px;
  }
  /deep/.btn-prev {
    border: 1px solid #e4e4e4;
    text-align: center;
    padding-left: 10px;
    border-radius: 3px;
    margin-right: 10px;
  }
}
</style>

