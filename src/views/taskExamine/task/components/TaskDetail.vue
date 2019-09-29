<template>
  <slide-view
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    class="d-view"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    append-to-body
    @close="hideView">
    <flexbox
      v-loading="loading"
      direction="column"
      align="stretch"
      class="main">
      <div class="main__hd task-hd">
        <flexbox
          class="task-hd__top"
          justify="space-between">
          <span
            v-if="taskData && taskData.createUser"
            class="task-hd__top--create">{{ taskData.createUser.realname }} 创建于 {{ taskData.createTime }}</span>
          <div>
            <span class="task-hd__top--info">该任务已于 2019-09-27 14:20 被归档</span>
            <el-button type="primary">激活</el-button>
            <el-button type="primary">归档</el-button>
            <el-dropdown
              trigger="click"
              @command="morkDropdownClick">
              <el-button icon="el-icon-more" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :icon="'delete' | wkIconPre"
                  command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </flexbox>
        <flexbox
          class="task-hd__middle"
          align="stretch">
          <el-checkbox
            v-model="taskData.checked"
            @change="completeMainTask" />
          <div v-if="!nameVinput" :class="['task-name', { 'is-checked': taskData.checked }]" @click="nameVinput = true, taskDataName = taskData.name">{{ taskData.name }}</div>
          <div
            v-else
            class="show-input">
            <el-input
              v-model="taskDataName"
              :maxlength="50"
              size="medium"/>
            <div class="btn-box">
              <el-button
                type="primary"
                size="mini"
                @click="nameVShow(taskDataName)">保 存</el-button>
              <el-button
                size="mini"
                @click="nameVinput = false">取 消</el-button>
            </div>
          </div>
        </flexbox>
        <flexbox class="task-hd__bottom">
          <flexbox-item class="priority">
            <flexbox>
              <span
                :style="{ backgroundColor: priority.color }"
                class="priority--icon">{{ priority.label }}</span>
              <div class="head-btn__bd">
                <div class="head-btn__bd--des">优先级</div>
              </div>
            </flexbox>
          </flexbox-item>
          <flexbox-item>
            <flexbox class="head-btn">
              <i class="wk wk-l-plus head-btn__icon is-null" />
              <div class="head-btn__bd">
                <!-- <div class="head-btn__bd--title">张先生</div> -->
                <div class="head-btn__bd--des">负责人</div>
              </div>
            </flexbox>
          </flexbox-item>
          <flexbox-item>
            <flexbox class="head-btn">
              <i
                :class="[ startTime ? 'is-valve' : 'is-null']"
                class="wk wk-l-time head-btn__icon" />
              <el-date-picker
                v-model="startTime"
                :clearable="false"
                type="date"
                value-format="yyyy-MM-dd" />
              <div class="head-btn__bd">
                <div
                  v-if="startTime"
                  class="head-btn__bd--title">{{ startTime | moment('MM月DD日') }}</div>
                <div class="head-btn__bd--des">开始时间</div>
              </div>
            </flexbox>
          </flexbox-item>
          <flexbox-item>
            <flexbox class="head-btn">
              <i
                :class="[ endTime ? 'is-valve' : 'is-null']"
                class="wk wk-l-minus head-btn__icon" />
              <el-date-picker
                v-model="endTime"
                :clearable="false"
                type="date"
                value-format="yyyy-MM-dd" />
              <div class="head-btn__bd">
                <div
                  v-if="endTime"
                  class="head-btn__bd--title">{{ endTime | moment('MM月DD日') }}</div>
                <div class="head-btn__bd--des">结束时间</div>
              </div>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </div>

      <flexbox
        class="main__bd"
        align="stretch">
        <div class="main__bd--left">
          <flexbox>
            <flexbox-item class="participant">
              <div class="participant-title">参与人</div>
              <flexbox class="participant-bd">
                <span
                  v-for="(item, index) in taskData.ownerUserList"
                  :key="index"
                  class="owner-list">
                  <el-tooltip
                    placement="bottom"
                    effect="light"
                    popper-class="tooltip-change-border">
                    <div slot="content">
                      <span>{{ item.realname }}</span>
                    </div>
                    <div
                      v-photo="item"
                      v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
                      :key="item.img"
                      class="div-photo item-img" />
                  </el-tooltip>
                  <img
                    src="@/assets/img/delete_task.png"
                    class="el-icon-close"
                    @click="deleteOwnerList(item, index)">
                </span>
                <members-dep
                  :close-dep="true"
                  :content-block="false"
                  :user-checked-data="taskData.ownerUserList"
                  :user-request="ownerListRequest"
                  :user-params="{ workId: workId }"
                  @popoverSubmit="editOwnerList">
                  <i
                    slot="membersDep"
                    class="wk wk-l-plus participant-add" />
                </members-dep>
              </flexbox>
            </flexbox-item>
            <flexbox-item class="label">
              <div class="label-title">标签</div>
              <span
                v-for="(item, index) in taskData.labelList"
                :style="{'background': item.color ? item.color : '#ccc'}"
                :key="index"
                class="item-color">
                {{ item.labelName }}
              </span>
              <div class="add-tag">
                <tag-index
                  :placement="'right'"
                  :task-data="taskData">
                  <span
                    slot="editIndex"
                    class="add-btn">
                    <i class="wk wk-l-plus" />
                    <span class="label">标签</span>
                  </span>
                </tag-index>
              </div>
            </flexbox-item>
          </flexbox>

          <!-- 其他信息 -->
          <div class="secitons">
            <!-- 描述 -->
            <div class="section">
              <div class="section__hd">
                <i class="wk wk-write" />
                <span>描述</span>
              </div>
              <div class="section__bd description">
                <div v-show="!addDescriptionShow">
                  <div
                    v-if="taskData.description"
                    class="description-content"
                    @click="addDescriptionShow = true; addDescriptionTextarea = taskData.description">{{ taskData.description }}</div>
                  <div
                    v-else
                    class="description-empty">
                    <span class="color-label">暂无描述</span>
                    <span
                      class="add-btn"
                      @click="addDescriptionShow = true">
                      <i class="wk wk-l-plus" />
                      <span class="label">描述</span>
                    </span>
                  </div>
                </div>
                <div v-show="addDescriptionShow">
                  <el-input
                    :autosize="{ minRows: 2}"
                    v-model="addDescriptionTextarea"
                    type="textarea"
                    placeholder="请输入内容" />
                  <div class="btn-box">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="addDescriptionSubmit">保 存</el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="addDescriptionShow = false">取 消</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 关联业务 -->
            <div class="section">
              <div class="section__hd">
                <i class="wukong wukong-relevance" />
                <span>关联业务</span>
              </div>
              <div class="section__bd">
                <related-business
                  :margin-left="'0'"
                  :is-task="true"
                  :all-data="allData"
                  :task-id="taskData.taskId"
                  @checkRelatedDetail="checkRelatedDetail"
                  @checkInfos="checkInfos" />
              </div>
            </div>

            <!-- 子任务 -->
            <div class="section">
              <div class="section__hd">
                <i class="wukong wukong-sub-task" />
                <span>子任务({{ subTaskProgress }}/{{ taskData.childTask.length }})</span>
              </div>
              <div class="section__bd">
                <div v-if="taskData.pid == 0">
                  <div>
                    <template v-if="taskData.childTask.length != 0">
                      <el-progress
                        :percentage="subTaskProgress/taskData.childTask.length*100"
                        :stroke-width="10" />
                    </template>
                    <template v-else>
                      <el-progress :percentage="0" />
                    </template>
                  </div>
                  <template v-if="taskData.childTask.length != 0">
                    <div
                      v-for="(item, index) in taskData.childTask"
                      :key="index">
                      <flexbox
                        v-if="!item.showEdit"
                        class="sub-task">
                        <div @click.stop>
                          <el-checkbox
                            v-model="item.checked"
                            @change="subtasksCheckbox(item, $event)" />
                        </div>
                        <div class="sub-task__bd text-one-line">
                          <div
                            :class="{ 'is-checked' : item.checked }"
                            class="sub-name">{{ item.name }}</div>

                        </div>

                        <div class="edit-del-box">
                          <span
                            class="xr-text-btn primary"
                            @click="editSubTask(item)">编辑</span>
                          <span
                            class="xr-text-btn delete"
                            @click="deleteSubTask(item)">删除</span>
                        </div>

                        <div class="sub-task__ft">
                          <div
                            v-if="item.stopTime"
                            class="bg-color task-bg-color">{{ item.stopTime | moment("MM-DD") }} 截止</div>
                          <div
                            v-photo="item.mainUser"
                            v-lazy:background-image="$options.filters.filterUserLazyImg(item.mainUser.img)"
                            v-if="item.mainUser"
                            :key="item.mainUser.img"
                            class="div-photo" />
                        </div>
                      </flexbox>
                      <sub-task
                        v-else
                        :sub-task-com="'edit'"
                        :time="item.stopTime"
                        :sub-data="item"
                        :text="item.name"
                        :task-id="subTaskID"
                        :checkbox-data="item.checked"
                        :task-data="taskData"
                        @on-handle="handleSubTasksBlock($event, item)" />
                    </div>
                  </template>
                  <div v-if="addSubtasks">
                    <span
                      class="add-btn"
                      @click="addSubtasks = false">
                      <i class="wk wk-l-plus" />
                      <span class="label">子任务</span>
                    </span>
                  </div>
                  <sub-task
                    v-else
                    :sub-task-com="'new'"
                    :task-data="taskData"
                    @on-handle="handleSubTasksBlock" />
                </div>
              </div>
            </div>

            <!-- 附件 -->
            <div class="section">
              <div class="section__hd">
                <i class="wukong wukong-file" />
                <span>附件</span>
                <span v-if="fileList.length">({{ fileList.length }})</span>
              </div>
              <div class="section__bd">
                <file-cell
                  v-for="(file, fileIndex) in fileList"
                  :key="fileIndex"
                  :data="file"
                  :cell-index="fileIndex"
                  :module-id="id"
                  :show-delete="true"
                  @delete="accessoryDeleteFun" />
                <el-upload
                  :http-request="httpRequest"
                  class="upload-file"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple
                  list-type="picture">
                  <span class="add-btn">
                    <i class="wk wk-l-plus" />
                    <span class="label">附件</span>
                  </span>
                </el-upload>

              </div>
            </div>

          </div>
        </div>
        <div class="main__bd--right" />

      </flexbox>
    </flexbox>
  </slide-view>
</template>

<script type="text/javascript">
import SlideView from '@/components/SlideView'
import xss from 'xss'
import {
  workTaskArchiveAPI,
  workTaskRecoverAPI // 激活任务
} from '@/api/projectManagement/task'
import {
  setTaskAPI,
  editTaskRelationAPI,
  deleteTaskAPI,
  commentListAPI,
  setCommentAPI,
  deleteCommentAPI,
  detailsTaskAPI,
  queryLogTaskAPI
} from '@/api/task/task'
import { workWorkOwnerListAPI } from '@/api/projectManagement/project'
import { crmFileSave } from '@/api/common'
import {
  workTrashRecoverAPI,
  workTrashDeleteAPI
} from '@/api/projectManagement/recycle'

import membersDep from '@/components/selectEmployee/membersDep'
import TagIndex from './tag/tagIndex'
import SubTask from './subTask'
// emoji
import emoji from '@/components/emoji'
// 关联业务 - 选中列表
import relatedBusiness from '@/components/relatedBusiness'
import XhUser from '@/components/CreateCom/XhUser'
import FileCell from '@/views/OAManagement/components/fileCell'
import CRMFullScreenDetail from '@/views/customermanagement/components/CRMFullScreenDetail'
import { mapGetters } from 'vuex'

export default {
  name: 'TaskDetail',
  components: {
    SlideView,
    membersDep,
    emoji,
    relatedBusiness,
    XhUser,
    TagIndex,
    CRMFullScreenDetail,
    SubTask,
    FileCell
  },
  props: {
    id: [String, Number],
    detailIndex: Number,
    detailSection: Number,
    appendToBody: {
      type: Boolean,
      default: false
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    }
  },
  data() {
    return {
      loading: false,
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
      startTime: '',
      endTime: '',
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
      taskData: {},
      activityList: [],
      fileList: [],
      // 评论列表
      replyList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    priority() {
      if (this.taskData.priority == 0 || !this.taskData.priority) {
        return {
          color: '#D8D8D8',
          label: '无'
        }
      } else if (this.taskData.priority == 1) {
        return {
          color: '#67C23A',
          label: '低'
        }
      } else if (this.taskData.priority == 2) {
        return {
          color: '#F7AD3D',
          label: '中'
        }
      } else if (this.taskData.priority == 3) {
        return {
          color: '#F95A5A',
          label: '高'
        }
      }
    },

    ownerListRequest() {
      return workWorkOwnerListAPI
    },
    workId() {
      return this.taskData.workId
    },
    labelList() {
      if (!this.taskData) {
        return []
      }
      return this.taskData.labelList || []
    }
  },
  watch: {
    id: function(val) {
      this.initInfo()
      this.getDetail()
      this.getCommentList()
      this.getActivityList()
    },

    labelList(val) {
      this.$emit('on-handle', {
        type: 'change-label',
        value: val,
        index: this.detailIndex,
        section: this.detailSection
      })
    }
  },
  mounted() {
    if (this.id) {
      this.getDetail()
      this.getCommentList()
      this.getActivityList()
    }
  },

  beforeDestroy() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    initInfo() {
      this.subTaskProgress = 0
      // 设置关联项列表
      this.allData = {
        business: [],
        contacts: [],
        contract: [],
        customer: []
      }

      this.activityList = []
      this.fileList = []
    },
    // 基础详情
    getDetail() {
      this.loading = true
      detailsTaskAPI({ taskId: this.id })
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
      queryLogTaskAPI({
        taskId: this.id
      })
        .then(res => {
          this.activityList = res.data
        })
        .catch(() => {})
    },

    // 获取评论信息
    getCommentList() {
      commentListAPI({
        typeId: this.id,
        type: 1
      })
        .then(res => {
          this.replyList = res.data
        })
        .catch(() => {})
    },

    /**
     * 完成任务
     */
    completeMainTask(val) {
      this.taskData.checked = val
      setTaskAPI({
        taskId: this.id,
        status: this.taskData.checked ? 5 : 1
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'title-check',
            value: val,
            index: this.detailIndex,
            section: this.detailSection
          })
          this.$store.dispatch('GetOAMessageNum', 'task')
        })
        .catch(() => {
          this.$emit('on-handle', {
            type: 'title-check',
            value: !this.taskData.checked,
            index: this.detailIndex,
            section: this.detailSection
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
      setTaskAPI({
        taskId: this.id,
        priority: value.id
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'change-priority',
            value: value,
            index: this.detailIndex,
            section: this.detailSection
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
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          deleteTaskAPI({
            taskId: this.id
          })
            .then(res => {
              this.$message.success('删除成功')
              this.$emit('on-handle', {
                type: 'delete',
                index: this.detailIndex,
                section: this.detailSection
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
    moreArchive() {
      this.$confirm('此操作将归档该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          workTaskArchiveAPI({
            taskId: this.id
          })
            .then(res => {
              this.$message.success('操作成功')
              this.$emit('on-handle', {
                type: 'delete',
                index: this.detailIndex,
                section: this.detailSection
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
          res.filePath = res.url
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
        index: this.detailIndex,
        section: this.detailSection
      })
      setTaskAPI({
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
            index: this.detailIndex,
            section: this.detailSection
          })
          // this.$emit('', val, e)
        })
    },
    /**
     * 参与人操作
     */
    // 提交按钮
    editOwnerList(users, dep) {
      setTaskAPI({
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
      setTaskAPI({
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
      setTaskAPI({
        taskId: this.id,
        mainUserId: val ? val.data[0].userId : ''
      })
        .then(res => {
          if (val) {
            this.$set(this.taskData, 'mainUser', val.data[0])
          } else {
            this.$set(this.taskData, 'mainUser', null)
          }

          this.$emit('on-handle', {
            type: 'change-main-user',
            value: val ? val.data[0] : null,
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {})
    },
    // 编辑任务名
    nameVShow(val) {
      setTaskAPI({
        name: val,
        taskId: this.id
      })
        .then(res => {
          this.nameVinput = false
          // this.$emit('saveName', val)
          this.$emit('on-handle', {
            type: 'change-name',
            value: val,
            index: this.detailIndex,
            section: this.detailSection
          })
          this.taskData.name = val
        })
        .catch(() => {})
    },
    // 截至日期API
    endTimeChange(val) {
      setTaskAPI({
        stopTime: val,
        taskId: this.id
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'change-stop-time',
            value: val,
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {})
    },
    // 描述提交按钮
    addDescriptionSubmit() {
      setTaskAPI({
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

    /**
     * 点击添加回复
     */
    addCommentsClick() {
      this.addComments = true
      this.$nextTick(() => {
        this.$refs.commentsTextareaRef.focus()
      })
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
            this.$emit('on-handle', {
              type: 'change-comments',
              value: 'add',
              index: this.detailIndex,
              section: this.detailSection
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
              index: this.detailIndex,
              section: this.detailSection
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
                index: this.detailIndex,
                section: this.detailSection
              })
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
        this.replyChildComment = item
        this.replyChildIndex = index
        this.$nextTick(() => {
          this.$refs.childCommentsTextareaRef[0].focus()
        })
      }
    },
    blurFun(eve) {
      this.blurIndex = eve.target.selectionEnd
    },
    // 关联业务提交按钮
    checkInfos(val) {
      editTaskRelationAPI({
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
      this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-particulars'
      })
        .then(() => {
          deleteTaskAPI({
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
                  index: this.detailIndex,
                  section: this.detailSection
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
            index: this.detailIndex,
            section: this.detailSection
          })
        } else {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskProgress,
              allcount: this.taskData.childTask.length - 1
            },
            index: this.detailIndex,
            section: this.detailSection
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
      setTaskAPI({
        taskId: this.id,
        stopTime: ''
      })
        .then(res => {
          this.$set(this.taskData, 'stopTime', '')
        })
        .catch(() => {})
    },

    /**
     * 激活任务
     */
    activateTask() {
      this.loading = true
      workTaskRecoverAPI({
        taskId: this.taskData.taskId
      })
        .then(res => {
          this.loading = false
          this.$emit('on-handle', {
            type: 'activate-task',
            index: this.detailIndex,
            section: this.detailSection
          })
          this.closeBtn()
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 激活任务
     */
    recoverTask() {
      this.loading = true
      workTrashRecoverAPI({
        taskId: this.taskData.taskId
      })
        .then(res => {
          this.loading = false
          this.$message.success('恢复成功')
          this.$emit('on-handle', {
            type: 'recover-task',
            index: this.detailIndex,
            section: this.detailSection
          })
          this.closeBtn()
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 激活任务
     */
    thoroughDeleteTask() {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          workTrashDeleteAPI({
            taskId: this.taskData.taskId
          })
            .then(res => {
              this.loading = false
              this.$emit('on-handle', {
                type: 'thorough-delete-task',
                index: this.detailIndex,
                section: this.detailSection
              })
              this.closeBtn()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 任务头部操作
     */
    morkDropdownClick(command) {},

    /**
     * 关闭页面
     */
    hideView() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
$btn-b-color: #f8faff;
$btn-color: #333333;
$btn-b-hover-color: #eff4ff;

// 框架
.main {
  position: relative;
  height: 100%;

  &__hd {
    margin-bottom: 15px;
  }

  &__bd {
    flex: 1;
    overflow: hidden;

    &--left {
      flex: 1;
      box-shadow: none;
      position: relative;
      overflow-y: auto;
      background-color: white;
      border-right: 1px solid $xr-border-line-color;
      border-top: 1px solid $xr-border-line-color;
      border-bottom: 1px solid $xr-border-line-color;
      padding: 20px 30px;
      margin-bottom: 15px;
    }

    &--right {
      width: 300px;
      min-width: 300px;
      box-shadow: none;
      flex-shrink: 0;
      height: calc(100% - 15px);
      background-color: white;
      margin-left: 15px;
      border-left: 1px solid $xr-border-line-color;
      border-top: 1px solid $xr-border-line-color;
      border-bottom: 1px solid $xr-border-line-color;
    }
  }
}

//任务详情头
.task-hd {
  background-color: white;
  padding: 8px 25px 15px;
  border-bottom: 1px solid $xr-border-line-color;

  &__top {
    font-size: 12px;
    &--create {
      color: #999;
    }

    &--info {
      color: #666;
      margin-right: 8px;
    }
  }

  &__middle {
    margin-top: 5px;
    .el-checkbox {
      margin-right: 8px;
      margin-top: 5px;
    }
  }

  &__bottom {
    margin-top: 20px;
    color: #666;
    .vux-flexbox-item {
      text-align: left;
      border-left: 1px solid #efefef;
      font-size: 12px;
      padding-left: 20px;

      .head-btn__icon {
        margin-right: 12px;
      }

      .vux-flex-row {
        position: relative;
        .el-date-editor {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 1;

          /deep/ .el-input__inner {
            border: none;
            background-color: transparent;
            color: transparent;
            cursor: pointer;
          }

          /deep/ .el-input__prefix {
            display: none;
            cursor: pointer;
          }
        }
      }
    }

    .vux-flexbox-item:first-child {
      border-left: none;
    }
  }
}
//任务名称
.task-name {
  flex: 1;
  font-size: 22px;
  color: #333;
}

.task-name.is-checked {
  color: #8f8f8f;
  text-decoration: line-through;
}

.show-input {
  flex: 1;
  padding-right: 8px;
  .btn-box {
    margin-top: 10px;
  }
}

// 优先级
.priority {
  cursor: pointer;
  &--icon {
    font-size: 12px;
    width: 32px;
    height: 32px;
    text-align: center;
    display: inline-block;
    line-height: 32px;
    color: white;
    border-radius: 16px;
    margin-right: 8px;
  }
}

// 操作图标
.head-btn {
  cursor: pointer;

  &__icon {
    font-size: 15px;
    color: $btn-color;
    border-radius: 16px;
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: $btn-b-color;
    text-align: center;
    border: 1px solid transparent;
  }

  // 有值效果
  .wk-l-time.is-valve {
    background-color: #f7ad3d;
    color: white;
  }

  .wk-l-minus.is-valve {
    background-color: #f56c6c;
    color: white;
  }
  // &__icon::before {
  //   margin-top: 1px;
  //   margin-left: 2px;
  //   display: inline-block;
  // }

  &__bd {
    &--title {
      color: #333333;
      font-size: 16px;
      margin-bottom: 3px;
    }

    &--des {
      color: #999;
    }
  }
}

.head-btn:hover {
  .head-btn__icon.is-null {
    color: $xr-color-primary;
    background-color: $btn-b-hover-color;
  }
}

//参与人
.participant {
  &-title {
    color: #999999;
    font-size: 12px;
    margin-bottom: 10px;
  }

  &-bd {
    min-height: 28px;
    .owner-list {
      position: relative;
      margin-right: 10px;
      display: inline-block;
      .item-img {
        width: 32px;
        height: 32px;
        border-radius: 16px;
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

  &-add {
    cursor: pointer;
    background-color: $btn-b-color;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    color: $btn-color;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    line-height: 32px;
  }

  &-add:hover {
    color: $xr-color-primary;
    background-color: $btn-b-hover-color;
  }
}

// 标签
.label {
  &-title {
    color: #999999;
    font-size: 12px;
    margin-bottom: 10px;
  }
  white-space: normal;
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

  .add-tag {
    display: inline-block;
  }
}

// 添加btn
.add-btn {
  margin-top: 8px;
  font-size: 12px;
  color: $btn-color;
  background-color: $btn-b-color;
  border-radius: 4px;
  display: inline-block;
  padding: 3px 10px;
  cursor: pointer;

  .wk-l-plus {
    font-size: 12px;
  }
}

.add-btn:hover {
  color: $xr-color-primary;
  background-color: $btn-b-hover-color;
}

// 详情其他模块
.section {
  padding: 10px 0;

  &__hd {
    span {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    .wk {
      color: #363636;
      font-size: 15px;
      margin-right: 5px;
    }
  }

  &__bd {
    margin-top: 15px;
    padding-left: 25px;
  }
}

.secitons {
  position: relative;
  margin-top: 15px;
}

// 描述
.description {
  position: relative;
  cursor: pointer;
  &-content {
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 18px;
    color: #333;
    font-size: 14px;
  }
  &-empty {
    color: #2362fb;
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

// 子任务
.sub-task {
  font-size: 14px;
  padding: 8px 40px 8px 8px;
  background-color: #f8faff;
  border-radius: 4px;
  margin: 3px 0;
  position: relative;

  &__hd {
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
  }

  &__bd {
    padding-left: 5px;
    position: relative;

    .sub-name.is-checked {
      color: #8f8f8f;
      text-decoration: line-through;
    }
  }

  .edit-del-box {
    display: none;
    flex-shrink: 0;
      margin-left: 8px;
    }

  &__ft {
    position: absolute;
    top: 3px;
    right: 3px;
    margin-left: 8px;
    .bg-color {
      font-size: 12px;
      padding: 0 8px !important;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
    }
    .div-photo {
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      margin-left: 10px;
    }
  }
}

.sub-task:hover {
  .edit-del-box {
      opacity: 1;
    }
}

// 附件
.upload-file /deep/ .el-upload-list--picture {
  display: none;
}


.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 0px;
}
</style>

