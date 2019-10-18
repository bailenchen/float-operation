<template>
  <div
    v-infinite-scroll="getList"
    class="main"
    infinite-scroll-disabled="scrollDisabled">
    <div class="work-log scroll-body">
      <flexbox class="hello-card card">
        <div
          v-photo="userInfo"
          v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img)"
          :key="userInfo.img"
          class="user-img div-photo"/>

        <div class="greeting">
          <div class="hello">
            {{ headData.timeLabel }}，{{ nickName }}
            <span class="status">
              <span :class="userDoneStatus.icon" class="icon wk" />
              <span>{{ userDoneStatus.label }}</span>
            </span>
          </div>
          <div class="text">
            {{ headData.timeRemind }}
          </div>
        </div>

        <div class="statistics">
          <div class="title">
            <!-- <span class="icon wk wk-task" /> -->
            <span>本月完成日志</span>
          </div>
          <div class="info">
            <span class="special">{{ headData.allNum }}</span>篇
          </div>

        </div>
      </flexbox>

      <create-log v-if="showAdd" class="add-card card" @update="addLogSuccess" />

      <flexbox class="filter-control card">
        <xh-user-cell
          v-if="showUserSelect"
          :radio="false"
          class="xh-user-cell"
          placeholder="选择人员"
          @value-change="userChange" />
        <el-date-picker
          v-model="filterForm.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="提交时间" />
        <el-select
          v-model="filterForm.categoryId"
          placeholder="类型">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </flexbox>
    </div>

    <div class="work-log">
      <div
        v-for="(item, index) in listData"
        :key="index"
        class="card">
        <log-item
          :data="item"
          :index="index"
          @read="handleRead(index)"
          @add-comment="handleAddComment"
          @delete="handleDelete"
          @edit="handleEdit"
          @relate-detail="enterRelateDetail" />
      </div>
    </div>
    <p
      v-if="loading"
      class="scroll-bottom-tips">加载中...</p>
    <p
      v-if="noMore"
      class="scroll-bottom-tips">没有更多了</p>

    <c-r-m-all-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :id="relatedID"
      :no-listener-class="['content-item']" />

    <new-dialog
      v-if="showNewDialog"
      :form-data="formData"
      :img-file-list="imgFileList"
      :accessory-file-list="accessoryFileList"
      :new-loading="newLoading"
      dialog-title="编辑日志"
      @close="showNewDialog = false"
      @submitBtn="submitEdit" />
  </div>
</template>

<script>
import { journalList, journalEdit, journalQueryBulletinAPI } from '@/api/oamanagement/journal'

import { mapGetters } from 'vuex'
import moment from 'moment'

import LogItem from './components/logItem'
import CreateLog from './components/createLog'
import XhUserCell from '@/components/CreateCom/XhUserCell'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import newDialog from '@/views/OAManagement/journal/newDialog'

export default {
  name: 'WorkLog',
  components: {
    LogItem,
    CreateLog,
    XhUserCell,
    CRMAllDetail,
    newDialog
  },
  data() {
    return {
      logType: '', // all send 我发出的 received 我收到的
      // 头部信息
      headData: {
        nowNum: 0,
        allNum: 0,
        timeLabel: '',
        timeRemind: ''
      },

      listData: [],
      loading: false, // loading
      noMore: false,
      page: 1,

      options: [
        { label: '全部', value: 0 },
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 }
      ],

      filterForm: {
        categoryId: 0,
        createUserId: ''
      },

      // 相关详情的查看
      relatedID: '',
      relatedCRMType: '',
      showRelatedDetail: false,

      // 编辑
      newLoading: false,
      showNewDialog: false,
      formData: {},
      imgFileList: [],
      accessoryFileList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),

    showUserSelect() {
      return this.logType != 'send'
    },

    showAdd() {
      return this.logType != 'received'
    },

    userDoneStatus() {
      return {
        icon: this.headData.nowNum > 0 ? 'wk-success' : 'wk-close',
        label: this.headData.nowNum > 0 ? '今天日志已完成' : '今天日志还未完成'
      }
    },

    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    },

    nickName() {
      if (!this.userInfo.realname) return this.userInfo.username
      const reg = /[a-zA-Z]+/
      if (reg.test(this.userInfo.realname) || !this.userInfo.sex) {
        return this.userInfo.realname
      }
      return this.userInfo.realname.slice(0, 1) + this.userInfo.sex === 1 ? '先生' : '女士'
    }
  },
  watch: {
    filterForm: {
      handler() {
        this.refreshList()
      },
      deep: true
    }
  },
  created() {
    this.logType = this.$route.params.type
    this.getLogRemind()
    this.getHeadDetail()
  },

  beforeRouteUpdate(to, from, next) {
    this.logType = to.params.type
    this.filterForm = {
      categoryId: 0,
      createUserId: ''
    }
    this.refreshList()
    next()
  },
  methods: {
    /**
     * 获取概要
     */
    getHeadDetail() {
      journalQueryBulletinAPI().then(res => {
        this.headData.nowNum = res.data.nowNum
        this.headData.allNum = res.data.allNum
      }).catch(() => {

      })
    },

    getLogRemind() {
      const hour = moment().format('H')
      if (hour < 12) {
        const num = Math.floor(Math.random() * 6)
        this.headData.timeLabel = '早上好'
        this.headData.timeRemind = [
          '给自己一个微笑，告诉自己今天会更美好',
          '生命的意义在于和别人的不同之处',
          '美丽的早晨，灿烂的你，美好的一天在等你',
          '暖暖的阳光照，柔柔的轻风笑，绵绵的岁月长，真真的祝福到',
          '美好的一天开始了，每天给自己一个希望',
          '蓝天是宁静的，空气是清新的，阳光是明媚的'
        ][num]
      } else if (hour < 18) {
        const num = Math.floor(Math.random() * 6)
        this.headData.timeLabel = '下午好'
        this.headData.timeRemind = [
          '认真对待工作，终有一天，你的每一份努力，都将绚烂成花',
          '通过辛勤的工作获得的财富才是人生的大快事',
          '生命之中总是有太多的感动，难忘的是你灿烂的笑容',
          '努力工作，永远不要向命运低头，不要向生活妥协',
          '生命，是一树花开，或安静或热烈',
          '人生，最快乐的莫过于奋斗'
        ][num]
      } else {
        const num = Math.floor(Math.random() * 5)
        this.headData.timeLabel = '晚上好'
        this.headData.timeRemind = [
          '工作一天辛苦了，这世界不会辜负每一份努力和坚持',
          '无须缅怀昨天，不必奢望明天，只要认真过好每个今',
          '每一份坚持都是成功的累积，相信自己，总会遇到惊喜',
          '不要失去希望，你永远不知道明天会带来什么',
          '工作一天辛苦了，人生，最快乐的莫过于奋斗'
        ][num]
      }
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.listData = []
      this.noMore = false
    },

    /**
     * 获取日志列表
     */
    getList(action = null) {
      if (this.loading) return
      this.loading = true
      const params = {
        page: this.page,
        limit: 5,
        ...this.filterForm
      }

      if (this.logType != 'all') {
        params.by = {
          send: 1,
          received: 2
        }[this.logType]
      }

      if (this.logType == 'send' && params.hasOwnProperty('createUserId')) {
        delete params.createUserId
      }

      if (params.hasOwnProperty('categoryId') && params.categoryId === 0) {
        delete params.categoryId
      }

      journalList(params).then(res => {
        this.loading = false
        if (!this.noMore) {
          this.listData = this.listData.concat(res.data.list)
          this.page++
        }
        this.noMore = res.data.lastPage
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 添加回复
     */
    handleAddComment(data) {
      this.listData[data.index].replyList.unshift(data.data)
    },

    /**
     * 日志删除
     * @param index {number}
     */
    handleDelete(index) {
      this.listData.splice(index, 1)
      this.getHeadDetail()
    },

    /**
     * 日志添加成功
     */
    addLogSuccess() {
      this.refreshList()
      this.headData.nowNum++
      this.headData.allNum++
    },

    /**
     * 日志编辑
     * @param index {number}
     */
    handleEdit(index, data) {
      this.formData = data
      this.imgFileList = data.img
      // 附件
      this.accessoryFileList = data.file
      // 员工部门赋值
      this.formData.depData = data.sendDeptList ? data.sendDeptList : []
      this.formData.sentWhoList = data.sendUserList ? data.sendUserList : []
      this.showNewDialog = true
    },

    /**
     * 编辑提交
     */
    submitEdit(key, batchId, relevanceAll) {
      this.newLoading = true
      // 获取部门
      const dep = []
      if (this.formData.depData) {
        for (const j of this.formData.depData) {
          dep.push(j.id)
        }
      }
      // 获取员工
      const staff = []
      if (this.formData.sentWhoList) {
        for (const h of this.formData.sentWhoList) {
          staff.push(h.userId)
        }
      }

      const pramas = {
        logId: this.formData.logId,
        categoryId: key,
        content: this.formData.content,
        tomorrow: this.formData.tomorrow,
        question: this.formData.question,
        batchId: batchId,
        sendUserIds: staff.join(','),
        sendDeptIds: dep.join(','),
        customerIds: relevanceAll.customerIds.join(','),
        contactsIds: relevanceAll.contactsIds.join(','),
        businessIds: relevanceAll.businessIds.join(','),
        contractIds: relevanceAll.contractIds.join(',')
      }
      journalEdit(pramas)
        .then(res => {
          this.showNewDialog = false
          this.refreshList()
          this.$message.success('编辑成功')
          this.newLoading = false
        })
        .catch(() => {
          this.newLoading = false
          this.$message.error('编辑失败')
        })
    },

    /**
     * 日志已读
     * @param index
     */
    handleRead(index) {
      this.listData[index].isRead = 1
    },

    /**
     * 筛选条件人员选择
     */
    userChange(data) {
      if (data.value.length > 0) {
        this.filterForm.createUserId = data.value.map(item => {
          return item.userId
        }).join(',')
      } else {
        this.filterForm.createUserId = ''
      }
    },

    /**
     * 进入相关详情
     */
    enterRelateDetail(type, data) {
      this.relatedID = data[`${type}Id`]
      this.relatedCRMType = type
      this.showRelatedDetail = true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
