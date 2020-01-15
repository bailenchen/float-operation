<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      :title="title"
      append-to-body
      width="580px">
      <div v-if="!showRepeat">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-position="left">
          <el-form-item>
            <el-input v-model="form.title" placeholder="请输入日程安排" class="input_one"/>
          </el-form-item>
          <el-form-item label="日历类型" prop="typeId">
            <div class="color_change">
              <span :style="{backgroundColor: colorItem}" class="custom_left"/>
            </div>
            <el-select
              v-model="form.typeId"
              placeholder="选择日历类型"
              class="select_color">
              <el-option
                v-for="item in cusCheck"
                v-if="item.type == 2"
                :key="item.typeId"
                :value="item.typeId"
                :label="item.typeName"
                @click.native="changeType(item)">
                <span :style="{backgroundColor: item.color}" class="custom_left"/>
                <span class="custom_right">{{ item.typeName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="form.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="参与人员">
            <xh-user-cell
              :value="checkedUser"
              :radio="false"
              @value-change="selectUser"/>
          </el-form-item>
          <el-form-item v-if="!choseMore" style="margin-top: -10px">
            <el-button
              style="font-size: 14px"
              type="text"
              @click="choseMore = true">添加更多选项</el-button>
          </el-form-item>
          <template v-if="choseMore">
            <el-form-item v-if="editAll" label="重复">
              <el-select
                v-model="form.repetitionType"
                placeholder="选择重复类型">
                <el-option
                  v-for="item in repeatList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click.native="selectRepeat"/>
              </el-select>
            </el-form-item>
            <template v-for="(noticeItem,index) in notice">
              <el-form-item :key="index" label="提前">
                <el-select v-model="notice[index].value" placeholder="选择时间" class="time_select">
                  <el-option
                    v-for="item in timeList"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>
                <el-select v-model="notice[index].type" placeholder="请选择" class="time_select">
                  <el-option :value="1" label="分钟"/>
                  <el-option :value="2" label="小时"/>
                  <el-option :value="3" label="天"/>
                </el-select>
                <el-button
                  v-if="index != 0"
                  icon="el-icon-delete"
                  type="text"
                  @click="deleteNotice(index)"/>
              </el-form-item>
            </template>
            <div class="new_notice" @click="addNewNotice">+ 添加新提醒</div>
            <el-form-item label="相关信息">
              <related-business
                :is-task="true"
                :all-data="allData"
                show-foot
                margin-left="80px"
                @unbind="unbindRelatedInfo"
                @checkInfos="checkInfos"/>
            </el-form-item>
          </template>
          <el-form-item v-if="choseMore" style="margin-top: -10px">
            <el-button style="font-size: 14px" type="text" @click="choseMore = false">隐藏更多选项</el-button>
          </el-form-item>
        </el-form>
      </div>
      <repeat
        v-else
        ref="repeat"
        :detail="todayDetailData"
        :repeat-type="form.repetitionType"
        margin-left="80px"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure">确 定</el-button>
        <el-button @click="cancle">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import XhUserCell from '@/components/CreateCom/XhUserCell'
import RelatedBusiness from '@/components/relatedBusiness'
import Repeat from './Repeat'
import {
  canlendarSaveAPI,
  canlendarUpdateAPI
} from '@/api/calendar'
export default {
  components: {
    XhUserCell,
    RelatedBusiness,
    Repeat
  },
  props: {
    showCreate: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增日程'
    },
    selectDiv: {
      type: String,
      default: ''
    },
    colorList: {
      type: Array,
      default: () => {
        return []
      }
    },
    cusCheck: {
      type: Array,
      default: () => {
        return []
      }
    },
    todayDetailData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否编辑所有的系列
    editAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      // 是否展示按日期重复的dialog
      showRepeat: false,
      repeatForm: {},
      form: {
        title: '',
        typeId: 1, // 日历类型
        ownerUserIds: 0,
        repetitionType: '',
        startTime: '',
        endTime: ''
      },
      notice: [
        {
          value: 5,
          type: 1
        }
      ],
      // 选中的关联项
      allData: {},
      businessRelation: {},
      // 选中的类型对应的颜色在颜色数组中的位置
      colorItem: '',
      choseMore: false,
      // 选中的参与人员
      checkedUser: [],
      repeatList: [
        { label: '从不重复', value: 1 },
        { label: '每天', value: 2 },
        { label: '每周', value: 3 },
        { label: '每月', value: 4 },
        { label: '每年', value: 5 }
      ],
      timeList: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      rules: {
        type: [
          { required: true, message: '请选择日历类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    showCreate(val) {
      this.visible = val
      if (val) {
        this.form = {
          title: '',
          typeId: 1, // 日历类型
          ownerUserIds: 0,
          repetitionType: '',
          startTime: '',
          endTime: ''
        }
        this.checkedUser = []
        if (this.selectDiv) {
          this.form.startTime = this.selectDiv + ' 08:00:00'
        } else {
          this.form.startTime = ''
        }
        this.getDetail()
        this.choseMore = false
      }
    },

    allData: {
      handler(val) {
        Object.keys(val).forEach(key => {
          const list = this.allData[key] || []
          const ids = []
          list.forEach(item => {
            ids.push(item[key + 'Id'])
          })
          this.businessRelation[key + 'Ids'] = ids.join(',')
        })
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 关闭
     */
    beforeClose(done) {
      if (this.showRepeat) {
        this.showRepeat = false
        return
      } else {
        this.$emit('close')
        done()
      }
    },

    /**
     * 详情
     */
    getDetail() {
      const length = Object.keys(this.todayDetailData).length
      if (length !== 0) {
        this.form = {
          title: this.todayDetailData.title,
          typeId: this.todayDetailData.typeId, // 日历类型
          ownerUserIds: this.todayDetailData.ownerUserIds,
          repetitionType: this.todayDetailData.repetitionType || '',
          startTime: this.todayDetailData.startTime || '',
          endTime: this.todayDetailData.endTime || '',
          eventId: this.todayDetailData.eventId,
          batchId: this.todayDetailData.batchId
        }
        this.allData = {
          customer: this.todayDetailData.customerList,
          contacts: this.todayDetailData.contactsList,
          contract: this.todayDetailData.contractList,
          business: this.todayDetailData.businessList
        }
        this.notice = this.todayDetailData.noticeList
        this.form.repeatTime = this.todayDetailData.repeatTime
        this.form.repeatRate = this.todayDetailData.repeatRate
        this.form.endType = this.todayDetailData.endType || ''
        this.checkedUser = this.todayDetailData.ownerUserList
        this.cusCheck.forEach(item => {
          if (item.typeId === this.form.typeId) {
            this.colorItem = item.color
            return
          }
        })
      } else {
        this.colorItem = this.cusCheck[0].color
        this.form.typeId = this.cusCheck[0].typeId
        this.businessRelation = []
      }
    },
    /**
     * 选择类型
     */
    changeType(data) {
      this.colorItem = data.color
    },

    /**
     * 选择员工
     */
    selectUser(data) {
      this.checkedUser = data.value
      if (data.value.length) {
        this.form.ownerUserIds = data.value.map(item => {
          return item.userId
        }).join(',')
      } else {
        this.form.ownerUserIds = ''
      }
    },

    /**
     * 选中的关联信息
     */
    checkInfos(dataIds, data) {
      this.allData = data
      console.log(this.allData, dataIds)
      Object.keys(dataIds).forEach(key => {
        this.businessRelation[key] = dataIds[key].length ? dataIds[key].join(',') : ''
      })
      this.businessRelation = JSON.parse(JSON.stringify(this.businessRelation))
      console.log(this.businessRelation)
    },

    /**
     * 解绑详情信息
     */
    unbindRelatedInfo(field, item, index) {
      this.$confirm('确认取消关联?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          const tempRelatedListData = JSON.parse(JSON.stringify(this.allData))
          tempRelatedListData[field].splice(index, 1)
          this.allData = tempRelatedListData
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },

    /**
     * 选择重复类型
     */
    selectRepeat(data) {
      this.showRepeat = true
    },

    /**
     * 取消
     */
    cancle() {
      if (this.showRepeat) {
        this.showRepeat = false
        this.repeatForm = {}
      } else {
        this.form = {}
        this.$emit('close')
      }
    },

    /**
     * 确定
     */
    sure() {
      if (this.showRepeat) {
        this.repeatForm = this.$refs.repeat.form
        if (this.$refs.repeat.endDate) {
          this.repeatForm.endTypeConfig = this.$refs.repeat.endDate
        } else {
          this.repeatForm.endTypeConfig = this.$refs.repeat.endCount
        }
        this.form = {
          ...this.form,
          ...this.repeatForm
        }
        this.showRepeat = false
      } else {
        this.createSchedule()
      }
    },

    /**
     * 新建/编辑日程
     */
    createSchedule() {
      const params = { }
      if (Object.keys(this.businessRelation).length) {
        params.relation = this.businessRelation
      }
      const length = Object.keys(this.todayDetailData).length
      const request = this.getRequest()
      params.notice = this.notice
      params.event = {
        ...this.form
      }
      if (length) {
        params.time = new Date(this.todayDetailData.startTime).getTime()
        if (this.editAll) {
          params.type = 3
        } else {
          params.type = 2
          params.event.repetitionType = 1
        }
      }

      request(params).then(res => {
        this.$message.success('新建或编辑日程成功')
        this.$emit('createSuccess')
      }).catch(() => {})
    },

    /**
     * 获取请求
     */
    getRequest() {
      const length = Object.keys(this.todayDetailData).length
      if (length) {
        return canlendarUpdateAPI
      } else {
        return canlendarSaveAPI
      }
    },

    /**
     * 添加新提醒
     */
    addNewNotice() {
      this.notice.push({
        value: '',
        type: ''
      })
    },

    /**
     * 删除提醒
     */
    deleteNotice(index) {
      this.notice.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.el-dialog{
  .el-dialog__body{
    padding: 25px;
    max-height: 600px;
    overflow-y: auto;
    .input_one{
     /deep/.el-input__inner{
       width: 510px !important;
      }
    }
    .el-form{
      .el-form-item{
        margin-bottom: 12px;
       .el-input__inner{
        width: 430px;
      }
        .el-form-item__label{
          font-size: 14px;
          color: #333;
          padding: 0px;
          letter-spacing: 1px;
          width: 80px;
          position: relative;
        }
        .el-form-item__label::before{
           position: absolute;
           left: -5px;
           top: -2px;
        }
        .select_color{
          .el-input__inner{
            padding-left: 32px;
          }
        }
      }
      .time_select{
        margin-right: 20px;
        .el-input__inner{
            width: 162px;
          }
      }
    }
  }
}
.custom_left{
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  vertical-align: sub;
  margin-right: 10px;
}
.custom_right{
  display: inline-block;
  height: 20px;
  line-height: 20px;
}
.color_change{
  position: absolute;
  top: -1px;
  left: 91px;
  z-index: 1;
}
/deep/.user-container{
  width: 430px;
}
/deep/.add-btn{
  height: 34px;
  line-height: 28px;
}
/deep/.cell{
  height: 40px;
}
/deep/.related-business{
  margin-top: -5px;
}
/deep/.el-icon-delete{
  color: #333;
}
.new_notice{
  color: #2362FB;
  padding-left: 80px;
  padding-bottom: 10px;
  cursor: pointer;
}
</style>

