<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="合同管理"
      placeholder="请输入合同编号/姓名/第一联系人电话"
      main-title="新建合同"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!crm.contract.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        @filter="handleFilter"
        @handle="handleHandle"
        @scene="handleScene"/>
      <el-table
        v-loading="loading"
        id="crm-table"
        :row-height="40"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        :header-cell-class-name="headerCellClassName"
        class="n-table--border"
        use-virtual
        stripe
        border
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick"
        @sort-change="sortChange"
        @header-dragend="handleHeaderDragend"
        @selection-change="handleSelectionChange">
        <el-table-column
          show-overflow-tooltip
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :fixed="index==0"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.prop != 'relevanceContractNum'"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'checkStatus'">
              <!-- <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/> -->
              <span>{{ getStatusNames(scope.row.checkStatus) }}</span>
            </template>
            <template v-else-if="item.prop == 'contractStatus'">
              <span>{{ getContractStatus(scope.row.contractStatus) }}</span>
            </template>
            <template v-else-if="item.prop == 'contractCapitalMoney'">
              <span>{{ scope.row.contractType == 1 && scope.row.relevanceContractId && scope.row.relevanceContractId.length ? '' : scope.row.contractCapitalMoney }}</span>
            </template>
            <template v-else-if="item.prop == 'relevanceContractNum'">
              <span v-if="scope.row['relevanceContractNum']">
                <span
                  v-for="(sitem, sindex) in scope.row['relevanceContractNum']"
                  :key="sindex"
                  @click.stop="enterDetail(sitem)">{{ sitem.num }}
                  <span
                    v-if="sindex != scope.row['relevanceContractNum'].length - 1"
                    style="margin-right:10px;">,</span>
                </span>
              </span>
              <span v-else/>
            </template>
            <template v-else>
              {{ fieldFormatter(scope.row, scope.column) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="90" align="center" label="合同预览">
          <template slot-scope="scope">
            <el-button @click="previewCOntract(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="110" align="center" label="电子合同确认">
          <template slot-scope="scope">
            <el-button @click="downBook(scope.row)">签署地址</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="90" align="center" label="电子合同">
          <template slot-scope="scope">
            <el-button @click="downHandle(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column/>
        <el-table-column
          :resizable="false"
          fixed="right"
          width="40">
          <template
            slot="header"
            slot-scope="slot">
            <field-set
              :crm-type="crmType"
              @change="setSave"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          :pager-count="5"
          class="p-bar"
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
          <!-- <span class="money-bar">合同总金额：{{ moneyPageData.contractMoney || 0 | separator }} / 已回款金额：{{ moneyPageData.receivedMoney || 0 | separator }} / 未回款金额：{{ moneyPageData.unReceivedMoney || 0 | separator }}</span> -->
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :click-field="clickField"
      :id="rowID"
      class="d-view"
      @handle="handleHandle"/>

    <el-dialog :visible.sync="outerVisible" title="电子合同确认">
      <div class="btn-wrap">
        <el-input v-model="url"/>
        <el-button type="primary" style="margin: 0 15px;" @click="createCode">扫码</el-button>
        <div :data-clipboard-text="url" class="copy-link copyBtn" @click="copyLink">复制链接</div>
      </div>
      <el-dialog
        :visible.sync="innerVisible"
        width="30%"
        title=""
        append-to-body>
        <div v-loading="load" style="margin: 20px auto;width:150px;height:150px;">
          <div
            id="canvas"
            class="publish-info-content" />
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import { crmAccountWaterDown, generateTemplateAPI } from '@/api/customermanagement/contract'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'

import table from '../mixins/table'
import { floatAdd } from '@/utils'
import moment from 'moment'

export default {
  /** 客户管理 的 合同列表 */
  name: 'ContractIndex',
  components: {
    CRMAllDetail
  },
  mixins: [table],
  data() {
    return {
      crmType: 'contract',
      moneyData: null, // 合同列表金额
      outerVisible: false,
      innerVisible: false,
      url: '',

      load: false,
      qrcode: null,
      row: null,

      // 复制
      clipboard: null
    }
  },
  computed: {
    moneyPageData() {
      // 未勾选展示合同总金额信息
      if (this.selectionList.length == 0) {
        if (this.moneyData) {
          const unReceivedMoney = (this.moneyData.contractMoney - this.moneyData.receivedMoney).toFixed(2)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.moneyData.unReceivedMoney = unReceivedMoney < 0 ? 0 : unReceivedMoney
          return this.moneyData
        }
        return {}
      } else {
        let contractMoney = 0.0
        let receivedMoney = 0.0
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          // 1 审核通过的合同
          if (element.checkStatus == 1) {
            contractMoney = floatAdd(contractMoney, parseFloat(element.money))
            receivedMoney = floatAdd(receivedMoney, parseFloat(element.receivedMoney))
          }
        }

        const unReceivedMoney = (contractMoney - receivedMoney).toFixed(2)
        return {
          contractMoney: contractMoney.toFixed(2),
          receivedMoney: receivedMoney.toFixed(2),
          unReceivedMoney: unReceivedMoney < 0 ? 0 : unReceivedMoney
        }
      }
    }
  },
  mounted() {},
  destroyed() {
    if (this.clipboard) {
      this.clipboard.destroy()
    }
  },
  methods: {
    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'num' ||
        column.property === 'customerName' ||
        column.property === 'leadsNumber' ||
        column.property === 'relevanceContractNum'
      ) {
        return 'can-visit--underline'
      } else if (column.property === 'money') {
        return 'xr-money can-visit--bold'
      } else if (column.property === 'receivedMoney') {
        return 'xr-money green'
      } else if (column.property === 'unreceivedMoney') {
        return 'xr-money red'
      } else {
        return ''
      }
    },

    getStatusNames(status) {
      return {
        0: '待审核',
        1: '通过',
        2: '拒绝',
        3: '审核中',
        4: '撤回',
        5: '未提交',
        6: '创建 ',
        7: '已删除',
        8: '作废',
        9: '家长审核中',
        10: '家长拒绝'
      }[status]
    },

    getContractStatus(status) {
      return {
        1: '申请中',
        2: '放弃',
        3: '合同完成',
        4: '合同变更中',
        5: '执行中',
        6: '草稿',
        7: '合同充值返还',
        8: '确认放弃'
      }[status]
    },

    // 下载电子合同
    downHandle(row) {
      if (!row.flowId) {
        return this.$message.error('该合同暂时没有可以下载的电子审批')
      }
      crmAccountWaterDown({ flowId: row.flowId }).then(res => {
        if (res.data.code == '0') {
          var downloadElement = document.createElement('a')
          downloadElement.href = res.data.fileUrl
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
        } else {
          return this.$message.error(res.data.msg)
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

    downBook(row) {
      this.row = row
      this.url = this.row.url
      if (!this.url) {
        return this.$message.error('该合同暂时没有电子合同确认书')
      }
      this.outerVisible = true
    },

    // 预览与生成合同
    previewCOntract(row) {
      if (row.expirationTime) {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
        const outTime = moment(row.expirationTime)
        const result = moment(currentTime).diff(outTime, 'minutes')
        if (result > 60) {
          this.$message.error('该合同已过期')
        } else {
          window.open(row.queryUrl)
        }
      } else {
        const params = {
          type: row.contractType === 1 && row.relevanceContractId ? 2 : row.contractType === 1 ? 1 : 3,
          contractId: row.contractId
        }
        generateTemplateAPI(params).then(res => {
          if (!res.code) {
            window.open(res.downloadUrl)
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          // this.$message.error('查看失败')
        })
      }
    },

    createCode() {
      this.innerVisible = true
      this.$nextTick(() => {
        this.loading = false
        if (this.qrcode) {
          this.qrcode.clear()
          this.qrcode.makeCode(this.row.url)
        } else {
          this.qrcode = new QRCode(document.getElementById('canvas'), {
            text: this.row.url,
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
          })
        }
      })
    },

    copyLink() {
      if (!this.clipboard) {
        this.clipboard = new Clipboard('.copyBtn')
        this.clipboard.on('success', e => {
          this.$message.success('复制成功')
          e.clearSelection()
        })

        this.clipboard.on('error', e => {
          this.$message.success('复制失败')
        })
      }
    },

    enterDetail(item) {
      this.rowID = item.contractId
      this.rowType = 'contract'
      this.clickField = 'num'
      this.showDview = true
    },

    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'num') {
        return 'header-can-visit-backgroud'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.cstatus-btn {
  color: #2362FB;
  cursor: pointer;
}

.btn-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.copy-link {
  // width: 110px;
  line-height: 30px;
  white-space: nowrap;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
  background: rgb(242, 242, 242);
  cursor: pointer;
  border-radius: 4px;
}

/deep/ .el-dialog {
  width: 450px;
}
</style>
