<template>
  <el-popover
    ref="popover"
    :placement="placement"
    :width="popoverWidth"
    v-model="popoverVisible"
    popper-class="no-padding-popover"
    trigger="click">
    <div v-if="popoverContentShow">
      <div class="popover-content-box">
        <div class="select-input">
          <!-- 搜索员工列表 -->
          <el-tabs
            v-model="activeTabName"
            @tab-click="tabClick">
            <el-tab-pane
              v-loading="userLoading"
              v-if="!closeUser"
              label="员工"
              name="user">
              <el-input
                v-model="searchUserInput"
                placeholder="搜索员工"
                size="small"
                prefix-icon="el-icon-search"
                class="search-input"
                @input="userSearchChange" />
              <div class="search-list">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  class="all-check"
                  @change="handleCheckAllChange">全选</el-checkbox>
                <div class="checkout-boxs">
                  <div
                    v-for="(user, index) in userList"
                    v-if="!user.hidden"
                    :key="index"
                    class="colleagues-list">
                    <el-checkbox
                      v-model="user.isCheck"
                      @change="userCheckboxChange(user, index)">
                      <div
                        v-photo="user"
                        v-lazy:background-image="$options.filters.filterUserLazyImg(user.img)"
                        class="div-photo search-img header-circle" />
                      <span>{{ user.realname }}</span>
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-loading="depLoading"
              v-if="!closeDep"
              label="部门"
              name="dep">
              <el-input
                v-model="searchDepInput"
                placeholder="搜索部门"
                size="small"
                style="margin-bottom:10px;"
                prefix-icon="el-icon-search"
                class="search-input"
                @input="depSearchChange" />
              <div class="search-list">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item
                    v-for="(item, index) in breadcrumbList"
                    :key="index">
                    <a
                      href="javascript:;"
                      @click="breadcrumbBtn(item, index)">{{ item.label }}</a>
                  </el-breadcrumb-item>
                </el-breadcrumb>
                <div class="checkout-boxs">
                  <div
                    v-for="(depItem, index) in depShowList"
                    v-if="!depItem.hidden"
                    :key="index"
                    class="checkout-box">
                    <el-checkbox
                      v-model="depItem.isCheck"
                      @change="depCheckboxChange(depItem, index)" />
                    <div @click="enterDepChildren(depItem)">
                      <span>{{ depItem.name }}</span>
                      <span
                        v-if="depItem.children"
                        class="el-icon-arrow-right" />
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="checked-content">
          <div class="checked-top">
            <span class="select-info">已选择<span class="select-info--num">{{ userSelectCount + depSelectCount }}</span>项</span>
            <el-button
              type="text"
              @click="clearAll">清空</el-button>
          </div>
          <div class="select-content">
            <flexbox
              justify="stretch"
              wrap="wrap">
              <span
                v-for="(item, index) in checkedUserDepList"
                :key="index"
                class="select-item">{{ item.realname || item.name }}<i
                  class="el-icon-close"
                  @click="selectDelete(item, index)" /></span>
            </flexbox>
          </div>
        </div>
      </div>
      <div class="popover-footer">
        <el-button @click="popoverVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="popoverSubmit">确 定</el-button>
      </div>
    </div>
    <div
      slot="reference"
      :style="{'display':contentBlock ? 'block' : 'inline-block'}"
      @click="showContentClick">
      <slot name="membersDep" />
    </div>
  </el-popover>

</template>
<script>
import { usersList, depList } from '@/api/common'
export default {
  props: {
    // 弹出框宽度
    popoverWidth: {
      type: String,
      default: '600'
    },
    // 显示位置
    placement: {
      type: String,
      default: 'bottom-start'
    },
    // 内容框类型
    contentBlock: {
      type: Boolean,
      default: true
    },
    // 编辑时 -- 用户默认勾选的数据
    userCheckedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 编辑时 -- 部门默认勾选的数据
    depCheckedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否关闭某个类的选择
    closeUser: {
      type: Boolean,
      default: false
    },
    closeDep: {
      type: Boolean,
      default: false
    },
    userRequest: Function,
    userParams: Object
  },
  data() {
    return {
      activeTabName: 'user',
      // 筛选
      searchUserInput: '',
      searchDepInput: '',
      popoverVisible: false,
      checkAll: false,
      isIndeterminate: false,
      // 内容展示
      popoverContentShow: false,
      // 加载动画
      userLoading: false,
      depLoading: false,
      // 所有用户
      userList: [],
      // 展示客户
      depShowList: [],
      // 面包屑数据
      breadcrumbList: [],
      // 选中的数据 -- 员工和部门一个数组用于页面展示
      checkedUserDepList: []
    }
  },
  computed: {
    userSelectCount() {
      return this.checkedUserDepList.filter(item => {
        return item.type == 'user'
      }).length
    },
    depSelectCount() {
      return this.checkedUserDepList.filter(item => {
        return item.type == 'dep'
      }).length
    }
  },
  watch: {
    userCheckedData: function() {
      this.updateCheckInfoByWatch()
    },
    depCheckedData: function() {
      this.updateCheckInfoByWatch()
    },
    popoverVisible: function(val) {
      if (val) {
        this.updateCheckInfoByWatch()
      }
    },
    userList() {
      const selectItems = this.userList.filter(item => {
        return item.isCheck
      })
      this.refreshAllCheck(selectItems.length)
    }
  },
  methods: {
    initInfo() {
      // 用户列表
      this.checkedUserDepList = this.userCheckedData
        .map(item => {
          item.type = 'user'
          return item
        })
        .concat(
          this.depCheckedData.map(item => {
            item.type = 'dep'
            return item
          })
        )

      if (!this.closeUser) {
        this.getUserList()
      } else if (!this.closeDep) {
        this.activeTabName = 'dep'
        this.getDepList()
      }
    },
    tabClick() {
      if (this.activeTabName == 'dep') {
        if (this.depShowList.length == 0) {
          this.getDepList()
        }
      }
    },
    userSearchChange(val) {
      this.userList = this.userList.map(item => {
        if (item.realname.indexOf(val) != -1) {
          item.hidden = false
        } else {
          item.hidden = true
        }
        return item
      })
    },
    depSearchChange(val) {
      this.depShowList = this.depShowList.map(item => {
        if (item.name.indexOf(val) != -1) {
          item.hidden = false
        } else {
          item.hidden = true
        }
        return item
      })
    },
    /**
     * 部门信息
     */
    // 部门列表数据
    getDepList() {
      this.depLoading = true
      depList({ type: 'tree' })
        .then(res => {
          this.depShowList = res.data.map((item, index, array) => {
            item.type = 'dep'
            item.isCheck = this.getItemCheckInfo(item, 'dep')
            return item
          })
          this.breadcrumbList.push({ label: '全部', data: this.depShowList })
          this.depLoading = false
        })
        .catch(() => {
          this.depLoading = false
        })
    },
    // 部门下一级
    enterDepChildren(depItem) {
      if (depItem.children) {
        this.depShowList = []
        this.depShowList = depItem.children.map((item, index, array) => {
          item.type = 'dep'
          if (item.name.indexOf(this.searchDepInput) != -1) {
            item.hidden = false
          } else {
            item.hidden = true
          }
          item.isCheck = this.getItemCheckInfo(item, 'dep')
          return item
        })
        this.breadcrumbList.push({
          label: depItem.label,
          data: this.depShowList
        })
      }
    },
    // 面包屑点击事件
    breadcrumbBtn(item, index) {
      if (index + 1 <= this.breadcrumbList.length - 1) {
        this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - 1)
      }
      this.depShowList = []
      this.depShowList = item.data.map((item, index, array) => {
        if (item.name.indexOf(this.searchDepInput) != -1) {
          item.hidden = false
        } else {
          item.hidden = true
        }
        item.isCheck = this.getItemCheckInfo(item, 'dep')
        return item
      })
    },
    // 部门勾选
    depCheckboxChange(item, aindex) {
      this.$set(this.depShowList, aindex, item)
      this.updateCheckedUserDepListByCheck(item, 'dep')
    },
    /**
     * 员工操作
     */
    getUserList() {
      this.userLoading = true
      let request = usersList
      let params = {}
      if (this.userRequest) {
        request = this.userRequest
        params = this.userParams || {}
      } else {
        params = { pageType: 0 }
      }
      request(params)
        .then(res => {
          this.userList = res.data.map(item => {
            item.type = 'user'
            item.isCheck = this.getItemCheckInfo(item, 'user')
            return item
          })
          this.userLoading = false
        })
        .catch(() => {
          this.userLoading = false
        })
    },
    // 员工勾选
    userCheckboxChange(item, aindex) {
      this.$set(this.userList, aindex, item)
      this.updateCheckedUserDepListByCheck(item, 'user')
    },

    /**
     * 刷新总check
     */
    refreshAllCheck(checkedCount) {
      this.checkAll = checkedCount === this.userList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.userList.length
    },

    /**
     * 全部勾选
     */
    handleCheckAllChange(val) {
      const depList = this.checkedUserDepList.filter(item => {
        return item.type == 'dep'
      })

      this.userList = this.userList.map(item => {
        item.isCheck = val
        return item
      })

      this.checkedUserDepList = val ? depList.concat(this.userList) : depList
    },

    // check 操作后的 存储数据刷新
    updateCheckedUserDepListByCheck(item, type) {
      var removeIndex = -1
      for (let index = 0; index < this.checkedUserDepList.length; index++) {
        const element = this.checkedUserDepList[index]
        if (element.type == 'user' && item.userId == element.userId) {
          removeIndex = index
        } else if (element.type == 'dep' && item.id == element.id) {
          removeIndex = index
        }
      }
      if (removeIndex == -1) {
        this.checkedUserDepList.push(item)
      } else if (removeIndex != -1) {
        this.checkedUserDepList.splice(removeIndex, 1)
      }
    },
    // 获取事项标记信息
    getItemCheckInfo(item, type) {
      if (this.checkedUserDepList.length == 0) {
        return false
      }
      var hasItem = false
      for (let index = 0; index < this.checkedUserDepList.length; index++) {
        const element = this.checkedUserDepList[index]
        if (element.type == 'user' && item.userId == element.userId) {
          hasItem = true
          break
        } else if (element.type == 'dep' && item.id == element.id) {
          hasItem = true
          break
        }
      }
      return hasItem
    },
    /**
     * 删除 清空 等操作
     */
    // 删除一个选择员工或部门
    selectDelete(selectItem, index) {
      this.checkedUserDepList.splice(index, 1)
      if (selectItem.type == 'dep') {
        this.depShowList = this.depShowList.map((item, index, array) => {
          item.isCheck = this.getItemCheckInfo(item, 'dep')
          return item
        })
      } else {
        this.userList = this.userList.map((item, index, array) => {
          item.isCheck = this.getItemCheckInfo(item, 'user')
          return item
        })
      }
    },
    // 提交按钮
    popoverSubmit() {
      this.popoverVisible = false
      this.$emit(
        'popoverSubmit',
        this.checkedUserDepList.filter(item => {
          return item.type == 'user'
        }),
        this.checkedUserDepList.filter(item => {
          return item.type == 'dep'
        })
      )
    },
    // 清空按钮
    clearAll() {
      this.checkedUserDepList = []
      this.userList = this.userList.map(item => {
        item.isCheck = false
        return item
      })

      this.depShowList = this.depShowList.map(item => {
        item.isCheck = false
        return item
      })
    },
    // 内容可见
    showContentClick() {
      if (!this.popoverContentShow) {
        this.popoverContentShow = true
        this.initInfo()
      }
    },
    // 监听父类改变更新check
    updateCheckInfoByWatch() {
      this.checkedUserDepList = this.userCheckedData
        .map(item => {
          item.type = 'user'
          return item
        })
        .concat(
          this.depCheckedData.map(item => {
            item.type = 'dep'
            return item
          })
        )

      this.depShowList = this.depShowList.map((item, index, array) => {
        item.isCheck = this.getItemCheckInfo(item, 'dep')
        return item
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';
.popover-content-box {
  display: flex;
  .select-input {
    flex: 1;
    border-right: 1px solid $xr-border-line-color;
    .select-input > .el-input {
      margin: 10px 0;
    }
  }
  .select-input /deep/ .el-tabs {
    /deep/ .el-tabs__nav-wrap {
      padding: 0 12px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }

    /deep/ .el-tabs__header {
      margin-bottom: 12px;
    }

    /deep/ .el-tabs__item {
      font-size: 12px;
      color: #333;
      padding-right: 0;
    }

    .el-tabs__content {
      margin: 0 12px;
      height: 220px;
      .el-checkbox {
        margin-left: 0;
        margin-right: 10px;
      }
    }
    .el-breadcrumb {
      margin-bottom: 15px;
    }
    .checkout-box {
      display: flex;
      margin-bottom: 10px;
    }
    .checkout-box > div {
      flex: 1;
      .el-icon-arrow-right {
        float: right;
      }
      span {
        cursor: pointer;
      }
    }
    .el-tab-pane {
      height: 100%;
    }
  }
  .checked-content {
    flex: 1;
    .checked-top {
      padding: 0 12px;
      height: 40px;
      line-height: 40px;
      margin-bottom: 12px;
      border-bottom: 1px solid $xr-border-line-color;
      .title {
        color: #999999;
      }
    }
    .select-content {
      padding: 0 12px;
      height: 220px;
      overflow: auto;
      .select-item {
        flex-shrink: 0;
        display: inline-block;
        background-color: #f3f7ff;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        padding: 0 5px;
        border-radius: 4px;
        color: #333;
        margin: 0 10px 10px 0;

        i {
          cursor: pointer;
          color: #666;
          margin-left: 5px;
        }

        i:hover {
          color: $xr-color-primary;
        }
      }
    }
  }
}

.popover-footer {
  background-color: #f7f8fa;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid $xr-border-line-color;

  .el-button {
    float: right;
    margin-top: 6px;
    padding: 6px 12px;
  }

  .el-button + .el-button {
    margin-left: 0;
    margin-right: 10px;
  }
}
/* 选择员工 */
.search-img {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  vertical-align: middle;
  margin-right: 8px;
}
.search-list {
  margin: 5px;
  height: 180px;
  overflow: auto;
  margin-right: -10px;
  padding-right: 10px;
}

.checkout-boxs {
  height: 150px;
  overflow: auto;
}

.colleagues-list {
  padding: 5px 0;
}

// 选择信息
.select-info {
  display: inline-block;
  width: calc(100% - 40px);

  &--num {
    color: $xr-color-primary;
  }
}

// check样式
.el-checkbox {
  /deep/ .el-checkbox__label {
    color: #333;
  }
}

.all-check {
  display: inline-block;
  padding: 5px 0;
}

.search-input {
  /deep/ .el-input__inner {
    background-color: #F4F4F4;
    border: none;
  }
}
</style>

