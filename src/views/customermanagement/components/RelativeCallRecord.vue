<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <el-table
      v-show="fieldList.length > 0"
      :data="list"
      :height="tableHeight"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;">
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip />
      <el-table-column prop="type" label="通话状态" width="200px">
        <template slot-scope="scope">
          {{ typeArr[scope.row.type] }}-{{ stateArr[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column prop="audio" label="录音播放" width="300px">
        <template slot-scope="scope">
          <audios :item="scope.row"/>
        </template>
      </el-table-column>
      <el-table-column prop="down" label="操作" width="80px">
        <template slot-scope="scope">
          <el-button class="el-button--primary" type="text" @click="download(scope.row.callRecordId, scope.row.fileName)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import { crmCallDownload } from '@/api/businessIntelligence/callCenter'
import { crmCustomerCallRecordAPI } from '@/api/customermanagement/customer'

import Audios from '../../businessIntelligence/components/audios'

// import { downloadFile } from '@/utils'
import { downloadFileWithBuffer } from '@/utils'


export default {
  name: 'RelativeCallRecord', // 相关呼叫记录
  components: {
    Audios
  },
  mixins: [loading],
  props: {
    id: [String, Number],
    crmType: {
      type: String,
      default: ''
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      nopermission: false,
      list: [],
      fieldList: [
        { prop: 'ownerUserName', label: '姓名', width: '115px' },
        { prop: 'createTime', label: '通话时间', width: '115px' },
        { prop: 'number', label: '呼/被叫号码', width: '115px' },
        { prop: 'talkTime', label: '通话时长', width: '115px' },
        { prop: 'dialTime', label: '摘机时长', width: '115px' }
      ],
      tableHeight: '450px',
      stateArr: ['未振铃', '未接通', '接通', '呼入未接通'],
      typeArr: ['呼出', '呼入']
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      this.list = []
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    /**
     * 获取数据
     */
    getDetail() {
      this.loading = true
      crmCustomerCallRecordAPI({
        pageType: 0,
        customerId: this.id
      })
        .then(res => {
          this.nopermission = false
          this.loading = false
          this.list = res.data
        })
        .catch(res => {
          if (res.code == 102) {
            this.nopermission = true
          }
          this.loading = false
        })
    },

    /**
     * 音频下载
     */
    download(id, fileName) {
      // crmCallDownload({ id: id }).then(res => {
      crmCallDownload({ id: id }).then(res => {
        console.log(res)
        // if (res.code !== 500) {
        // // if (res.data && res.data.url) {
        //   // const data = {}
        //   // data.path = res.data.url // 创建下载的链接
        //   // data.name = fileName
        //   // downloadFile(data)
        //   const blob = new Blob([res], {
        //     type: ''
        //   })
        //   downloadFileWithBuffer(blob, fileName || '文件')
        // } else {
        //   this.$message.error('没有录音文件')
        //   return
        // }
        if (res.code && res.code === 500) {
          this.$message.error('没有录音文件')
          return
        } else {
          const blob = new Blob([res], {
            type: ''
          })
          downloadFileWithBuffer(blob, fileName || '文件')
        }
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
