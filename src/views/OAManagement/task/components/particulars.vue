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
<style lang="scss" scoped>
.wukong {
  vertical-align: middle;
  color: #666;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.35s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}
.display-flex {
  display: flex;
}
// 小手抓
.cursor-pointer {
  cursor: pointer;
}
// 时间背景
.bg-color {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 14px;
}
.task-bg-color {
  background: #e6e6e6;
}
.border {
  border-top: 1px solid #e6e6e6;
  margin: 0 -20px;
}

.particulars-priority-box {
  display: flex;
  p {
    flex: 1;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    span {
      color: #aaa;
      font-size: 12px;
      padding: 7px 10px;
      text-align: center;
      display: inline-block;
      border-radius: 50%;
      border: 1px solid transparent;
    }
  }
}
// 更多按钮
.more-btn-group {
  line-height: 34px;
  font-size: 14px;
  margin: 0 -12px;
  p {
    padding-left: 22px;
    cursor: pointer;
  }
  p:hover {
    background: #f7f8fa;
    color: #2362FB;
  }
}
// 负责人
.particulars-colleagues-list {
  margin: 0 -12px;
  p {
    height: 34px;
    line-height: 34px;
    padding-left: 22px;
    cursor: pointer;
  }
  p:hover {
    -webkit-box-shadow: 0 0 8px 2px #eee;
    box-shadow: 0 0 8px 2px #eee;
    background: 0 0;
  }
}
.particulars-common /deep/ .el-card__body {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 90px;
}
.tip {
  position: fixed;
  right: 0px;
  width: 926px;
  bottom: 0;
  overflow: hidden;
  margin-top: 50px;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #e6e6e6;
  background: #fff;
  color: #999;
  z-index: 9;
  span {
    margin-left: 55px;
  }
}
.particulars-common {
  position: fixed;
  top: 60px;
  right: 0px;
  width: 926px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .clear-fix {
    overflow: auto;
  }
  .img-box-grop {
    float: right;
    color: #999;
    .task-close-img {
      padding-left: 30px;
      img {
        width: 18px;
      }
    }

    .wukong {
      color: #999;
    }
  }
  .img-box-grop > div {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    img {
      vertical-align: middle;
    }
    .upload-demo /deep/ .el-upload-list--picture {
      display: none;
    }
  }
  .card-content-box {
    display: flex;
    img {
      vertical-align: middle;
    }
    .el-checkbox {
      height: 20px;
      margin-right: 0;
    }
    // 解决多选框样式
    .el-checkbox /deep/ .el-checkbox__inner {
      width: 20px;
      height: 20px;
    }
    .el-checkbox /deep/ .el-checkbox__inner::after {
      border-width: 2px;
      height: 12px;
      width: 5px;
      left: 5px;
    }
    .card-content {
      flex: 1;
      padding: 0 15px;
      .card-content-row {
        margin-bottom: 35px;
        display: flex;
        .priority-data-name {
          .title-text {
            font-size: 17px;
            color: #333;
            .el-icon-edit-outline {
              margin-left: 20px;
              color: #2362FB;
              opacity: 0;
              cursor: pointer;
            }
          }
          .title-text:hover {
            .el-icon-edit-outline {
              opacity: 1;
            }
          }
          .show-input {
            width: 90%;
            .btn-box {
              margin-top: 10px;
            }
          }
        }
        .el-icon-circle-plus-outline {
          width: 30px;
          height: 30px;
          color: #ccc;
        }
        .card-row-right {
          width: 50%;
          .text-right {
            width: 60%;
            float: right;
            min-width: 200px;
            min-height: 28px;
            position: relative;
            .el-icon-close {
              opacity: 0;
              margin-left: 10px;
              color: #ccc;
              cursor: pointer;
            }
            .el-popover__reference {
              width: 20px;
            }
            .main-user-name {
              width: 25px;
              height: 25px;
              border-radius: 12.5px;
            }
            .user-name-label {
              width: 73px;
              display: inline-block;
            }

            .bg-position {
              position: relative;
              display: inline-block;
              .el-icon-close {
                opacity: 0;
                border-radius: 50%;
                cursor: pointer;
                position: absolute;
                z-index: 3;
                top: -7px;
                right: -5px;
              }
            }
            .wukong-addition-task {
              cursor: pointer;
            }

            .time-top {
              position: relative;
              display: inline-block;
              .time-top-close {
                opacity: 0;
                border-radius: 50%;
                cursor: pointer;
                position: absolute;
                z-index: 3;
                top: -7px;
                right: -5px;
              }
            }

            .time-top /deep/ .el-date-editor {
              width: 115px;
              input {
                background-color: #f5f5f5;
                border: none;
                border-radius: 15px;
                line-height: 30px;
                height: 30px;
                padding-right: 0;
              }
            }
            .time-top /deep/ .no-time-top.el-date-editor {
              width: 30px;
              .el-input__prefix {
                left: 2px;
              }
            }
          }

          .text-right:hover {
            .el-icon-close {
              opacity: 1;
            }
          }
          .color-label {
            margin-right: 10px;
            vertical-align: middle;
          }
        }
        .card-row-right:hover {
          .el-icon-close {
            opacity: 1;
          }
        }
        .particulars-priority-copy {
          .item-color {
            padding: 0 10px;
            color: #fff;
            font-size: 12px;
            margin-right: 5px;
            border-radius: 3px;
            display: inline-block;
            height: 22px;
            line-height: 22px;
            margin-bottom: 5px;
          }
          .el-icon-plus,
          .add-tag {
            color: #999;
          }
          .el-icon-plus {
            font-size: 13px;
            padding-left: 6px;
          }
          .add-tag {
            display: inline-block;
            width: 83px;
            height: 24px;
            line-height: 24px;
            background: rgba(245, 245, 245, 1);
            border-radius: 3px;
            cursor: pointer;
            text-align: center;
            font-size: 12px;
          }
          .label {
            padding-right: 10px;
          }
        }
        .class-file {
          img {
            margin: 0 5px;
          }
        }
      }
      .card-content-row-column {
        flex-direction: column;
        margin-right: 20px;
        .accessory-box {
          margin-top: 10px;
        }
        .participant {
          color: #666;
          img,
          span {
            vertical-align: middle;
          }
        }
        .participant-class {
          margin-left: 10px;
          min-height: 28px;
          .owner-list {
            position: relative;
            margin-right: 10px;
            display: inline-block;
            .item-img {
              width: 25px;
              height: 25px;
              border-radius: 12.5px;
            }
            .el-icon-close {
              opacity: 0;
              color: #fff;
              background: #ccc;
              border-radius: 50%;
              cursor: pointer;
              position: absolute;
              z-index: 3;
              top: -7px;
              right: -5px;
            }
          }
          .owner-list:hover {
            .el-icon-close {
              opacity: 1;
            }
          }
        }
        .task-add-png {
          display: inline-block;
        }
        .show-edit {
          background: #f5f7fa;
          height: 40px;
          line-height: 40px;
          // color: #2362FB;
          padding: 0 10px;
          font-size: 13px;
          .card-related-matters-right {
            float: right;
            margin-top: 8px;
          }
          .rt {
            margin-right: 0;
            .bg-color {
              font-size: 12px;
              padding: 0 8px !important;
              vertical-align: middle;
              height: 30px;
              line-height: 30px;
            }
            .div-photo {
              margin-top: 0 !important;
            }
            .rt-box {
              height: 41.5px;
            }
          }
        }
        .display-flex {
          margin-bottom: 10px;
          span {
            margin-right: 10px;
          }
        }
        .el-progress {
          flex: 1;
          margin-left: 10px;
        }
        .el-progress /deep/ .el-progress-bar {
          padding-right: 0;
          .el-progress-bar__outer {
            background: #f5f5f5;
          }
        }
        .el-progress /deep/ .el-progress__text {
          display: none;
        }
        .subtasks-box {
          color: #333;
          border-radius: 3px;
          margin: 3px 0;
          height: 40px;
          // line-height: 40px;
          // cursor: pointer;
          // 解决多选框样式
          .el-checkbox /deep/ .el-checkbox__inner {
            width: 16px;
            height: 16px;
          }
          .el-checkbox /deep/ .el-checkbox__inner::after {
            border-width: 2px;
            height: 10px;
            width: 4px;
            left: 4px;
            top: 0;
          }
          .rt {
            .div-photo {
              margin-top: 7px;
              width: 25px;
              height: 25px;
              border-radius: 12.5px;
              margin-left: 10px;
            }
          }
          .edit-del-box {
            display: inline-block;
            padding-left: 10px;
            opacity: 0;
            .wukong {
              padding-left: 10px;
              cursor: pointer;
            }
            .wukong:hover {
              color: #2362FB;
            }
          }
          .item-name {
            padding-left: 5px;
          }
        }
        .subtasks-box:hover {
          box-shadow: 0px 1px 4px 0px rgba(223, 227, 234, 1);
          .edit-del-box {
            opacity: 1;
          }
        }
      }
      .card-content-row > div {
        flex: 1;
      }
      .card-content-row /deep/ .related-business {
        margin: 10px 0;
        .list {
          margin: 0;
          .item-list {
            margin-bottom: 5px;
            background: #f5f7fa;
            border: 0;
          }
        }
        .add-file {
          display: inline-block;
          background: #f5f7fa;
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding-left: 8px;
          margin: 0;
        }
      }
      .add-subtasks {
        color: #2362FB;
        cursor: pointer;
        background: #f5f7fa;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        padding-left: 12px;
        font-size: 13px;
      }
      .add-description /deep/ {
        margin-bottom: 20px;
        position: relative;
        cursor: pointer;
        white-space: pre-wrap;
        word-wrap: break-word;
        .no-description {
          color: #2362FB;
          .color-label {
            color: #999;
          }
          button {
            margin-left: 5px;
          }
        }
        .btn-box {
          margin-top: 10px;
        }
        .el-textarea /deep/.el-textarea__inner {
          resize: none;
        }
      }
      .margin-bottom-15 {
        margin-bottom: 15px;
      }
      .margin-bottom-25 {
        margin-bottom: 25px;
      }
      .margin-bottom-30 {
        margin-bottom: 30px;
      }
      .margin-bottom-7 {
        margin-bottom: 7px;
      }
    }
    .color-label {
      color: #666;
    }
    .sub-task {
      .sub-task-progress {
        line-height: 22px;
      }
      .el-progress {
        line-height: 22px;
      }
    }
  }
  .card-footers {
    margin-top: 20px;
    .footer-title {
      margin-bottom: 40px;
      margin-left: 35px;
      img,
      span {
        vertical-align: middle;
        cursor: pointer;
      }
      .title-border {
        border-right: 2px solid #ccc;
        margin: 0 20px;
      }
    }
    .footer-content-box {
      display: flex;
      .footer-content {
        flex: 1;
        .activity-box {
          margin-left: 35px;
          margin-right: 35px;
          .activity-list {
            margin-bottom: 15px;
            color: #333;
            .activity-time {
              float: right;
              color: #999;
              font-size: 12px;
            }
            .activity-name {
              color: #666;
              margin: 0 5px;
            }
            .div-photo {
              width: 25px;
              height: 25px;
              border-radius: 12.5px;
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
        .comments-con > .comments-box {
          margin-bottom: 10px;
        }
        .comments-box {
          border: 1px solid #e6e6e6;
          .el-textarea /deep/ .el-textarea__inner {
            border: 0;
            resize: none;
          }
          .btn-group {
            overflow: hidden;
            margin: 10px;
            .smiling-img {
              margin-top: 7px;
            }
            .rt {
              margin-right: 10px;
            }
          }
        }

        .add-comments {
          display: flex;
          .footer-img {
            margin-left: 35px;
            margin-right: 20px;
            .div-photo {
              width: 42px;
              height: 42px;
              border-radius: 21px;
              margin-top: 4px;
            }
          }
          .comments-con {
            flex: 1;
            margin-right: 35px;
            .footer-bg {
              background: #f5f5f5;
              height: 50px;
              line-height: 50px;
              padding-left: 24px;
              color: #666;
              cursor: pointer;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
  .title {
    color: #333333;
    font-size: 18px;
  }
  // 回到父任务
  .parent-task {
    margin-bottom: 15px;
    .p-name {
      margin-left: 10px;
    }
    .back {
      margin-left: 35px;
      color: #2362FB;
      cursor: pointer;
    }
  }
}

// 评论列表
.discuss {
  padding: 10px 0;
  .discuss-list {
    .name,
    .time,
    .head-img {
      vertical-align: middle;
    }
    .head-img {
      width: 25px;
      height: 25px;
      display: inline-block;
      border-radius: 12.5px;
    }
    .name {
      margin: 0 10px;
      font-size: 15px;
    }
    .time {
      color: #999;
      font-size: 12px;
      display: inline-block;
      margin-top: 3px;
    }

    .reply-title {
      color: #333;
      font-size: 13px;
      margin: 10px 0 10px 40px;
      .reply {
        color: #2362FB;
      }
    }
    .reply-title /deep/ img {
      vertical-align: text-bottom;
      margin: 0 2px;
    }

    .children-reply {
      margin: 10px 0 10px 40px;
    }

    .rt {
      margin-top: 4px;
      color: #999;
      margin-right: 0;
      span {
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .discuss-content {
      background: #f5f7fa;
      color: #777;
      line-height: 36px;
      margin-left: 40px;
      padding-left: 15px;
    }
    .discuss-content /deep/ img {
      vertical-align: middle;
      margin: 0 3px;
    }
    .border {
      margin: 15px 0 15px 40px;
    }
    .comment-box {
      margin-left: 40px;
      padding: 0;
      background: transparent;
      margin-top: 15px;
    }
  }
}

// 评论框
.comment-box {
  margin: 20px;
  border: 1px solid #e6e6e6;
  .btn-group {
    padding: 0 20px 10px 10px;
    overflow: hidden;
    .btn-box {
      float: right;
    }
  }
  .btn-group /deep/ img {
    cursor: pointer;
  }
  .el-textarea /deep/ .el-textarea__inner {
    resize: none;
    border: 0;
  }
}
</style>

