<template>
  <!-- <div class="particulars-common"> -->
  <transition name="slide-fade">
    <el-card
      v-loading="loading"
      :style="{ 'z-index': zIndex }"
      class="particulars-common"/>
  </transition>
  <!-- </div> -->
</template>

<script type="text/javascript">
import {
  editTask,
  editTaskRelation,
  deleteTask,
  detailsTask,
  readLoglist
} from '@/api/oamanagement/task'
import {
  setCommentAPI,
  deleteCommentAPI,
  queryCommentListAPI
} from '@/api/oamanagement/common'
import { crmFileSave } from '@/api/common'

import membersDep from '@/components/selectEmployee/membersDep'
import tagIndex from './tag/tagIndex'
import subTask from './subTask'
// emoji
import xss from 'xss'
import emoji from '@/components/emoji'
// 相关信息 - 选中列表
import relatedBusiness from '@/components/relatedBusiness'
import XhUser from '@/components/CreateCom/XhUser'
import FileCell from '@/views/OAManagement/components/fileCell'
import CRMFullScreenDetail from '@/views/customermanagement/components/CRMFullScreenDetail'
import { mapGetters } from 'vuex'
import { getMaxIndex } from '@/utils'

export default {
  components: {
    membersDep,
    emoji,
    relatedBusiness,
    XhUser,
    tagIndex,
    CRMFullScreenDetail,
    subTask,
    FileCell
  },
  props: {
    id: [String, Number],
    detailIndex: Number,
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zIndex: getMaxIndex(),
      // 评论 - 活动
      // 评论 - 活动显示的内容
      commentsActivities: true,
      // 评论框
      commentsTextarea: '',
      // 回复
      childCommentsTextarea: '',
      // 评论 - 是否弹出表情
      // 回复的一行用户数据
      replyChildComment: null, // 被评论对象
      replyChildIndex: -1, // -1 是主评论 0以上为子评论
      contentLoading: false, // 回复按钮loading
      commentsPopover: false,
      // 回复弹出框
      childCommentsPopover: false,
      // 紧急弹出框
      priorityVisible: false,
      // 优先级列表
      particularsList: [
        { id: 3, label: '高', color: '#ED6363' },
        { id: 2, label: '中', color: '#FF9668' },
        { id: 1, label: '低', color: '#8bb5f0' },
        { id: 0, label: '无', color: '#ccc' }
      ],
      // 是否显示子任务
      addSubtasks: true,
      // 任务名称和编辑切换
      nameVinput: false,
      // 任务名
      taskDataName: '',
      // 是否显示描述
      addDescriptionShow: false,
      // 描述内容
      addDescriptionTextarea: '',
      // 子任务进度
      subTaskProgress: 0,
      blurIndex: 0,
      // 是否显示评论框
      addComments: false,
      allData: {},
      isComment: true,
      commentsLoading: false,
      // 相关详情的查看
      relatedID: '',
      relatedCRMType: '',
      showRelatedDetail: false,
      // 子任务ID
      subTaskID: null,
      // 任务详情
      loading: false,
      taskData: null,
      activityList: [],
      fileList: [],
      // 评论列表
      replyList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    id: function(val) {
      this.initInfo()
      this.getDetail()
      this.getActivityList()
      this.getCommentList()
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
    if (this.id) {
      this.getDetail()
      this.getActivityList()
      this.getCommentList()
    }
  },

  beforeDestroy() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    initInfo() {
      this.taskData = null
      this.subTaskProgress = 0
      // 设置关联项列表
      this.allData = {
        business: [],
        contacts: [],
        contract: [],
        customer: []
      }

      this.taskData = null
      this.activityList = []
      this.fileList = []
    },
    // 基础详情
    getDetail() {
      this.loading = true
      detailsTask({ taskId: this.id })
        .then(res => {
          const taskData = res.data
          taskData.checked = taskData.status == 5

          if (taskData.childTask) {
            for (const item of taskData.childTask) {
              if (item.status == 5) {
                item.checked = true
                this.subTaskProgress++
              } else {
                item.checked = false
              }
            }
          }
          this.fileList = res.data.file
          this.allData = {
            business: taskData.businessList || [],
            contacts: taskData.contactsList || [],
            contract: taskData.contractList || [],
            customer: taskData.customerList || []
          }
          this.taskData = taskData
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.closeBtn()
        })
    },
    // 获取活动信息
    getActivityList() {
      readLoglist({
        taskId: this.id
      })
        .then(res => {
          this.activityList = res.data
        })
        .catch(() => {})
    },

    // 获取评论信息
    getCommentList() {
      queryCommentListAPI({
        typeId: this.id,
        type: 1 // 任务1 日志2
      })
        .then(res => {
          this.replyList = res.data
        })
        .catch(() => {})
    },

    // 主题勾选
    titleCheckbox(val) {
      this.taskData.checked = val
      editTask({
        taskId: this.id,
        status: this.taskData.checked ? 5 : 1
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'title-check',
            value: val,
            index: this.detailIndex
          })
          this.$store.dispatch('GetOAMessageNum', 'task')
        })
        .catch(() => {
          this.$emit('on-handle', {
            type: 'title-check',
            value: !this.taskData.checked,
            index: this.detailIndex
          })
          this.taskData.checked = !this.taskData.checked
        })
    },
    closeBtn() {
      this.$emit('close')
    },
    // 评论 - 活动 切换功能
    footerTitle(key) {
      switch (key) {
        case 0:
          this.commentsActivities = true
          this.isComment = true
          break
        case 1:
          this.commentsActivities = false
          this.isComment = false
          break
      }
    },
    // 紧急按钮
    priorityBtn(value, def) {
      this.taskData.priority = value.id
      editTask({
        taskId: this.id,
        priority: value.id
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'change-priority',
            value: value,
            index: this.detailIndex
          })
          this.priorityVisible = false
        })
        .catch(() => {
          this.$message.error('编辑失败')
          this.taskData.priority = def
        })
    },
    // 更多 ———— 删除和规定按钮
    moreDelete() {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          deleteTask({
            taskId: this.id
          })
            .then(res => {
              this.$message.success('删除成功')
              this.$emit('on-handle', {
                type: 'delete',
                index: this.detailIndex
              })
              this.$emit('close')
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 附件 -- 上传
    httpRequest(val) {
      crmFileSave({
        file: val.file,
        batchId: this.taskData.batchId
      })
        .then(res => {
          this.fileList.push(res)
          // this.$emit('httpRequest', this.taskData)
          this.$message.success('上传成功')
        })
        .catch(() => {})
    },
    // 附件删除
    accessoryDeleteFun(index, item) {
      this.fileList.splice(index, 1)
    },
    // 子任务添加
    addSubtasksBtn() {
      this.addSubtasks = !this.addSubtasks
    },
    // 子任务 -- 勾选
    subtasksCheckbox(val, e) {
      if (e) {
        this.$set(val, 'checked', true)
        this.subTaskProgress++
      } else {
        this.$set(val, 'checked', false)
        this.subTaskProgress--
      }
      this.$emit('on-handle', {
        type: 'change-sub-task',
        value: {
          subdonecount: this.subTaskProgress,
          allcount: this.taskData.childTask.length
        },
        index: this.detailIndex
      })
      editTask({
        taskId: val.taskId,
        status: e ? 5 : 1
      })
        .then(res => {})
        .catch(() => {
          this.$message.error('子任务标记失败')
          if (e) {
            this.$set(val, 'checked', false)
            this.subTaskProgress--
          } else {
            this.$set(val, 'checked', true)
            this.subTaskProgress++
          }
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskProgress,
              allcount: this.taskData.childTask.length
            },
            index: this.detailIndex
          })
          // this.$emit('', val, e)
        })
    },
    /**
     * 参与人操作
     */
    // 提交按钮
    editOwnerList(users, dep) {
      this.taskData.ownerUserList = []
      editTask({
        taskId: this.id,
        ownerUserId: users
          .map(item => {
            return item.userId
          })
          .join(',')
      })
        .then(res => {
          this.taskData.ownerUserList = users
        })
        .catch(() => {})
    },
    // 参与人删除按钮
    deleteOwnerList(item, index) {
      editTask({
        taskId: this.id,
        ownerUserId: this.taskData.ownerUserList
          .filter(userItem => {
            return userItem.userId != item.userId
          })
          .map(item => {
            return item.userId
          })
          .join(',')
      })
        .then(res => {
          this.taskData.ownerUserList.splice(index, 1)
        })
        .catch(() => {})
    },
    // 编辑负责人
    editMainUser(val) {
      editTask({
        taskId: this.id,
        mainUserId: val.length ? val[0].userId : ''
      })
        .then(res => {
          if (val.length) {
            this.$set(this.taskData, 'mainUser', val[0])
          } else {
            this.$set(this.taskData, 'mainUser', null)
          }
        })
        .catch(() => {})
    },
    // 编辑任务名
    nameVShow(val) {
      editTask({
        name: val,
        taskId: this.id
      })
        .then(res => {
          this.nameVinput = false
          this.$emit('on-handle', {
            type: 'change-name',
            value: val,
            index: this.detailIndex
          })
          this.taskData.name = val
        })
        .catch(() => {})
    },
    // 截至日期API
    endTimeChange(val) {
      editTask({
        stopTime: val,
        taskId: this.id
      })
        .then(res => {
          // val.substring(5)
          this.$emit('on-handle', {
            type: 'change-stop-time',
            value: val,
            index: this.detailIndex
          })
        })
        .catch(() => {})
    },
    // 描述提交按钮
    addDescriptionSubmit() {
      editTask({
        taskId: this.id,
        description: this.addDescriptionTextarea
      })
        .then(res => {
          this.addDescriptionShow = false
          this.$set(this.taskData, 'description', this.addDescriptionTextarea)
        })
        .catch(() => {})
    },
    // 评论选中功能
    selectEmoji(val) {
      const list = this.commentsTextarea.split('')
      list.splice(this.blurIndex, 0, val)
      this.commentsTextarea = list.join('')
      this.commentsPopover = false
    },
    // 评论回复 -- 选中功能
    selectEmojiChild(val) {
      const list = this.childCommentsTextarea.split('')
      list.splice(this.blurIndex, 0, val)
      this.childCommentsTextarea = list.join('')
      this.childCommentsPopover = false
    },
    // 评论发布
    commentsSub() {
      if (this.commentsTextarea) {
        this.commentsLoading = true
        setCommentAPI({
          typeId: this.id,
          type: 1,
          content: xss(this.commentsTextarea)
        })
          .then(res => {
            res.data.childCommentList = []
            res.data.show = false
            res.data.user = this.userInfo
            this.replyList.push(res.data)
            this.commentsTextarea = ''
            // this.$emit('commentsSet', 'add')
            this.$emit('on-handle', {
              type: 'change-comments',
              value: 'add',
              index: this.detailIndex
            })
            this.commentsLoading = false
          })
          .catch(() => {
            this.commentsLoading = false
          })
      }
    },
    // 回复评论
    childCommentSubmit() {
      if (this.replyChildComment && this.childCommentsTextarea) {
        var item =
          this.replyChildIndex == -1
            ? this.replyChildComment
            : this.replyChildComment.childCommentList[this.replyChildIndex]
        setCommentAPI({
          pid: item.userId,
          typeId: item.typeId,
          mainId: item.mainId == 0 ? item.commentId : item.mainId,
          type: 1,
          content: xss(this.childCommentsTextarea)
        })
          .then(res => {
            this.childCommentsPopover = false
            res.data.user = this.userInfo
            res.data.replyUser = item.user
            this.replyChildComment.childCommentList.push(res.data)
            this.replyChildComment.show = false
            this.replyChildComment = null
            this.childCommentsTextarea = ''
            this.$emit('on-handle', {
              type: 'change-comments',
              value: 'add',
              index: this.detailIndex
            })
          })
          .catch(() => {})
      }
    },
    // 删除评论
    discussDelete(val, items, index) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          deleteCommentAPI({
            commentId: val.commentId
          })
            .then(res => {
              items.splice(index, 1)
              this.$emit('on-handle', {
                type: 'change-comments',
                value: 'delete',
                index: this.detailIndex
              })
              // this.$emit('commentsSet', 'delete')
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击回复按钮
    discussBtn(item, index) {
      if (item.show) {
        this.$set(item, 'show', false)
        this.replyChildComment = null
      } else {
        this.$set(item, 'show', true)
        this.$set(item, 'showComment', false)
        this.replyChildComment = item
        this.replyChildIndex = index
      }
    },
    blurFun(eve) {
      this.blurIndex = eve.target.selectionEnd
    },
    // 相关信息提交按钮
    checkInfos(val) {
      editTaskRelation({
        taskId: this.id,
        customerIds:
          val.customerIds && val.customerIds.length
            ? ',' + val.customerIds.join(',') + ','
            : '',
        contactsIds:
          val.contactsIds && val.contactsIds.length
            ? ',' + val.contactsIds.join(',') + ','
            : '',
        businessIds:
          val.businessIds && val.businessIds.length
            ? ',' + val.businessIds.join(',') + ','
            : '',
        contractIds:
          val.contractIds && val.contractIds.length
            ? ',' + val.contractIds.join(',') + ','
            : ''
      })
        .then(res => {
          this.$message.success('关联成功')
        })
        .catch(() => {})
    },
    commentsSubmit(event) {
      this.addComments = false
    },
    checkRelatedDetail(crmType, item) {
      this.relatedID = item.key
      this.relatedCRMType = crmType
      this.showRelatedDetail = true
    },
    deleteSubTask(val) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          deleteTask({
            taskId: val.taskId
          })
            .then(res => {
              const subData = this.taskData.childTask
              for (const i in subData) {
                if (subData[i].taskId == val.taskId) {
                  subData.splice(i, 1)
                  break
                }
              }
              if (val.checked) {
                this.subTaskProgress--
                this.$emit('on-handle', {
                  type: 'change-sub-task',
                  value: {
                    subdonecount: this.subTaskProgress,
                    allcount: this.taskData.childTask.length
                  },
                  index: this.detailIndex
                })
              }
              this.$message.success('子任务删除成功')
            })
            .catch(() => {
              this.$message.error('子任务删除失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editSubTask(val) {
      this.subTaskID = val.taskId
      const dataList = this.taskData.childTask
      for (const i in dataList) {
        if (dataList[i].taskId == val.taskId) {
          this.$set(dataList[i], 'showEdit', true)
        } else {
          this.$set(dataList[i], 'showEdit', false)
        }
      }
    },
    handleSubTasksBlock(data, item) {
      if (data.type == 'edit') {
        this.$set(item, 'showEdit', false)
      } else if (data.type == 'add') {
        this.addSubtasks = true
        if (data.result == 'success') {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskProgress,
              allcount: this.taskData.childTask.length + 1
            },
            index: this.detailIndex
          })
        } else {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskProgress,
              allcount: this.taskData.childTask.length - 1
            },
            index: this.detailIndex
          })
        }
      } else if (data.type == 'cancel') {
        if (item) {
          this.$set(item, 'showEdit', false)
        } else {
          this.addSubtasks = true
        }
      }
    },
    // 删除截止时间
    deleteTimeTop() {
      editTask({
        taskId: this.id,
        stopTime: ''
      })
        .then(res => {
          this.$set(this.taskData, 'stopTime', '')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
