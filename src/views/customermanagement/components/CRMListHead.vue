<template>
  <div class="c-container">
    <flexbox v-if="!$slots.icon" class="title"><img
      :src="titleIcon"
      class="title-icon">{{ title }}</flexbox>
    <slot v-else name="icon" />
    <el-input
      v-if="showSearch"
      :placeholder="placeholder"
      v-model="inputContent"
      class="sc-container"
      @input="inputChange"
      @keyup.enter.native="searchInput">
      <el-button
        slot="append"
        type="primary"
        @click.native="searchInput">搜索</el-button>
    </el-input>
    <div class="right-container">
      <el-button
        v-if="canSave && !isStudent && crmType === 'customer'"
        class="xr-btn--orange"
        icon="el-icon-plus"
        type="primary"
        @click="createClick('introduce')">新建转介绍LEADS</el-button>
      <el-button
        v-if="canSave && crmType === 'contract'"
        class="xr-btn--orange"
        icon="el-icon-plus"
        type="primary"
        @click="createClick('present')">新建额外赠送合同</el-button>
      <el-button
        v-if="canSave"
        class="xr-btn--orange"
        icon="el-icon-plus"
        type="primary"
        @click="createClick()">{{ mainTitle }}</el-button>
      <el-button
        v-if="showDupCheck"
        class="dup-check-btn"
        @click="dupCheckShow = true">查重</el-button>
      <el-dropdown
        v-if="moreTypes.length > 0"
        trigger="click"
        @command="handleTypeDrop">
        <el-button icon="el-icon-more"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in moreTypes"
            :key="index"
            :icon="item.icon | wkIconPre"
            :command="item.type">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="createCRMType"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>
    <!-- 查重 -->
    <duplicate-check :visible.sync="dupCheckShow" />
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import CRMCreateView from './CRMCreateView'
import DuplicateCheck from './duplicate-check'

export default {
  name: 'CRMListHead', // 客户管理下 重要提醒 回款计划提醒
  components: {
    CRMCreateView,
    DuplicateCheck
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    mainTitle: {
      type: String,
      default: ''
    },
    // CRM类型
    crmType: {
      type: String,
      default: ''
    },
    /** 是公海 */
    isSeas: {
      type: Boolean,
      default: false
    },
    // 是学员
    isStudent: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    search: String, // 用于联动
    // 自定义方法
    createFun: Function
  },
  data() {
    return {
      inputContent: '',
      /** 更多操作 */
      moreTypes: [],
      // 创建的相关信息
      createActionInfo: { type: 'save' },
      createCRMType: '',
      isCreate: false, // 是创建
      // 查重
      dupCheckShow: false
    }
  },
  computed: {
    ...mapGetters(['crm', 'education', 'userInfo']),
    canSave() {
      if (this.isSeas || this.isStudent) {
        return false
      }

      if (['classroom', 'class', 'classschedule', 'studentschedule', 'teacherschedule'].includes(this.crmType)) {
        return this.education[this.crmType].save
      }

      if (this.crmType == 'studentWarning') {
        return true
      }


      return this.crm[this.crmType].save
    },

    titleIcon() {
      if (this.crmType == 'productSetMeal') {
        return require(`@/assets/img/crm/product.png`)
      } else if (this.crmType == 'insideUser') {
        return require(`@/assets/img/crm/product.png`)
      } else if (['classroom', 'class', 'classschedule', 'studentschedule', 'teacherschedule'].includes(this.crmType)) {
        return require(`@/assets/img/crm/product.png`)
      } else if (this.crmType == 'studentWarning') {
        return require(`@/assets/img/crm/customer.png`)
      }
      return require(`@/assets/img/crm/${this.crmType}.png`)
    },

    showDupCheck() {
      return false
      // return ['leads', 'customer', 'contacts'].includes(this.crmType) && !this.isSeas
    }
  },
  mounted() {
    // 线索和客户判断更多操作
    if (
      this.crmType === 'customer' &&
      !this.isStudent &&
      this.crm[this.crmType] &&
      this.crm[this.crmType].activityExcelimport) {
      this.moreTypes.push({ type: 'enter-record', name: '导入跟进', icon: 'import' })
    }
    if (this.crm[this.crmType] && this.crm[this.crmType].excelimport) {
      this.moreTypes.push({ type: 'enter', name: '导入', icon: 'import' })
    }
    console.log('菜单', this.crmType, this.crm, this.crm[this.crmType])
    if (this.crm[this.crmType] && this.crm[this.crmType].excelexport) {
      this.moreTypes.push({ type: 'out', name: '导出', icon: 'export' })
    }

    if (['classroom', 'class', 'classschedule', 'studentschedule'].includes(this.crmType) && this.education[this.crmType].excelexport) {
      this.moreTypes.push({ type: 'out', name: '导出', icon: 'export' })
    }

    // 监听导入
    this.$bus.on('import-crm-done-bus', (type) => {
      if (this.crmType == type) {
        this.$emit('on-handle', { type: 'import-crm' })
      }
    })
  },
  beforeDestroy() {
    this.$bus.off('import-crm-done-bus')
  },
  methods: {
    handleTypeDrop(command) {
      switch (command) {
        case 'out':
          this.$emit('on-export')
          break
        case 'enter':
          this.$bus.emit('import-crm-bus', this.crmType, this.isSeas)
          break
        case 'enter-record':
          this.$bus.emit('import-crm-bus', this.crmType, this.isSeas, true)
          break
      }
    },
    createClick(action = '') {
      if (this.createFun) {
        this.createFun()
      } else {
        this.createCRMType = this.crmType
        this.createActionInfo = { type: 'save' }
        if (this.crmType === 'customer' && action === 'introduce') {
          this.createActionInfo = {
            type: 'save',
            introduce: true,
            userInfo: {
              userId: this.userInfo.userId,
              realname: this.userInfo.realname
            }
          }
          // 如果是学员
          if (this.isStudent) {
            this.createActionInfo.isStudent = true
          }
        }
        console.log('传递给creat组件一个userID')
        if (this.crmType === 'contract') {
          this.createActionInfo.userInfo = {
            userId: this.userInfo.userId,
            realname: this.userInfo.realname
          }
          if (action === 'present') {
            this.createActionInfo.present = true
            this.createActionInfo.contractType = 2
          }
        }

        if (this.crmType == 'classroom') {
          this.$emit('create-room')
        } else if (this.crmType == 'class') {
          this.$emit('create-class')
        } else if (this.crmType == 'studentWarning') {
          this.$emit('create-warning')
        } else {
          this.isCreate = !this.isCreate
        }
        // if (this.crmType === 'contract' && action === 'present') {
        //   this.createActionInfo = {
        //     type: 'save',
        //     present: true,
        //     userInfo: {
        //       userId: this.userInfo.userId,
        //       realname: this.userInfo.realname
        //     }
        //   }
        // }
      }
    },
    inputChange() {
      this.$emit('update:search', this.inputContent)
    },
    // 进行搜索操作
    searchInput() {
      this.$emit('on-search', this.inputContent)
    },
    // 创建数据页面 保存成功
    createSaveSuccess(data) {
      if (data && data.saveAndCreate) {
        if (data.type == 'customer') {
          this.createCRMType = 'contacts'
          this.createActionInfo = {
            type: 'relative',
            crmType: 'customer',
            data: {}
          }
          this.createActionInfo.data['customer'] = data.data
          this.isCreate = true
        }
      } else {
        // 回到保存成功
        this.$emit('on-handle', { type: 'save-success' })
      }
    },
    hideView() {
      this.isCreate = false
    }
  }
}
</script>
<style lang="scss" scoped>
.c-container {
  height: 60px;
  position: relative;
  z-index: 100;
  .title-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .title {
    float: left;
    width: auto;
    padding-left: 28px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 15px;
  }
  .sc-container {
    // width: 330px;
    width: 428px;
    // margin: -16px 0 0 -150px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .el-input {
    /deep/ .el-input-group__append {
      left: -1px;
      background-color: $xr-color-primary;
      border-color: $xr-color-primary;
      color: white;
    }

    /deep/ .el-input__inner {
      width: 375px;
    }
  }

  .right-container {
    margin-right: -10px;
    float: right;
    margin: 15px 20px 0 0;
    position: relative;

    .dup-check-btn,
    .xr-btn--orange {
      margin-left: 0;
      margin-right: 10px;
    }

    .right-item {
      float: left;
      margin-right: 10px;
      padding: 8px 10px;
      font-size: 13px;
      border-radius: 2px;
    }
  }
}
</style>
