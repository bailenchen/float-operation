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
        <el-button v-if="showFifter" type="text" class="filter-btn" @click="highFilter">高级筛选</el-button>
      </div>
      <filter-content
        v-if="filterObj.form && filterObj.form.length > 0"
        :obj="filterShowObj"
        @delete="handleDeleteField" />
      <flexbox class="select_title" justify="space-between">
        <div>
          <span v-if="crmType === 'customer'" class="title_left">
            {{ total }}位客户
          </span>
          <span v-else-if="crmType === 'contacts'" class="title_left">
            {{ total }}位联系人
          </span>
        </div>

        <el-button
          v-if="allCheck && filterList.length"
          type="text"
          style="font-weight: 600"
          icon="el-icon-circle-check"
          @click="handleAll(true)">全选</el-button>
        <el-button
          v-else-if="filterList.length"
          type="text"
          style="font-weight: 600"
          icon="el-icon-circle-close"
          @click="handleAll(false)">取消全选</el-button>
      </flexbox>
      <div :class="filterObj.form && filterObj.form.length > 0 ? 'list_height' : ''" class="filter-list">
        <div v-if="crmType === 'customer'">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.customerId"
            :class="item.checked ? 'selected' : ''"
            class="item_email"
            style="font-size: 13px;">
            <el-checkbox v-model="item.checked" @change="listFifter(item)">
              <span class="all">
                {{ item.customerName }}&lt;{{ item.email }}&gt;
              </span>
            </el-checkbox>
          </div>
        </div>

        <div v-else-if="crmType === 'contacts'">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.contactsId"
            :class="item.checked ? 'selected' : ''"
            class="item_email"
            style="font-size: 13px;">
            <el-checkbox v-model="item.checked" @change="listFifter(item)">
              <span class="all">
                {{ item.customerName }}&lt;{{ item.email }}&gt;
              </span>
            </el-checkbox>
          </div>
        </div>

        <div v-else-if="crmType === 'user'">
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.contactsId"
            :class="item.checked ? 'selected' : ''"
            class="item_email"
            style="font-size: 13px;">
            <el-checkbox v-model="item.checked" @change="listFifter(item)">
              <span class="all">
                {{ item.customerName }}&lt;{{ item.email }}&gt;
              </span>
            </el-checkbox>
          </div>
        </div>

        <div v-else>
          <div
            v-for="(item, index) in filterList"
            :key="index"
            :label="item.value"
            :class="item.checked ? 'selected' : ''"
            class="item_email"
            style="font-size: 13px;">
            <el-checkbox v-model="item.checked" @change="listFifter(item)">
              <span class="all">
                {{ item.customerName }}&lt;{{ item.email }}&gt;
              </span>
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <flexbox class="pagination" justify="space-between">
      <div style="width: 200px;">
        <span v-show="showFifter">隐藏无邮箱数据</span>
        <el-switch
          v-show="showFifter"
          v-model="showIsEmail"
          active-color="#2362FB"
          inactive-color="#e6e6e6"/>
      </div>

      <el-pagination
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        layout="prev, next"
        @current-change="currentChange"/>
    </flexbox>
    <filter-form
      v-if="showFilterView"
      :field-list="fieldList"
      :dialog-visible.sync="showFilter"
      :obj="filterObj"
      :crm-type="crmType"
      :save-scene="false"
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
import { usersList } from '@/api/common'
import filterForm from '../../customermanagement/components/filterForm'
import filterContent from '../../customermanagement/components/filterForm/filterContent'
import { emailAccountQueryLatelyAPI } from '@/api/email/email'
import { mapGetters } from 'vuex'
export default {
  name: 'HighFilter',
  components: {
    filterForm,
    filterContent
  },
  props: {
    deleteItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 聚焦类型
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      activeIndex: 0,
      // 高级筛选
      search: '',
      showFilterView: false,
      fieldList: [],
      showFilter: false, // 控制筛选框
      filterObj: { form: [] }, // 筛选确定数据
      filterShowObj: { form: [] },
      crmType: '',
      page: 1,
      total: 0,
      // 勾选
      allCheck: true,
      allObj: {
        receive: {
          customerCheckList: [],
          contactCheckList: [],
          shortCheckList: [],
          usersCheckList: []
        },
        sent: {
          customerCheckList: [],
          contactCheckList: [],
          shortCheckList: [],
          usersCheckList: []
        }
      },
      // 记录哪种类型的那几页被选中
      pageSelect: {
        receive: {
          customerPages: {},
          contactPages: {},
          shortPages: {},
          userPages: {}
        },
        sent: {
          customerPages: {},
          contactPages: {},
          shortPages: {},
          userPages: {}
        }
      },
      customerCheckList: [], // 客户
      customerList: [],
      contactCheckList: [], // 联系人
      contactList: [],
      shortCheckList: [], // 最近
      shortList: [],
      showErrorMsg: false,
      showIsEmail: true, // 展示没有邮箱的客户
      checkAllCustomer: [], // 所有客户
      checkAllContact: [], // 所有联系人
      checkAllValue: [], // 所有的最近的人
      filterList: [] // 过滤后的列表
    }
  },
  computed: {
    ...mapGetters(['crm']),
    showFifter() {
      if (this.crmType === 'customer' || this.crmType === 'contacts') {
        return true
      } else {
        return false
      }
    },
    filterNavList() {
      const list = [
        { name: '最近', crmType: '' }
      ]
      if (this.crm && this.crm.customer && this.crm.customer.index) {
        list.push({ name: '客户', crmType: 'customer' })
      }
      if (this.crm && this.crm.contacts && this.crm.contacts.index) {
        list.push({ name: '联系人', crmType: 'contacts' })
      }
      list.push({ name: '同事', crmType: 'user' })
      return list
    }
  },

  watch: {
    showIsEmail() {
      this.getFilterList()
    },

    deleteItem: {
      handler(val) {
        console.log(val, '==val')
        if (val.item.model === 'customer') {
          this.allObj[val.item.sendType].customerCheckList.forEach((item, index) => {
            if (val.item.customerName === item.customerName) {
              this.allObj[val.item.sendType].customerCheckList.splice(index, 1)
            }
          })
        } else if (val.item.model === 'contacts') {
          this.allObj[val.item.sendType].contactCheckList.forEach((item, index) => {
            if (val.item.customerName === item.customerName) {
              this.allObj[val.item.sendType].contactCheckList.splice(index, 1)
            }
          })
        } else if (val.item.model === 'user') {
          this.allObj[val.item.sendType].usersCheckList.forEach((item, index) => {
            if (val.item.customerName === item.customerName) {
              this.allObj[val.item.sendType].usersCheckList.splice(index, 1)
            }
          })
        } else if (val.item.model === 'nearBy') {
          this.allObj[val.item.sendType].shortCheckList.forEach((item, index) => {
            if (val.item.customerName === item.customerName) {
              this.allObj[val.item.sendType].shortCheckList.splice(index, 1)
            }
          })
        }
        this.mathChangeColor()
      },
      deep: true
    },

    type() {
      this.getFilterList()
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
          contacts: crmContactsIndex,
          user: usersList
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
        params.data = this.filterObj.obj || {}
        if (this.showIsEmail) {
        // 如果隐藏无邮箱客户
          params.data.email = {
            condition: 'isNotNull',
            formType: 'email',
            name: 'email',
            value: '1'
          }
        }
      } else {
        if (this.showIsEmail) {
          params.data = {
            email: {
              condition: 'isNotNull',
              formType: 'email',
              name: 'email',
              value: '1'
            }
          }
        }
      }

      crmIndexRequest(params)
        .then(res => {
          // if (this.crmType === 'customer') {
          this.filterList = this.handleData(res.data.list)
          this.total = res.data.totalRow
          this.filterShowObj = {
            form: [
              { formType: 'email', name: '共筛选出数据', condition: 'is', value: `${this.total}条`, fieldName: 'email' }
            ],
            obj: {
              email: { formType: 'email', name: '共筛选出数据', condition: 'is', value: `${this.total}条` }
            }
          }
          this.mathChangeColor()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 处理展示数据
     */
    handleData(list) {
      const handleList = []
      list.forEach(item => {
        // 将客户当做模板
        const obj = {}
        if (this.crmType === 'contacts') {
          obj.customerName = item.customerName
          obj.customerId = item.contactsId
          obj.email = item.email
          handleList.push(obj)
        } else if (this.crmType === 'customer') {
          obj.customerName = item.customerName
          obj.customerId = item.customerId
          obj.email = item.email
          handleList.push(obj)
        } else if (this.crmType === 'user') {
          obj.customerName = item.realname
          obj.customerId = item.userId
          obj.email = item.email
          handleList.push(obj)
        } else {
          obj.customerName = item.name
          obj.customerId = item.id
          obj.email = item.value
          handleList.push(obj)
        }
      })
      return handleList
    },

    /**
     * 点击导航
     */
    clickNav(item, index) {
      this.page = 1
      this.activeIndex = index
      this.crmType = item.crmType
      this.showFilterView = false
      this.filterShowObj = { form: [] }
      this.filterObj = { form: [] }
      this.getFilterList()
      if (this.crmType && this.crmType !== 'user') {
        this.getFilterFieldInfo()
      }
    },

    /**
     * 筛选按钮
     */
    filter() {
      // this.showFilterView = true
      // this.showFilter = true
      this.getFilterList()
    },

    highFilter() {
      this.showFilterView = true
      this.showFilter = true
    },

    /**
     * 获取高级筛选字段数据
     */
    getFilterFieldInfo() {
      const params = {}
      const keytype = this.crmType == 'student' ? 'customer' : this.crmType
      params.label = crmTypeModel[keytype]

      const request = filterIndexfields

      request(params)
        .then(res => {
          this.fieldList = res.data
        })
        .catch(() => {})
    },

    handleFilter(form) {
      this.filterObj = form
      this.showFilter = false
      const keytype = this.crmType == 'student' ? 'customer' : this.crmType
      if (form.saveChecked) {
        crmSceneSave({
          type: crmTypeModel[keytype],
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
      this.allCheck = !this.allCheck
      if (this.crmType === 'customer') {
        this.pageSelect[this.type].customerPages[this.page] = !this.allCheck
      } else if (this.crmType === 'contacts') {
        this.pageSelect[this.type].contactPages[this.page] = !this.allCheck
      } else if (this.crmType === 'user') {
        this.pageSelect[this.type].userPages[this.page] = !this.allCheck
      } else {
        this.pageSelect[this.type].shortPages[this.page] = !this.allCheck
      }

      this.filterList.forEach(item => {
        item.checked = !this.allCheck
        this.listFifter(item, true)
      })
      this.mathChangeColor()
    },

    /**
     * 处理需要带到收件人的函数
     */
    handleSender() {
      const customerList = this.handleCustomer()
      const contactList = this.handleContact()
      const valueList = this.handleValue()
      const userList = this.handleUser()
      console.log(valueList, 'value==')
      const list = [
        ...customerList,
        ...contactList,
        ...userList,
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
      this.allObj[this.type].customerCheckList.forEach(item => {
        obj = {
          customerName: item.customerName,
          sendType: item.sendType,
          model: 'customer',
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
      this.allObj[this.type].contactCheckList.forEach(item => {
        obj = {
          customerName: item.customerName,
          sendType: item.sendType,
          model: 'contacts',
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
      this.allObj[this.type].shortCheckList.forEach(item => {
        obj = {
          customerName: item.customerName,
          sendType: item.sendType,
          model: 'nearBy',
          email: item.email || ''
        }
        list.push(obj)
      })
      return list
    },

    /**
     * 处理同事
     */
    handleUser() {
      const list = []
      let obj = {}
      this.allObj[this.type].usersCheckList.forEach(item => {
        obj = {
          customerName: item.customerName,
          sendType: item.sendType,
          model: 'user',
          email: item.email || ''
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
      this.allCheck = true
      this.getFilterList()
    },

    /**
     * 选中此行
     */
    listFifter(item, bool) {
      this.addFifter(item)
      if (!bool) {
        // 全选是不用每次刷新页面，优化展示速度
        this.mathChangeColor()
      }
      this.handleSender()
    },

    /**
     * 验重
     */
    addFifter(item) {
      if (this.crmType === 'customer') {
        this.allObj[this.type].customerCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.allObj[this.type].customerCheckList.splice(index, 1)
          }
        })
        if (item.checked) {
          item.sendType = this.type
          this.allObj[this.type].customerCheckList.push(item)
        }
      } else if (this.crmType === 'contacts') {
        if (this.allObj[this.type].contactCheckList[0]) {
          this.allObj[this.type].contactCheckList[0].allCheck = {
            allCheck: !this.allCheck,
            page: this.page
          }
        }
        this.allObj[this.type].contactCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.allObj[this.type].contactCheckList.splice(index, 1)
          }
        })
        if (item.checked) {
          item.sendType = this.type
          this.allObj[this.type].contactCheckList.push(item)
        }
      } else if (this.crmType === 'user') {
        if (this.allObj[this.type].usersCheckList[0]) {
          this.allObj[this.type].usersCheckList[0].allCheck = {
            allCheck: !this.allCheck,
            page: this.page
          }
        }
        this.allObj[this.type].usersCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.allObj[this.type].usersCheckList.splice(index, 1)
          }
        })
        if (item.checked) {
          item.sendType = this.type
          this.allObj[this.type].usersCheckList.push(item)
        }
      } else {
        if (this.allObj[this.type].shortCheckList[0]) {
          this.allObj[this.type].shortCheckList[0].allCheck = {
            allCheck: !this.allCheck,
            page: this.page
          }
        }
        this.allObj[this.type].shortCheckList.forEach((ele, index) => {
          if (item.customerId === ele.customerId) {
            this.allObj[this.type].shortCheckList.splice(index, 1)
          }
        })
        if (item.checked) {
          item.sendType = this.type
          this.allObj[this.type].shortCheckList.push(item)
        }
      }
    },

    /**
     * 删除筛选条件
     */
    handleDeleteField(data) {
      this.filterObj = { form: [] }
      this.filterShowObj = { form: [] }
      this.getFilterList()
    },

    /**
     * 匹配选中的变灰
     */
    mathChangeColor() {
      if (this.crmType === 'customer') {
        // 查看此页是否全部被选中
        let bool = false
        if (this.pageSelect[this.type].customerPages) {
          bool = this.pageSelect[this.type].customerPages[this.page]
        }
        this.filterList.forEach(item => {
          if (bool) {
            item.checked = true
            // 展示取消选中
            this.allCheck = false
          } else {
            item.checked = false
            this.allCheck = true
          }

          this.allObj[this.type].customerCheckList.forEach(ele => {
            if (item.customerId === ele.customerId) {
              item.checked = true
            }
          })
        })
      } else if (this.crmType === 'contacts') {
        // 查看此页是否全部被选中
        let bool = false
        if (this.pageSelect[this.type].contactPages) {
          bool = this.pageSelect[this.type].contactPages[this.page]
        }
        this.filterList.forEach(item => {
          if (bool) {
            item.checked = true
            // 展示取消选中
            this.allCheck = false
          } else {
            item.checked = false
            this.allCheck = true
          }

          this.allObj[this.type].contactCheckList.forEach(ele => {
            if (item.customerId === ele.customerId) {
              item.checked = true
            }
          })
        })
      } else if (this.crmType === 'user') {
        // 查看此页是否全部被选中
        let bool = false
        if (this.pageSelect[this.type].userPages) {
          bool = this.pageSelect[this.type].userPages[this.page]
        }
        this.filterList.forEach(item => {
          if (bool) {
            item.checked = true
            // 展示取消选中
            this.allCheck = false
          } else {
            item.checked = false
            this.allCheck = true
          }

          this.allObj[this.type].usersCheckList.forEach(ele => {
            if (item.customerId === ele.customerId) {
              item.checked = true
            }
          })
        })
      } else {
        // 查看此页是否全部被选中
        let bool = false
        if (this.pageSelect[this.type].shortPages) {
          bool = this.pageSelect[this.type].shortPages[this.page]
        }
        this.filterList.forEach(item => {
          if (bool) {
            item.checked = true
            // 展示取消选中
            this.allCheck = false
          } else {
            item.checked = false
            this.allCheck = true
          }
          this.allObj[this.type].shortCheckList.forEach(ele => {
            if (item.customerId === ele.customerId) {
              item.checked = true
            }
          })
        })
      }
      this.filterList = JSON.parse(JSON.stringify(this.filterList))
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
.select_title {
  height: 30px;
  width: 300px;
  margin-left: 20px;
  border-top: 1px solid #e4e4e4;
  .title_left {
    font-size: 12px;
    color: #999;
  }
  /deep/.el-icon-circle-check {
    font-weight: 600;
  }
  /deep/.el-icon-circle-close {
    font-weight: 600;
  }
}
// 列表
.filter-list {
  width: 100%;
  height: calc(100% - 120px);
  overflow-y: auto;
  position: relative;
  padding: 5px 12px 12px 12px;
  .item_email {
    line-height: 20px;
    height: 30px;
    margin-top: 5px;
    padding-left: 10px;
    cursor: pointer;
  }
  .item_email:hover {
    background-color: #F6F8FA;
  }
  .selected {
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
.list_height {
   height: calc(100% - 170px);
}
.pagination {
  width: 350px;
  height: 50px;
  position: relative;
  padding: 0 10px;
  font-size: 13px;
  color: #333;
  top: -20px;
  z-index: 10;
  background-color: #f7f8fa;
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

