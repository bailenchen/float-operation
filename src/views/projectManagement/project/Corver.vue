<template>
  <div class="corver">
    <xr-header
      icon-class="wk wk-project"
      icon-color="#4AB8B8"
      label="项目" />
    <div v-loading="loading" class="content">
      <el-tabs v-model="tabName" @tab-click="tabChange">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name">
          <draggable
            v-model="item.list"
            :options="{ forceFallback: false, disabled: tabName == 'star' }"
            class="cover-content"
            @end="moveItem">
            <div
              v-src:background-image="item.coverUrl || defaultCorverUrl"
              v-for="(item, index) in item.list"
              :key="index"
              class="cover-content-item"
              @click.native="enterDetail(item)">
              <div class="handle-bar">
                <div :title="item.name" class="title text-one-line">{{ item.name }}</div>
                <i class="wk wk-circle-edit" />
                <i
                  :class="{ 'is-collect': item.collect == 1 }"
                  class="wk wk-focus-on"
                  @click.stop="collectClick(item)" />
              </div>
            </div>
            <div
              class="content-cross"
              @click="createProjectClick">
              <i class="wk wk-l-plus" />
              <div>创建新项目</div>
            </div>
          </draggable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-project
      v-if="isCreate"
      @save-success="createSuccess"
      @close="isCreate = false"/>
  </div>
</template>

<script>
import { workIndexWorkListAPI } from '@/api/projectManagement/task'
import { workWorkCollectAPI, workupdateWorkOrderAPI } from '@/api/projectManagement/project'

import XrHeader from '@/components/xr-header'
import AddProject from '../components/addProject'

import Draggable from 'vuedraggable'

export default {
  // 项目封面展示
  name: 'Corver',
  components: {
    XrHeader,
    AddProject,
    Draggable
  },
  props: {},
  data() {
    return {
      loading: true,
      isCreate: false,
      list: [],
      defaultCorverUrl: 'https://www.72crm.com/api/uploads/project-cover-1.jpg',
      tabName: 'all',
      tabList: [
        {
          label: '$()全部项目',
          name: 'all',
          list: []
        },
        {
          label: '我关注的',
          name: 'star',
          list: []
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    tabChange(tab, event) {
      console.log(tab, event)
    },

    /**
     * 获取列表
     */
    getList() {
      this.loading = true
      workIndexWorkListAPI()
        .then(res => {
          this.loading = false
          this.list = res.data || []
          const allItem = this.tabList[0]
          allItem.list = res.data || []
          allItem.label = `全部项目（${allItem.list.length}）`

          const starItem = this.tabList[1]
          starItem.list = this.list.filter(item => {
            return item.collect == 1
          })
          starItem.label = `我关注的（${starItem.list.length}）`
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 收藏
     */
    collectClick(item) {
      workWorkCollectAPI({ workId: item.workId })
        .then(res => {
          // item.collect = item.collect == 0 ? 1 : 0
          this.getList()
        })
        .catch(() => {})
    },


    /**
     * 拖拽
     */
    moveItem(evt) {
      if (evt) {
        // 如果没有进行移动 不做处理
        if (evt.oldIndex == evt.newIndex) {
          return
        }

        workupdateWorkOrderAPI({
          workIds: this.tabList[0].list.map(item => {
            return item.workId
          })
        })
          .then(res => {})
          .catch(() => {})
      }
    },

    /**
     * 进入详情
     */
    enterDetail(item) {
      this.$router.push({
        name: 'project-list',
        params: {
          id: item.workId
        }
      })
    },

    /**
     * 创建项目
     */
    createProjectClick() {
      this.isCreate = true
    },

    /**
     * 创建成功
     */
    createSuccess() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.corver {
  height: 100%;
  overflow: hidden;
  position: relative;
  .content {
    background-color: white;
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
    overflow-y: auto;
    border: 1px solid #e6e6e6;
    padding: 10px 12px 15px;
  }
}

/deep/ .el-tabs {
  height: 100%;

  .el-tabs__header {
    margin: 0 8px 15px;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__content {
    height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.cover-content {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: row;

  &-item {
    position: relative;
    flex: none;
    width: 200px;
    margin: 8px;
    height: 100px;
    box-shadow: 0 0 0 rgba(0,0,0,0.15);
    transition: box-shadow 0.218s ease;
    border-radius: $xr-border-radius-base;
    cursor: pointer;

    .handle-bar {
      text-align: right;
      margin: 10px;

      .title {
        text-align: left;
        color: white;
        width: calc(100% - 45px);
        display: inline-block;
      }

      i {
        color: white;
        cursor: pointer;
      }

      .wk-focus-on.is-collect {
        color: #F7AD3D;
      }

      .wk-circle-edit {
        visibility: hidden;
      }
    }

    &:hover {
      .wk-circle-edit {
        visibility: visible;
      }
    }
  }

  .content-cross {
    flex-shrink: 0;
    width: 200px;
    margin: 8px;
    height: 100px;
    cursor: pointer;
    border-radius: $xr-border-radius-base;
    position: relative;
    text-align: center;
    border: 1px #c0ccda solid;
    margin-bottom: 5px;
    color: #999;
    background: #EEEDED;

    .wk-l-plus {
      margin-top: 25px;
      display: inline-block;
      font-size: 16px;
    }

    div {
      margin-top: 10px;
    }

    &:hover {
      background: rgba($color: $xr-color-primary, $alpha: 0.1);
      color: $xr-color-primary;
    }
  }
}
</style>
