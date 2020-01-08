<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="950px"
    @close="close">
    <div slot="title">
      <span :style="{backgroundColor: todayDetailData.backgroundColor}" class="block"/>
      <span class="title-text">{{ todayDetailData.title }}</span>
      <span class="title-message">{{ todayDetailData.name }}创建于{{ todayDetailData.createTime }}
        <el-dropdown
          trigger="click"
          @command="handleTypeDrop">
          <el-button icon="el-icon-more"/>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in moreTypes"
              :key="index"
              :command="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <template v-if="todayDetailData.groupId == 0">
      <el-table
        v-loading="loading"
        id="crm-table"
        :data="list"
        height="500"
        class="n-table--border"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick">
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="fieldFormatter"
          show-overflow-tooltip/>
        <el-table-column :resizable="false"/>
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
    </template>
    <template v-else>
      <div class="common-box">
        <div class="common-title">{{ todayDetailData.title }}</div>

        <flexbox class="common-header">
          <flexbox class="header-left">
            <span class="time-circle">
              <span class="wk wk-l-time"/>
            </span>

            <div class="time-text">
              <div class="text-up">{{ formattedTime(todayDetailData.startTime) }}</div>
              <div class="time-time">开始时间</div>
            </div>
          </flexbox>

          <flexbox class="header-right">
            <i class="el-icon-remove"/>
            <div class="time-text">
              <div class="text-up">{{ formattedTime(todayDetailData.endTime) }}</div>
              <div class="time-time">结束时间</div>
            </div>
          </flexbox>
        </flexbox>

        <div class="common-content">
          <div class="content-title">参与人</div>
          <flexbox>
            <xr-avatar
              :id="166"
              :size="32"
              :disabled="false"
              name="侯沛源"
              src=""
              trigger="hover"
              class="user-img"/>
            <xr-avatar
              :id="167"
              :size="32"
              :disabled="false"
              name="申月"
              src=""
              trigger="hover"
              class="user-img"/>
          </flexbox>
        </div>

        <div class="common-foot">
          <div class="section__hd">
            <i class="wukong wukong-relevance" />
            <span>相关信息(1)</span>
          </div>

          <div class="section_scroll">
            <div>
              <related-business-cell
                v-for="(item, itemIndex) in items"
                :data="item"
                :cell-index="itemIndex"
                :key="itemIndex"
                :show-foot="false"
                type="customer"
                @click.native="checkRelatedDetail(key, item)" />
            </div>
          </div>

        </div>

        <div class="common-bootom">
          <span>重复</span>
          <span>每1天重复2次</span>
        </div>
      </div>
    </template>
    <create-event
      :show-create="showCreate"
      title="编辑日程"
      @handleSure="handleSure"
      @close="showCreate = false"/>
  </el-dialog>
</template>
<script>
import {
  filedGetTableField
} from '@/api/customermanagement/common'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import {
  crmMessageTodayCustomerAPI
} from '@/api/customermanagement/message'
import RelatedBusinessCell from '@/views/OAManagement/components/relatedBusinessCell'
import CreateEvent from './CreateEvent'
import moment from 'moment'
export default {
  name: 'TodayListDetail',
  components: {
    RelatedBusinessCell,
    CreateEvent
  },
  props: {
    showTodayDetail: {
      type: Boolean,
      default: false
    },
    todayDetailData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      fieldList: [],
      list: [],
      loading: false,
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      items: [
        { customerName: '侯沛源' },
        { customerName: '侯沛源' },
        { customerName: '侯沛源' },
        { customerName: '侯沛源' },
        { customerName: '侯沛源' },
        { customerName: '侯沛源' },
        { customerName: '申月' }
      ],
      total: 0,
      moreTypes: ['删除', '编辑'],
      showCreate: false
    }
  },
  computed: {
    crmType() {
      const crmTypeList = ['customer', 'contract', 'receivables']
      return crmTypeList[this.todayDetailData.groupId]
    },
    infoType() {
      const typeList = ['todayCustomer', 'todayContract', 'todayReceivables']
      return typeList[this.todayDetailData.groupId]
    }
  },
  watch: {
    showTodayDetail(val) {
      this.dialogVisible = val
      if (val) {
        if (this.todayDetailData.groupId == 0) {
          this.getFieldList()
        }
      }
    }
  },
  methods: {
    /**
     * 获取表头
     */
    getFieldList() {
      this.loading = true
      filedGetTableField({
        label: crmTypeModel[this.crmType]
      })
        .then(res => {
          this.handelFieldList(res.data)

          // 获取好字段开始请求数据
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 获取宽度
     */
    handelFieldList(list) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        var width = 0
        if (!element.width) {
          if (element.name && element.name.length <= 6) {
            width = element.name.length * 15 + 45
          } else {
            width = 140
          }
        } else {
          width = element.width
        }

        this.fieldList.push({
          prop: element.fieldName,
          label: element.name,
          width: width
        })
      }
    },

    /**
     * 获取列表
     */
    getList() {
      var crmIndexRequest = this.getIndexRequest()
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        isSub: 1,
        type: 1
      }
      crmIndexRequest(params)
      this.loading = true
        .then(res => {
          this.list = res.data.list
          this.total = res.data.totalRow
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 获取列表请求
     */
    getIndexRequest() {
      return {
        'todayCustomer': crmMessageTodayCustomerAPI
      }[this.infoType]
    },

    /**
     * 关闭
     */
    close() {
      this.$emit('close')
    },

    /**
     * 数据格式化
     */
    fieldFormatter() {},

    /**
     * 行点击
     */
    handleRowClick() {},

    /**
     * 每页条数改变
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    /**
     * 页数改变
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    /**
     * 时间格式化
     */
    formattedTime(date) {
      const timestemp = new Date(date)
      return moment(timestemp).format('MMMDo')
    },

    /**
     * 相关信息的点击
     */
    checkRelatedDetail() {},

    /**
     * 更多操作
     */
    handleTypeDrop(command) {
      if (command === '删除') {
        this.delete()
      } else if (command === '编辑') {
        this.edit()
      }
    },

    /**
     * 删除
     */
    delete() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * 编辑
     */
    edit() {
      this.showCreate = true
    },

    /**
     * 编辑成功的回调
     */
    handleSure() {}
  }
}
</script>
<style lang="scss" scoped>
.block{
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 4px;
}
/deep/.el-dialog__header{
  line-height: 20px;
  padding-bottom: 0px;
}
.title-text{
  font-size: 12px;
  font-weight: bolder;
}
.title-message{
  font-size: 12px;
  color: #999;
  width: 230px;
  float: right;
  /deep/.el-dropdown-selfdefine{
    padding: 0px;
    margin-left: 32px;
    border: none;
  }
}
.common-box{
  width: 100%;
  height: 438px;
  .common-title{
    font-size: 22px;
    width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 20px;
    color: #333;
  }
  .common-header{
    padding-left: 50px;
    padding-top: 30px;
    .time-text{
      margin-left: 11px;
      .text-up{
        color: #333;
        font-size: 18px;
        padding-bottom: 5px;
      }
      .time-time{
        color: #999;
        font-size: 12px;
      }
    }
     .time-circle{
       display: inline-block;
       width: 32px;
       height: 32px;
       border-radius: 50%;
       background-color: #F7AD3D;
       padding-left: 9px;
       line-height: 30px;
     .wk{
       color: #fff;
       }
    }
     /deep/.el-icon-remove{
    font-size: 32px;
    color: #F56C6C;
    }
  }
  .common-content{
    padding-left: 50px;
    padding-top: 30px;
    .content-title{
      color: #999;
      font-size: 12px;
      margin-bottom: 17px;
    }
    .user-img{
      margin-right: 11px;
    }
  }
  .common-foot{
     padding-left: 50px;
     padding-top: 30px;
     .section__hd{
       color: #333;
       font-size: 16px;
       font-weight: bolder;
       margin-bottom: 20px;
     }
     .section_scroll{
       width: 854px;
       height: 100px;
       overflow-y: auto;
     }
  }
  .common-bootom{
     padding-left: 50px;
     padding-top: 30px;
     color: #999;
     font-size: 12px;
     position: absolute;
     bottom: 18px;
     span{
       padding-right: 20px;
       display: inline-block;
     }
  }
}
/deep/.el-icon-more{
  color: #666;
  font-size: 16px;
}
/deep/.el-dialog__close{
  color: #666;
}
/deep/.el-dialog__body{
  padding: 20px 0px 0px;
}
/deep/.p-contianer .p-bar{
  margin-right: 25px
}
</style>
