<template>
  <slide-view
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    class="d-view"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @close="hideView">
    <flexbox
      v-loading="loading"
      direction="column"
      align="stretch"
      class="main">
      <div
        v-if="taskData"
        class="main__hd task-hd">

        <flexbox
          class="task-hd__top"
          justify="space-between">
          <span
            v-if="taskData.createUser"
            class="task-hd__top--create">{{ taskData.createUser.realname }} 创建于 {{ taskData.createTime }}</span>
          <div>
            <span
              v-if="isArchive"
              class="task-hd__top--info">该任务已于 {{ taskData.archiveTime }} 被归档</span>
            <el-button
              v-if="isArchive"
              class="xr-btn--primary"
              icon="wk wk-activation"
              type="primary"
              @click="activateTask">激活</el-button>
            <span
              v-if="isRecycle"
              class="task-hd__top--info">该任务已于 {{ taskData.hiddenTime }} 被放入回收站</span>
            <el-button
              v-if="isRecycle"
              class="xr-btn--primary"
              icon="wk wk-activation"
              type="primary"
              @click="recoverTask">恢复</el-button>
            <el-button
              v-if="isRecycle"
              class="xr-btn--red"
              icon="el-icon-delete-solid"
              type="primary"
              @click="thoroughDeleteTask">彻底删除</el-button>
            <el-button
              v-if="showArchiveBtn"
              class="xr-btn--green"
              icon="wk wk-archive"
              type="primary"
              @click="moreArchive">归档</el-button>
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
          <div
            v-if="!nameVinput"
            :class="['task-name', { 'is-checked': taskData.checked }]"
            @click="nameVinput = true, taskDataName = taskData.name">{{ taskData.name }}</div>
          <div
            v-else
            class="show-input">
            <el-input
              v-model="taskDataName"
              :maxlength="50"
              size="medium" />
            <div class="btn-box">
              <el-button
                type="primary"
                size="mini"
                @click="submiteTaskName(taskDataName)">保 存</el-button>
              <el-button
                size="mini"
                @click="nameVinput = false">取 消</el-button>
            </div>
          </div>
        </flexbox>

        <flexbox class="task-hd__bottom">
          <flexbox-item class="priority">
            <flexbox @click.native="priorityVisible = true">
              <el-popover
                v-model="priorityVisible"
                popper-class="no-padding-popover"
                placement="bottom"
                trigger="click">
                <flexbox class="priority-select">
                  <div
                    v-for="(item, index) in priorityList"
                    :key="index"
                    class="priority-select-item"
                    @click="priorityBtn(item, taskData.priority)">
                    <span
                      :style="{ backgroundColor: item.color }"
                      class="priority--icon">{{ item.label }}</span>
                  </div>
                </flexbox>
                <span
                  slot="reference"
                  :style="{ backgroundColor: priority.color }"
                  class="priority--icon">{{ priority.label }}</span>
              </el-popover>
              <div class="head-btn__bd">
                <div class="head-btn__bd--des">优先级</div>
              </div>
            </flexbox>
          </flexbox-item>
          <flexbox-item>
            <xh-user-cell
              :value="taskData.mainUser ? [taskData.mainUser] : []"
              :info-request="ownerListRequest"
              :info-params="ownerListParams"
              style="width: 100%;"
              placement="top"
              radio
              @value-change="mainUserChange">
              <flexbox
                slot="reference"
                class="head-btn">
                <i
                  v-if="!taskData.mainUser"
                  class="wk wk-l-plus head-btn__icon is-null" />
                <div
                  v-photo="taskData.mainUser"
                  v-lazy:background-image="$options.filters.filterUserLazyImg(taskData.mainUser.img)"
                  v-else
                  :key="taskData.mainUser.img"
                  class="div-photo" />
                <div class="head-btn__bd">
                  <div
                    v-if="taskData.mainUser"
                    class="head-btn__bd--title">{{ taskData.mainUser.realname }}</div>
                  <div class="head-btn__bd--des">负责人</div>
                </div>
                <i
                  v-show="taskData.mainUser"
                  class="el-icon-close head-btn__close"
                  @click="submiteMainUser(null)" />
              </flexbox>
            </xh-user-cell>
          </flexbox-item>
          <flexbox-item>
            <flexbox class="head-btn">
              <i
                :class="[ taskData.startTime ? 'is-valve' : 'is-null']"
                class="wk wk-l-time head-btn__icon" />
              <el-date-picker
                v-model="taskData.startTime"
                :clearable="false"
                type="date"
                value-format="yyyy-MM-dd"
                @change="timeChange('startTime')" />
              <div class="head-btn__bd">
                <div
                  v-if="taskData.startTime"
                  class="head-btn__bd--title">{{ taskData.startTime | moment('MM月DD日') }}</div>
                <div class="head-btn__bd--des">开始时间</div>
              </div>
              <i
                v-show="taskData.startTime"
                class="el-icon-close head-btn__close"
                @click="deleteTime('startTime')" />
            </flexbox>
          </flexbox-item>
          <flexbox-item>
            <flexbox class="head-btn">
              <i
                :class="[ taskData.stopTime ? 'is-valve' : 'is-null']"
                class="wk wk-l-minus head-btn__icon" />
              <el-date-picker
                v-model="taskData.stopTime"
                :clearable="false"
                type="date"
                value-format="yyyy-MM-dd"
                @change="timeChange('stopTime')" />
              <div class="head-btn__bd">
                <div
                  v-if="taskData.stopTime"
                  class="head-btn__bd--title">{{ taskData.stopTime | moment('MM月DD日') }}</div>
                <div class="head-btn__bd--des">结束时间</div>
              </div>
              <i
                v-show="taskData.stopTime"
                class="el-icon-close head-btn__close"
                @click="deleteTime('stopTime')" />
            </flexbox>
          </flexbox-item>
        </flexbox>
      </div>

      <flexbox
        v-if="taskData"
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
                  :user-params="ownerListParams"
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
                v-for="(item, index) in labelList"
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
                      @click="submiteDescription">保 存</el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="addDescriptionShow = false">取 消</el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 相关信息 -->
            <div class="section">
              <div class="section__hd">
                <i class="wukong wukong-relevance" />
                <span>相关信息</span>
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
                <span>子任务({{ subTaskDoneNum }}/{{ taskData.childTask.length }})</span>
              </div>
              <div class="section__bd">
                <div v-if="taskData.pid == 0">
                  <div>
                    <template v-if="taskData.childTask.length != 0">
                      <el-progress
                        :percentage="subTaskProgress"
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

        <div class="main__bd--right">
          <el-tabs
            value="comment"
            type="border-card"
            class="d-container-bd--right">
            <el-tab-pane
              label="评论"
              name="comment"
              lazy>
              <flexbox
                v-loading="commentsLoading"
                direction="column"
                align="stretch"
                class="comment-cells">
                <comment-list
                  ref="comment_list"
                  :id="taskData.taskId"
                  :list="replyList"
                  type="1"
                  @close-other-reply="$refs.f_reply.toggleFocus(true)" />
                <reply-comment
                  ref="f_reply"
                  @toggle="closeOtherReply"
                  @reply="handleReply" />
              </flexbox>
            </el-tab-pane>
            <el-tab-pane
              label="活动"
              name="activity"
              lazy>
              <div class="activity-cells">
                <flexbox
                  v-for="(item, index) in activityList"
                  :key="index"
                  align="stretch"
                  class="activity-cell">
                  <div
                    v-photo="item"
                    v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
                    :key="item.img"
                    class="div-photo" />
                  <div class="activity-cell__bd">
                    <div class="activity-info">
                      <span class="activity-info--name">{{ item.realname }}</span>
                      <span class="activity-info--time">{{ item.createTime }}</span>
                    </div>
                    <div class="activity-content">{{ item.content }}</div>
                  </div>
                </flexbox>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

      </flexbox>
    </flexbox>

    <c-r-m-full-screen-detail
      :visible.sync="showRelatedDetail"
      :crm-type="relatedCRMType"
      :id="relatedID" />
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
// 项目参与人
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
// 相关信息 - 选中列表
import relatedBusiness from '@/components/relatedBusiness'
import { XhUserCell } from '@/components/CreateCom'
import FileCell from '@/views/OAManagement/components/fileCell'
import { mapGetters } from 'vuex'
import CommentList from '@/views/workLog/components/commentList'
import ReplyComment from '@/components/ReplyComment'

export default {
  name: 'TaskDetail',
  components: {
    SlideView,
    membersDep,
    emoji,
    relatedBusiness,
    TagIndex,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue'),
    SubTask,
    FileCell,
    XhUserCell,
    CommentList,
    ReplyComment
  },
  props: {
    id: [String, Number],
    detailIndex: Number,
    detailSection: Number,
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
      // 紧急弹出框
      priorityVisible: false,
      // 优先级列表
      priorityList: [
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
      subTaskDoneNum: 0,
      // 是否显示评论框
      addComments: false,
      allData: {},
      commentsLoading: false,
      // 相关详情的查看
      relatedID: '',
      relatedCRMType: '',
      showRelatedDetail: false,
      // 子任务ID
      subTaskID: null,
      // 任务详情
      taskData: null,
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

    /**
     * 是归档
     */
    isArchive() {
      return this.taskData.isArchive == 1 && this.taskData.ishidden != 1
    },

    /**
     * 是回收站
     */
    isRecycle() {
      return this.taskData.ishidden == 1
    },

    /**
     * 展示归档
     */
    showArchiveBtn() {
      return this.workId && !this.isArchive && !this.isRecycle
    },

    /**
     * 子任务完成进度
     */
    subTaskProgress() {
      if (this.subTaskDoneNum == 0) {
        return 0
      }
      return parseInt(
        (this.subTaskDoneNum / this.taskData.childTask.length) * 100
      )
    },

    ownerListRequest() {
      return this.workId ? workWorkOwnerListAPI : null
    },

    ownerListParams() {
      return this.workId ? { workId: this.workId } : null
    },

    /**
     * 项目ID 说明是项目
     */
    workId() {
      return this.taskData.workId
    },

    /**
     * 标签
     */
    labelList() {
      if (!this.taskData) {
        return null
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

    labelList(newValue, oldValue) {
      if (oldValue) {
        this.$emit('on-handle', {
          type: 'change-label',
          value: newValue,
          index: this.detailIndex,
          section: this.detailSection
        })
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getDetail()
      this.getCommentList()
      this.getActivityList()
    }
  },

  beforeDestroy() {},
  methods: {
    initInfo() {
      this.taskData = null
      this.subTaskDoneNum = 0
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

    /**
     * 详情
     */
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
                this.subTaskDoneNum++
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

    /**
     * 活动信息
     */
    getActivityList() {
      queryLogTaskAPI({
        taskId: this.id
      })
        .then(res => {
          this.activityList = res.data
        })
        .catch(() => {})
    },

    /**
     * 评论信息
     */
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
          // this.$emit('on-handle', {
          //   type: 'title-check',
          //   value: !this.taskData.checked,
          //   index: this.detailIndex,
          //   section: this.detailSection
          // })
          this.taskData.checked = !this.taskData.checked
        })
    },

    /**
     * 关闭
     */
    closeBtn() {
      this.$emit('close')
    },

    /**
     * 紧急按钮
     */
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
        this.subTaskDoneNum++
      } else {
        this.$set(val, 'checked', false)
        this.subTaskDoneNum--
      }
      // this.$emit('on-handle', {
      //   type: 'change-sub-task',
      //   value: {
      //     subdonecount: this.subTaskDoneNum,
      //     allcount: this.taskData.childTask.length
      //   },
      //   index: this.detailIndex,
      //   section: this.detailSection
      // })
      setTaskAPI({
        taskId: val.taskId,
        status: e ? 5 : 1
      })
        .then(res => {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskDoneNum,
              allcount: this.taskData.childTask.length
            },
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {
          this.$message.error('子任务标记失败')
          if (e) {
            this.$set(val, 'checked', false)
            this.subTaskDoneNum--
          } else {
            this.$set(val, 'checked', true)
            this.subTaskDoneNum++
          }
          // this.$emit('on-handle', {
          //   type: 'change-sub-task',
          //   value: {
          //     subdonecount: this.subTaskDoneNum,
          //     allcount: this.taskData.childTask.length
          //   },
          //   index: this.detailIndex,
          //   section: this.detailSection
          // })
          // this.$emit('', val, e)
        })
    },
    /**
     * 参与人操作
     */
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

    /**
     * 参与人删除按钮
     */
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

    /**
     * 编辑负责人
     */
    mainUserChange(data) {
      const mainUser = data.value.length > 0 ? data.value[0] : null
      this.submiteMainUser(mainUser)
    },

    /**
     * 上传负责人信息
     */
    submiteMainUser(mainUser) {
      setTaskAPI({
        taskId: this.id,
        mainUserId: mainUser ? mainUser.userId : ''
      })
        .then(res => {
          if (mainUser) {
            this.$set(this.taskData, 'mainUser', mainUser)
          } else {
            this.$set(this.taskData, 'mainUser', null)
          }

          this.$emit('on-handle', {
            type: 'change-main-user',
            value: mainUser,
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {})
    },

    /**
     * 编辑任务名
     */
    submiteTaskName(val) {
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

    /**
     * 截至日期API
     */
    deleteTime(type) {
      this.taskData[type] = ''
      this.timeChange(type)
    },

    timeChange(type) {
      const params = { taskId: this.id }
      params[type] = this.taskData[type]
      setTaskAPI(params)
        .then(res => {
          this.$emit('on-handle', {
            type: type,
            value: this[type],
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {})
    },

    /**
     * 描述提交按钮
     */
    submiteDescription() {
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

    /**
     * 评论发布
     */
    handleReply(data) {
      if (data) {
        this.commentsLoading = true
        setCommentAPI({
          typeId: this.id,
          type: 1,
          content: xss(data)
        })
          .then(res => {
            res.data.childCommentList = []
            res.data.user = {
              userId: this.userInfo.id,
              realname: this.userInfo.realname,
              img: this.userInfo.img
            }
            this.replyList.push(res.data)
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

    // 相关信息提交按钮
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
          this.$emit('on-handle', {
            type: 'relation-business',
            index: this.detailIndex,
            section: this.detailSection
          })
        })
        .catch(() => {})
    },

    /**
     * 查看相关详情
     */
    checkRelatedDetail(crmType, item) {
      this.relatedID = item.key
      this.relatedCRMType = crmType
      this.showRelatedDetail = true
    },

    /**
     * 删除任务
     */
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
                this.subTaskDoneNum--
                this.$emit('on-handle', {
                  type: 'change-sub-task',
                  value: {
                    subdonecount: this.subTaskDoneNum,
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

    /**
     * 编辑子任务
     */
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

    /**
     * 子任务回调
     */
    handleSubTasksBlock(data, item) {
      if (data.type == 'edit') {
        this.$set(item, 'showEdit', false)
      } else if (data.type == 'add') {
        this.addSubtasks = true
        if (data.result == 'success') {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskDoneNum,
              allcount: this.taskData.childTask.length + 1
            },
            index: this.detailIndex,
            section: this.detailSection
          })
        } else {
          this.$emit('on-handle', {
            type: 'change-sub-task',
            value: {
              subdonecount: this.subTaskDoneNum,
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

    /**
     * 删除截止时间
     */
    deleteTimeTop() {
      setTaskAPI({
        taskId: this.id,
        stopTime: ''
      })
        .then(res => {
          this.$set(this.taskData, 'stopTime', '')
          this.$emit('on-handle', {
            type: 'stop-time',
            index: this.detailIndex,
            section: this.detailSection
          })
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
    morkDropdownClick(command) {
      this.moreDelete()
    },

    /**
     * 关闭页面
     */
    hideView() {
      this.$emit('close')
      this.$emit('hide-view')
    },

    /**
     * 日志评论
     */

    closeOtherReply(flag) {
      if (!flag && this.$refs.comment_list) {
        this.$refs.comment_list.closeReply()
      }
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
      /deep/ .el-tabs__item {
        color: #333;
        font-size: 12px;
        top: 2px;
        margin-top: -2px;
      }

      /deep/ .el-tabs__nav-scroll {
        min-height: 39px;
      }

      /deep/ .el-tabs__item.is-active {
        border-top: 2px solid $xr-color-primary;
        color: #333;
      }

      /deep/ .el-tabs {
        box-shadow: none;
        border-right: none;
        height: 100%;
      }

      /deep/ .el-tabs__content {
        height: calc(100% - 40px) !important;
        overflow: auto;
        overflow-y: overlay;
        position: relative;
        .el-tab-pane {
          height: 100%;
        }
      }

      width: 300px;
      min-width: 300px;
      box-shadow: none;
      flex-shrink: 0;
      height: calc(100% - 15px);
      background-color: white;
      margin-left: 15px;
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

    .xr-btn--green {
      margin-right: 9px;
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

      .priority--icon {
        margin-right: 8px;
      }

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
  cursor: pointer;
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
  }
}

.priority-select {
  margin: 10px;
  &-item {
    cursor: pointer;
    padding: 5px;
  }

  &-item:hover {
    background-color: #ecf5ff;
  }
}

// 操作图标
.head-btn {
  cursor: pointer;
  position: relative;
  min-height: 34px;

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

  .div-photo {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  &__bd {
    flex: 1;
    padding-right: 8px;
    &--title {
      color: #333333;
      font-size: 16px;
      margin-bottom: 3px;
    }

    &--des {
      color: #999;
    }
  }

  &__close {
    flex-shrink: 0;
    color: #999;
    font-size: 16px;
    opacity: 0;
  }

  &__close:hover {
    color: #fa6060;
  }
}

.head-btn:hover {
  .head-btn__icon.is-null {
    color: $xr-color-primary;
    background-color: $btn-b-hover-color;
  }

  .head-btn__close {
    opacity: 1;
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
    opacity: 0;
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

// 活动

.activity-cells {
  .activity-cell {
    padding: 10px 0;
    color: #333;

    .div-photo {
      width: 26px;
      height: 26px;
      border-radius: 13px;
      margin-right: 10px;
    }

    &__bd {
      flex: 1;
      margin-top: 3px;
      .activity-info {
        &--name {
          font-size: 14px;
          color: #333;
          margin-right: 5px;
          font-weight: 600;
        }

        &--time {
          font-size: 12px;
          color: #999;
        }
      }

      .activity-content {
        margin-top: 5px;
        font-size: 14px;
        color: #666;
        line-height: 17px;
      }
    }
  }
}

// 评论
.comment-cells {
  height: 100%;
  .comment-list {
    flex: 1;
    overflow: auto;
    /deep/ .user-info {
      .user-img {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        margin-right: 10px;
      }

      .user {
        font-size: 14px;
        color: #333;
        font-weight: 600;
      }
    }

    /deep/ .reply {
      border-bottom: none;
      padding: 0 0 20px;
      .content {
        margin-left: 40px;
      }

      .child-content {
        margin-top: 5px;
        margin-left: 40px;
      }
    }

    /deep/ .reply:hover {
      background-color: white;
    }
  }

  .reply-comment {
    flex-shrink: 0;
    margin-top: 15px;
  }
}

.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 60px;
  bottom: 0px;
  right: 0px;
}
</style>

