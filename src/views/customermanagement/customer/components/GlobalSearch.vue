<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    title="全局检索"
    custom-class="no-padding-dialog"
    width="800px">
    <div
      v-loading="loading"
      :class="{ 'show-table': showTable }"
      class="duplicate-check">
      <div>
        <el-input
          v-model="searchContent"
          class="search-input"
          placeholder="请输入第一联系人电话/第二联系人电话"
          @keyup.enter.native="getList">
          <el-button
            slot="append"
            type="primary"
            @click.native="getList">全局检索</el-button>
        </el-input>
      </div>

      <c-r-m-edit-base-info v-if="showData" :id="id" :detail="detailData" crm-type="customer"/>
      <div v-else class="no-data">暂无数据</div>

      <!-- <c-r-m-full-screen-detail
        :visible.sync="showFullDetail"
        :crm-type="relationCrmType"
        :id="relationID"
        @handle="getList"/> -->
    </div>
  </el-dialog>
</template>

<script>
import {
  crmCustomerIndex
} from '@/api/customermanagement/customer'


import CRMEditBaseInfo from '@/views/customermanagement/components/CRMEditBaseInfo' // 基本信息

import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'

export default {
  name: 'GlobalSearch',
  components: {
    CRMEditBaseInfo,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      typeSelect: 'name',
      searchContent: '',
      tableData: null,

      showFullDetail: false, // 查看相关客户管理详情
      relationID: '', // 相关ID参数
      relationCrmType: '', // 相关类型
      detailData: {}, // 数据
      showData: false, // 是否展示数据
      id: ''
    }
  },
  computed: {
    poolType() {
      return crmTypeModel.pool
    },

    showTable() {
      return this.tableData
    },

    isCustomerFilter() {
      return this.typeSelect == 'name'
    },

    // 客户名称、创建时间、负责人、最后跟进时间、操作
    fieldList() {
      if (this.isCustomerFilter) {
        return [{
          prop: 'name',
          label: '客户名称',
          width: 200
        }, {
          prop: 'createTime',
          label: '创建时间',
          width: 160
        }, {
          prop: 'ownerUserName',
          label: '负责人',
          width: 100
        }, {
          prop: 'lastTime',
          label: '最后跟进时间',
          width: 160
        }, {
          prop: 'module',
          label: '模块',
          width: 100
        }]
      }

      return [{
        prop: 'mobile',
        label: '手机号/电话',
        width: 160
      }, {
        prop: 'contactsName',
        label: '联系人',
        width: 160
      }, {
        prop: 'name',
        label: '客户名称',
        width: 200
      }, {
        prop: 'ownerUserName',
        label: '负责人',
        width: 100
      }, {
        prop: 'module',
        label: '模块',
        width: 100
      }]
    }
  },
  watch: {
    typeSelect() {
      this.searchContent = ''
      this.tableData = null
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.resetData()
    },

    resetData() {
      this.typeSelect = 'name'
      this.searchContent = ''
      this.detailData = null
      this.showData = false
    },

    getList() {
      // var reg = /^1\d{10}$/g
      // if (!this.searchContent) {
      //   return
      // }
      // if (!reg.test(this.searchContent)) {
      //   this.$message({
      //     message: '手机号格式有误',
      //     type: 'error'
      //   })
      //   return
      // }

      const params = {
        customerType: 1,
        limit: 15,
        page: 1,
        search: this.searchContent,
        type: 2,
        overall: '',
        accurate: 'search'
      }

      this.loading = true
      crmCustomerIndex(params).then(res => {
        this.loading = false
        this.detailData = res.data.list[0]
        if (!this.detailData) {
          this.showData = false
        }
        if (this.detailData) {
          this.id = this.detailData.customerId
          this.showData = true
          return
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.duplicate-check {
  position: relative;
  padding: 20px;
  padding-bottom: 40px;

  &__content {
    margin-top: 15px;
  }

  &__footer {
    margin-top: 10px;
    font-size: 12px;
    color: #666;
  }
}

.duplicate-check.show-table {
  padding-bottom: 20px;
}

.el-input {
  /deep/ .el-select .el-input {
    width: 130px;
    /deep/ i {
      font-weight: bold;
    }
  }

  /deep/ .el-input-group__append {
    background-color: $xr-color-primary;
    border-color: $xr-color-primary;
    color: white;

    .el-button {
      /deep/ i {
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
}

.no-data {
  margin-top: 20px;
  text-align: center;
  color:  #C0C4CC;
}
</style>
