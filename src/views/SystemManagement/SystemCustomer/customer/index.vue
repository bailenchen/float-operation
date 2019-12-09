<template>
  <div class="main">
    <xr-header
      icon-class="wk wk-s-seas"
      icon-color="#487DFF"
      label="客户公海规则设置" />
    <div class="main-body">
      <div class="main-table-header">
        <reminder
          :content="`提示：1、系统在每天的24:00~6:00统一将符合规则的客户退回到公海池<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、当一个客户满足多个公海客户规则时会同时掉入多个公海<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、若修改了“自动划入规则”，新的规则将于 次日生效 ，在此之前客户公海成员的数据还是会遵循原规则进行划入`"
          class="xr-reminder"/>
        <el-button
          class="main-table-header-button xr-btn--orange"
          icon="el-icon-plus"
          type="primary"
          @click="addClick">新建公海</el-button>
      </div>
      <el-table
        v-loading="loading"
        id="examine-table"
        :data="list"
        :height="tableHeight"
        class="main-table"
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick">
        <el-table-column
          show-overflow-tooltip
          prop="roleName"
          width="150"
          label="公海名称"/>
        <el-table-column
          show-overflow-tooltip
          prop="remark"
          label="公海管理员"/>
        <el-table-column
          show-overflow-tooltip
          prop="remark"
          label="公海成员"/>
        <el-table-column
          show-overflow-tooltip
          prop="remark"
          label="客户数量"/>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick('disabled', scope)">停用</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleClick('transfer', scope)">转移</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleClick('edit', scope)">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleClick('delete', scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pool-add
      v-if="createShow"
      :action="createAction"
      @hiden-view="createShow=false" />
  </div>
</template>

<script>
import {
  systemRoleQueryProjectRoleListAPI,
  systemRoleDeleteWorkRoleAPI
} from '@/api/systemManagement/project'

import Reminder from '@/components/reminder'
import XrHeader from '@/components/xr-header'
import PoolAdd from './components/PoolAdd'

export default {
  /** 系统管理 的 客户规则公海设置 */
  name: 'SystemPool',
  components: {
    Reminder,
    XrHeader,
    PoolAdd
  },
  mixins: [],
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 239, // 表的高度
      list: [],
      createAction: {
        type: 'save'
      },
      createShow: false
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 239
    }

    this.getList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      systemRoleQueryProjectRoleListAPI()
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     *  添加权限
     */
    addClick() {
      this.createAction = {
        type: 'save'
      }
      this.createShow = true
    },

    /** 列表操作 */
    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {},

    /**
     * 编辑删除
     */
    handleClick(type, scope) {
      if (type === 'edit') {
        this.createAction = {
          type: 'update',
          data: scope.row
        }
        this.createShow = true
      } else if (type === 'delete') {
        // 启用停用
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            systemRoleDeleteWorkRoleAPI({
              roleId: scope.row.roleId
            })
              .then(res => {
                this.list.splice(scope.$index, 1)
                this.$message({
                  type: 'success',
                  message: '操作成功'
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height:100%;

  /deep/ .xr-header {
    padding: 15px 30px;
  }
}

.main-body {
  background-color: white;
  border-top: 1px solid $xr-border-line-color;
  border-bottom: 1px solid $xr-border-line-color;
}

.main-table-header {
  background-color: white;
  position: relative;
  overflow: hidden;
  .main-table-header-button {
    float: right;
    margin-right: 20px;
    margin-top: 10px;
  }
}

.xr-reminder {
  width: auto;
  float: left;
  margin: 10px 20px;
}

@import '../../styles/table.scss';
</style>
